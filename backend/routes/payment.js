import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { protect } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendOrderNotification, sendCustomerOrderConfirmation } from '../utils/sendEmail.js';
import ithinkLogistics from '../utils/ithinkLogistics.js';

const router = express.Router();

// Lazy initialize Razorpay (called when needed, after env vars are loaded)
let razorpayInstance = null;
const getRazorpay = () => {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

// @route   POST /api/payment/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount',
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
      },
    };

    const razorpay = getRazorpay();
    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order',
    });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment and update order (Step 3: After payment)
// @access  Public (for guest checkout)
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,  // Our database order ID
    } = req.body;

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      // Mark order as failed
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: 'Failed',
          orderStatus: 'Cancelled'
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }

    // Find existing order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify Razorpay order ID matches
    if (order.paymentDetails.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID mismatch'
      });
    }

    // Payment verified - Update order to PAID
    order.paymentStatus = 'Paid';
    order.isPaid = true;
    order.paidAt = Date.now();
    order.orderStatus = 'Confirmed';
    order.paymentDetails = {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paidAt: Date.now()
    };

    await order.save();

    // Populate user if registered, otherwise skip
    if (order.user) {
      await order.populate('user', 'name email');
    }
    await order.populate('items.product');

    console.log('Payment successful for order:', order.orderNumber);

    // Return success response immediately to user
    res.json({
      success: true,
      data: order,
      message: 'Payment verified successfully',
    });

    // Process shipment creation and emails asynchronously in background
    // This doesn't block the user's redirect to order page
    (async () => {
      try {
        // Create shipment with iThink Logistics
        if (order.shippingAddress && order.shippingAddress.pincode) {
          console.log('📦 Creating shipment with iThink Logistics...');

          // Calculate total weight based on items (default 0.5kg per item)
          const totalWeight = order.items.reduce((acc, item) => acc + (item.quantity * 0.5), 0);

          const shipmentData = {
            orderId: order.orderNumber,
            orderDate: order.createdAt,
            shippingAddress: order.shippingAddress,
            billingAddress: order.shippingAddress, // Use shipping as billing if not separate
            items: order.items.map(item => ({
              name: item.name,
              productId: item.productId,
              sku: item.productId,
              quantity: item.quantity,
              price: item.priceNumeric,
              discount: 0,
              hsnCode: '00000',
            })),
            pricing: {
              totalAmount: order.totalPrice,
              shippingPrice: order.shippingPrice,
              discount: order.coupon?.discount || 0,
              transactionFee: 0,
            },
            dimensions: {
              weight: totalWeight,
              length: 15,
              width: 15,
              height: 10,
            },
            paymentMode: order.paymentMethod === 'razorpay' ? 'prepaid' : 'COD',
          };

          console.log('📦 Shipment data:', JSON.stringify(shipmentData, null, 2));

          const shipmentResult = await ithinkLogistics.createShipment(shipmentData);

          console.log('📦 Shipment API response:', JSON.stringify(shipmentResult, null, 2));

          // Check if shipment was created successfully
          // iThink API returns status as string "success" or "error", not boolean
          if (shipmentResult && (shipmentResult.status === 'success' || shipmentResult.status === true)) {
            // Extract AWB number from response
            // API can return in different formats:
            // 1. data.awb_number_list[0]
            // 2. data.awb
            // 3. data["1"].waybill (for batch creation)
            let awbNumber = shipmentResult.data?.awb_number_list?.[0] || shipmentResult.data?.awb;

            // Check batch response format
            if (!awbNumber && shipmentResult.data) {
              const firstKey = Object.keys(shipmentResult.data)[0];
              if (firstKey && shipmentResult.data[firstKey]) {
                awbNumber = shipmentResult.data[firstKey].waybill || shipmentResult.data[firstKey].awb;
              }
            }

            if (awbNumber) {
              // Extract courier name
              let courierName = shipmentResult.data?.courier_name;
              if (!courierName && shipmentResult.data) {
                const firstKey = Object.keys(shipmentResult.data)[0];
                if (firstKey && shipmentResult.data[firstKey]) {
                  courierName = shipmentResult.data[firstKey].logistic_name;
                }
              }

              // Update order with shipping details
              order.shippingDetails = {
                provider: 'ithink_logistics',
                awbNumber: awbNumber.toString(),
                trackingId: awbNumber.toString(),
                courierName: courierName || 'Delhivery',
                shipmentId: shipmentResult.data?.shipment_id,
                shippingStatus: 'created',
                createdAt: new Date(),
                statusHistory: [{
                  status: 'created',
                  message: 'Shipment created successfully',
                  timestamp: new Date(),
                }],
              };

              await order.save();
              console.log('✅ Shipment created successfully with AWB:', awbNumber);
            } else {
              console.error('⚠️ No AWB number in successful response:', shipmentResult);
            }
          } else {
            console.error('❌ Shipment creation returned error status:', shipmentResult);
          }
        }
      } catch (shipmentError) {
        console.error('❌ Shipment creation failed with exception:', shipmentError);
        console.error('❌ Full shipment error:', shipmentError.response?.data || shipmentError.message);
        // Admin can create shipment manually later if this fails
      }

      // Send email notification to admin
      try {
        const emailResult = await sendOrderNotification(order, order.user || { name: order.guestName, email: order.guestEmail });
        if (emailResult.success) {
          console.log('✅ Admin notification email sent successfully');
        } else {
          console.log('⚠️ Failed to send admin notification email:', emailResult.message);
        }
      } catch (emailError) {
        console.error('❌ Error sending admin notification email:', emailError);
      }

      // Send order confirmation email to customer
      try {
        const customerEmailResult = await sendCustomerOrderConfirmation(order);
        if (customerEmailResult.success) {
          console.log('✅ Customer confirmation email sent successfully');
        } else {
          console.log('⚠️ Failed to send customer confirmation email:', customerEmailResult.message);
        }
      } catch (customerEmailError) {
        console.error('❌ Error sending customer confirmation email:', customerEmailError);
      }
    })().catch(error => {
      console.error('❌ Background tasks failed:', error);
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed',
    });
  }
});

// @route   GET /api/payment/key
// @desc    Get Razorpay key ID
// @access  Public (needed for frontend)
router.get('/key', (req, res) => {
  res.json({
    success: true,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

export default router;
