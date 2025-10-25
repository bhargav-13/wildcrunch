import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { protect } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendOrderNotification } from '../utils/sendEmail.js';

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
// @access  Private
router.post('/verify', protect, async (req, res) => {
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

    // Verify user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
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
    await order.populate('user', 'name email');
    await order.populate('items.product');

    console.log('Payment successful for order:', order.orderNumber);

    // Send email notification to admin
    try {
      const emailResult = await sendOrderNotification(order, order.user);
      if (emailResult.success) {
        console.log('✅ Admin notification email sent successfully');
      } else {
        console.log('⚠️ Failed to send admin notification email:', emailResult.message);
      }
    } catch (emailError) {
      console.error('❌ Error sending admin notification email:', emailError);
      // Don't fail the payment verification if email fails
    }

    res.json({
      success: true,
      data: order,
      message: 'Payment verified successfully',
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
