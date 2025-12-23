import express from 'express';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';
import ithinkLogistics from '../utils/ithinkLogistics.js';

const router = express.Router();

// Lazy initialize Razorpay
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

// @route   POST /api/orders/guest/create
// @desc    Create unpaid guest order from localStorage cart data
// @access  Public (no authentication required)
router.post('/guest/create', async (req, res) => {
  console.log('🛒 CREATE GUEST ORDER - Route hit!');

  try {
    const { items, couponCode, couponDiscount } = req.body;
    console.log('🎟️ Coupon data received:', { couponCode, couponDiscount });

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Verify products and build order items with ObjectIds
    const orderItems = [];
    let itemsPrice = 0;

    for (const cartItem of items) {
      const product = await Product.findById(cartItem.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${cartItem.productId} not found`
        });
      }

      const itemPrice = cartItem.packPrice || cartItem.priceNumeric;

      orderItems.push({
        product: product._id,  // MongoDB ObjectId
        productId: cartItem.productId,
        name: cartItem.name,
        price: cartItem.price,
        priceNumeric: cartItem.priceNumeric,
        imageSrc: cartItem.imageSrc,
        weight: cartItem.weight,
        quantity: cartItem.quantity,
        pack: cartItem.pack || '1',
        packPrice: cartItem.packPrice
      });

      itemsPrice += itemPrice * cartItem.quantity;
    }

    // Shipping will be calculated after address is provided
    const shippingPrice = 0; // Will be updated when address is added
    const discount = couponDiscount || 0;
    const totalPrice = itemsPrice + shippingPrice - discount;

    console.log('💰 Price breakdown:', {
      itemsPrice,
      shippingPrice,
      couponDiscount,
      discount,
      totalPrice,
      couponCode
    });
    console.log(`💰 Creating Razorpay order for amount: ₹${totalPrice}`);

    // Create Razorpay order
    let razorpayOrder;
    try {
      const razorpay = getRazorpay();
      razorpayOrder = await razorpay.orders.create({
        amount: Math.round(totalPrice * 100), // Amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          guestOrder: true,
        },
      });
      console.log(`✅ Razorpay order created: ${razorpayOrder.id}`);
    } catch (razorpayError) {
      console.error('❌ Razorpay order creation failed:', razorpayError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create payment order. Please try again.'
      });
    }

    // Generate order number
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `WC-${timestamp}-${random}`;

    console.log(`📝 Creating database order: ${orderNumber}`);

    const couponData = couponCode ? {
      code: couponCode,
      discount: discount
    } : undefined;

    console.log('💾 Saving coupon to order:', couponData);

    // Create order with UNPAID status
    let order;
    try {
      order = await Order.create({
        isGuest: true,
        orderNumber: orderNumber,
        items: orderItems,
        paymentMethod: 'razorpay',
        paymentStatus: 'Pending',  // Unpaid initially
        isPaid: false,
        itemsPrice,
        shippingPrice,
        totalPrice,
        coupon: couponData,
        paymentDetails: {
          razorpayOrderId: razorpayOrder.id  // Save Razorpay order ID
        }
      });

      console.log(`✅ Order created successfully: ${order._id}`);
      console.log('✅ Order coupon saved:', order.coupon);
    } catch (orderError) {
      console.error('❌ Database order creation failed:', orderError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create order. Please try again.'
      });
    }

    res.json({
      success: true,
      data: {
        order,
        razorpayOrder
      },
      message: 'Guest order created successfully'
    });

  } catch (error) {
    console.error('❌ Create guest order error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/orders/calculate-shipping
// @desc    Calculate shipping rate for cart
// @access  Public (no authentication required for guest checkout)
router.post('/calculate-shipping', async (req, res) => {
  try {
    const { pincode, cartTotal } = req.body;

    if (!pincode) {
      return res.status(400).json({
        success: false,
        message: 'Delivery pincode is required',
      });
    }

    // Check pincode serviceability first
    try {
      const pincodeCheck = await ithinkLogistics.checkPincode(pincode);

      if (!pincodeCheck || pincodeCheck.status === false) {
        return res.status(400).json({
          success: false,
          serviceable: false,
          message: 'Delivery not available to this pincode',
        });
      }
    } catch (error) {
      console.error('Pincode check error:', error);
      // Continue with default shipping if API fails
    }

    // Calculate shipping rate
    try {
      console.log(`📍 Calculate shipping: ${pincode} | Cart: ₹${cartTotal}`);

      // Free delivery thresholds
      const REDUCED_DELIVERY_THRESHOLD = 249;
      const FREE_DELIVERY_THRESHOLD = 499;

      let shippingPrice = 60; // Default fallback
      let expectedDeliveryDate = null;

      // Apply free delivery logic based on cart total
      if (cartTotal >= FREE_DELIVERY_THRESHOLD) {
        // Free delivery for orders ₹499+
        shippingPrice = 0;
        console.log(`🎉 FREE DELIVERY applied (Cart total: ₹${cartTotal} >= ₹${FREE_DELIVERY_THRESHOLD})`);
      } else if (cartTotal >= REDUCED_DELIVERY_THRESHOLD) {
        // Reduced delivery charge for orders ₹249+
        shippingPrice = 50;
        console.log(`🚚 REDUCED DELIVERY applied: ₹50 (Cart total: ₹${cartTotal} >= ₹${REDUCED_DELIVERY_THRESHOLD})`);
      } else {
        // For orders below ₹249, fetch actual shipping rate from iThink Logistics
        const rateResult = await ithinkLogistics.getRate({
          fromPincode: '400067', // Your warehouse pincode
          toPincode: pincode,
          weight: 0.5, // Default weight 500g
          paymentMode: 'prepaid',
          productMrp: cartTotal || 100,
        });

        console.log('📦 iThink API Response:', JSON.stringify(rateResult, null, 2));

        if (rateResult?.data && Array.isArray(rateResult.data) && rateResult.data.length > 0) {
          // Get the first available rate
          const firstRate = rateResult.data[0];
          shippingPrice = firstRate.rate || 60;

          // Extract expected delivery from parent response object (not from individual rate)
          expectedDeliveryDate = rateResult.expected_delivery_date ||
                                rateResult.expectedDeliveryDate ||
                                rateResult.edd;

          console.log(`✅ Shipping from API: ₹${shippingPrice} | Expected delivery: ${expectedDeliveryDate || 'Not provided'}`);
        } else {
          console.log(`⚠️ No rate data in response, using default shipping: ₹60`);
          console.log('Response structure:', JSON.stringify(rateResult, null, 2));
        }
      }

      res.json({
        success: true,
        serviceable: true,
        shippingPrice: parseFloat(shippingPrice),
        expectedDeliveryDate: expectedDeliveryDate,
        data: null,
      });
    } catch (error) {
      console.error('Rate calculation error:', error);
      console.error('Full error details:', error.response?.data || error.message);
      // Fallback to fixed shipping
      res.json({
        success: true,
        serviceable: true,
        shippingPrice: 60,
        message: 'Using standard shipping rate',
      });
    }
  } catch (error) {
    console.error('Calculate shipping error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/orders/create-from-cart
// @desc    Create unpaid order from cart (Step 1: After cart, before address)
// @access  Private
router.post('/create-from-cart', protect, async (req, res) => {
  console.log('🛒 CREATE ORDER FROM CART - Route hit!');
  console.log('User:', req.user?._id);

  try {
    const { shippingPrice: customShippingPrice } = req.body;

    // Get cart items
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Verify products and build order items with ObjectIds
    const orderItems = [];
    let itemsPrice = 0;

    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${cartItem.productId} not found`
        });
      }

      const itemPrice = cartItem.packPrice || cartItem.priceNumeric;

      orderItems.push({
        product: product._id,  // MongoDB ObjectId
        productId: cartItem.productId,
        name: cartItem.name,
        price: cartItem.price,
        priceNumeric: cartItem.priceNumeric,
        quantity: cartItem.quantity,
        pack: cartItem.pack || '1',
        packPrice: cartItem.packPrice
      });

      itemsPrice += itemPrice * cartItem.quantity;
    }

    // Use dynamic shipping price if provided, otherwise fallback to fixed
    const shippingPrice = customShippingPrice || 60;
    const totalPrice = itemsPrice + shippingPrice;

    console.log(`💰 Creating Razorpay order for amount: ₹${totalPrice}`);

    // Create Razorpay order
    let razorpayOrder;
    try {
      const razorpay = getRazorpay();
      razorpayOrder = await razorpay.orders.create({
        amount: Math.round(totalPrice * 100), // Amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          userId: req.user._id.toString(),
        },
      });
      console.log(`✅ Razorpay order created: ${razorpayOrder.id}`);
    } catch (razorpayError) {
      console.error('❌ Razorpay order creation failed:', razorpayError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create payment order. Please try again.'
      });
    }

    // Generate order number
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `WC-${timestamp}-${random}`;

    console.log(`📝 Creating database order: ${orderNumber}`);

    // Create order with UNPAID status
    let order;
    try {
      order = await Order.create({
        user: req.user._id,
        orderNumber: orderNumber,
        items: orderItems,
        paymentMethod: 'razorpay',
        paymentStatus: 'Pending',  // Unpaid initially
        isPaid: false,
        itemsPrice,
        shippingPrice,
        totalPrice,
        paymentDetails: {
          razorpayOrderId: razorpayOrder.id  // Save Razorpay order ID
        }
      });

      await order.populate('user', 'name email');
      console.log(`✅ Order created successfully: ${order._id}`);
    } catch (orderError) {
      console.error('❌ Database order creation failed:', orderError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create order in database. Please try again.'
      });
    }

    res.status(201).json({
      success: true,
      data: {
        order,
        razorpayOrderId: razorpayOrder.id,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount
      },
      message: 'Order created successfully. Please add shipping address.'
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/orders/:id/address
// @desc    Add shipping address to order (Step 2: Address page)
// @access  Private
router.put('/:id/address', async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // For guest orders, save email, name, and phone from shipping address
    if (order.isGuest) {
      if (shippingAddress.email) {
        order.guestEmail = shippingAddress.email;
      }
      if (shippingAddress.fullName) {
        order.guestName = shippingAddress.fullName;
      }
      if (shippingAddress.phone) {
        order.guestPhone = shippingAddress.phone;
      }
    }

    // Update shipping address
    order.shippingAddress = shippingAddress;

    // Calculate dynamic shipping based on pincode
    let dynamicShippingPrice = 60; // Default fallback

    if (shippingAddress.pincode) {
      try {
        console.log(`📍 Calculating shipping for pincode: ${shippingAddress.pincode}`);
        console.log(`💰 Order items price: ₹${order.itemsPrice}`);

        // Free delivery thresholds
        const REDUCED_DELIVERY_THRESHOLD = 249;
        const FREE_DELIVERY_THRESHOLD = 499;

        // Apply free delivery logic based on order items price
        if (order.itemsPrice >= FREE_DELIVERY_THRESHOLD) {
          // Free delivery for orders ₹499+
          dynamicShippingPrice = 0;
          console.log(`🎉 FREE DELIVERY applied (Order total: ₹${order.itemsPrice} >= ₹${FREE_DELIVERY_THRESHOLD})`);
        } else if (order.itemsPrice >= REDUCED_DELIVERY_THRESHOLD) {
          // Reduced delivery charge for orders ₹249+
          dynamicShippingPrice = 50;
          console.log(`🚚 REDUCED DELIVERY applied: ₹50 (Order total: ₹${order.itemsPrice} >= ₹${REDUCED_DELIVERY_THRESHOLD})`);
        } else {
          // For orders below ₹249, fetch actual shipping rate from iThink Logistics
          console.log(`📦 Request params:`, {
            fromPincode: '400067',
            toPincode: shippingAddress.pincode,
            weight: 0.5,
            paymentMode: order.paymentMethod === 'razorpay' ? 'prepaid' : 'COD',
            productMrp: order.itemsPrice,
          });

          const rateResult = await ithinkLogistics.getRate({
            fromPincode: '400067', // Your warehouse pincode
            toPincode: shippingAddress.pincode,
            weight: 0.5, // Default weight
            paymentMode: order.paymentMethod === 'razorpay' ? 'prepaid' : 'COD',
            productMrp: order.itemsPrice,
          });

          // Log the full API response for debugging
          console.log('🔍 Full API Response:', JSON.stringify(rateResult, null, 2));

          // Extract shipping price and expected delivery from API response
          if (rateResult?.data && Array.isArray(rateResult.data) && rateResult.data.length > 0) {
            // Get the first available rate (they're all the same in this case)
            const firstRate = rateResult.data[0];
            dynamicShippingPrice = firstRate.rate || 60;

            // Extract expected delivery date
            const expectedDeliveryDate = firstRate.expected_delivery_date || firstRate.expectedDeliveryDate;

            // Store in shippingDetails if available
            if (expectedDeliveryDate) {
              if (!order.shippingDetails) {
                order.shippingDetails = {};
              }
              // Calculate estimated delivery date
              order.shippingDetails.estimatedDelivery = expectedDeliveryDate;
              console.log(`📅 Expected delivery: ${expectedDeliveryDate}`);
            }

            console.log(`✅ Dynamic shipping calculated: ₹${dynamicShippingPrice} from ${firstRate.logistic_name}`);
          } else {
            console.log(`⚠️ Could not find shipping price in API response`);
            console.log(`⚠️ Using default shipping: ₹60`);
          }
        }
      } catch (shippingError) {
        console.error('❌ Shipping calculation error:', shippingError.message);
        console.error('❌ Full error:', shippingError);
        console.log('⚠️ Using default shipping: ₹60');
        // Continue with default shipping price
      }
    }

    // Update shipping price and recalculate total (including coupon discount)
    order.shippingPrice = dynamicShippingPrice;
    const couponDiscount = order.coupon?.discount || 0;
    order.totalPrice = order.itemsPrice + dynamicShippingPrice - couponDiscount;

    console.log(`💰 Order totals updated - Items: ₹${order.itemsPrice}, Shipping: ₹${order.shippingPrice}, Coupon Discount: ₹${couponDiscount}, Total: ₹${order.totalPrice}`);

    // Create new Razorpay order with updated amount
    try {
      const razorpay = getRazorpay();
      const newRazorpayOrder = await razorpay.orders.create({
        amount: Math.round(order.totalPrice * 100), // Amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          orderId: order._id.toString(),
          updated: 'shipping_calculated',
        },
      });

      // Update order with new Razorpay order ID
      order.paymentDetails.razorpayOrderId = newRazorpayOrder.id;
      console.log(`✅ New Razorpay order created: ${newRazorpayOrder.id} for ₹${order.totalPrice}`);
    } catch (razorpayError) {
      console.error('❌ Failed to create new Razorpay order:', razorpayError);
      // Continue with existing Razorpay order - payment might fail but we can handle it
    }

    await order.save();

    res.json({
      success: true,
      data: order,
      message: 'Shipping address added and shipping calculated'
    });
  } catch (error) {
    console.error('Address update error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product');

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Public (for guest orders)
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Guest orders are publicly accessible by order ID
    // No authorization check needed for guest orders

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/orders/:id/pay
// @desc    Update order to paid
// @access  Private
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    order.paymentStatus = 'Paid';
    order.paymentDetails = {
      transactionId: req.body.transactionId,
      paidAt: Date.now()
    };
    order.orderStatus = 'Confirmed';

    const updatedOrder = await order.save();

    res.json({
      success: true,
      data: updatedOrder,
      message: 'Payment confirmed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user owns this order
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    if (order.orderStatus === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel delivered order'
      });
    }

    order.orderStatus = 'Cancelled';
    
    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    const updatedOrder = await order.save();

    res.json({
      success: true,
      data: updatedOrder,
      message: 'Order cancelled'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = orderStatus;
    
    if (orderStatus === 'Delivered') {
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    res.json({
      success: true,
      data: updatedOrder,
      message: 'Order status updated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/orders/:id/tracking
// @desc    Get order tracking details
// @access  Public (for guest orders)
router.get('/:id/tracking', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Guest orders are publicly accessible by order ID
    // No authorization check needed

    // If order has AWB number, fetch latest tracking from iThink Logistics
    if (order.shippingDetails?.awbNumber) {
      try {
        console.log(`📦 Fetching tracking for AWB: ${order.shippingDetails.awbNumber}`);

        const trackingResult = await ithinkLogistics.trackShipment(order.shippingDetails.awbNumber);

        console.log('📦 Tracking result:', JSON.stringify(trackingResult, null, 2));

        // Check if tracking was successful - API returns status_code: 200 or status: 'success'
        const isSuccess = trackingResult && (
          trackingResult.status === 'success' ||
          trackingResult.status === true ||
          trackingResult.status_code === 200 ||
          trackingResult.data
        );

        if (isSuccess) {
          // Extract tracking data from response
          // API returns data in format: { data: { 'AWB_NUMBER': { tracking info } } }
          let trackingData = null;

          if (trackingResult.data) {
            const awbKey = Object.keys(trackingResult.data)[0];
            if (awbKey) {
              trackingData = trackingResult.data[awbKey];
            } else {
              trackingData = trackingResult.data[0] || trackingResult.data;
            }
          }

          if (trackingData && trackingData.current_status) {
            // Map status to our enum values
            const statusMapping = {
              'pending': 'pending',
              'created': 'created',
              'picked up': 'picked_up',
              'in transit': 'in_transit',
              'out for delivery': 'out_for_delivery',
              'delivered': 'delivered',
              'failed': 'failed',
              'cancelled': 'cancelled',
              'rto': 'failed',
              'lost': 'failed',
            };

            const normalizedStatus = trackingData.current_status.toLowerCase();
            const mappedStatus = statusMapping[normalizedStatus] || 'in_transit';

            // Update shipping status
            order.shippingDetails.shippingStatus = mappedStatus;
            order.shippingDetails.lastTrackedAt = new Date();

            await order.save();

            console.log('✅ Tracking updated for user view - Status:', trackingData.current_status);

            res.json({
              success: true,
              data: {
                order: {
                  orderNumber: order.orderNumber,
                  orderStatus: order.orderStatus,
                  createdAt: order.createdAt,
                  totalPrice: order.totalPrice,
                  shippingAddress: order.shippingAddress,
                },
                shipping: order.shippingDetails,
                liveTracking: trackingData
              }
            });
          } else {
            console.log('⚠️ No tracking data in response');
            res.json({
              success: true,
              data: {
                order: {
                  orderNumber: order.orderNumber,
                  orderStatus: order.orderStatus,
                  createdAt: order.createdAt,
                  totalPrice: order.totalPrice,
                  shippingAddress: order.shippingAddress,
                },
                shipping: order.shippingDetails,
                message: 'Tracking data not available yet'
              }
            });
          }
        } else {
          console.log('❌ Tracking API returned error');
          // No live tracking available, return order shipping details
          res.json({
            success: true,
            data: {
              order: {
                orderNumber: order.orderNumber,
                orderStatus: order.orderStatus,
                createdAt: order.createdAt,
                totalPrice: order.totalPrice,
                shippingAddress: order.shippingAddress,
              },
              shipping: order.shippingDetails,
              message: 'Live tracking not available yet'
            }
          });
        }
      } catch (trackingError) {
        console.error('Tracking fetch error:', trackingError);
        // Return order details even if tracking fails
        res.json({
          success: true,
          data: {
            order: {
              orderNumber: order.orderNumber,
              orderStatus: order.orderStatus,
              createdAt: order.createdAt,
              totalPrice: order.totalPrice,
              shippingAddress: order.shippingAddress,
            },
            shipping: order.shippingDetails,
            message: 'Could not fetch live tracking'
          }
        });
      }
    } else {
      // No shipment created yet
      res.json({
        success: true,
        data: {
          order: {
            orderNumber: order.orderNumber,
            orderStatus: order.orderStatus,
            createdAt: order.createdAt,
            totalPrice: order.totalPrice,
            shippingAddress: order.shippingAddress,
          },
          message: 'Shipment not created yet'
        }
      });
    }
  } catch (error) {
    console.error('Get tracking error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/orders/:id/sync-tracking
// @desc    Sync latest tracking status from iThink Logistics (Admin)
// @access  Private/Admin
router.post('/:id/sync-tracking', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!order.shippingDetails?.awbNumber) {
      return res.status(400).json({
        success: false,
        message: 'No AWB number found for this order'
      });
    }

    console.log(`🔄 Syncing tracking for AWB: ${order.shippingDetails.awbNumber}`);

    const trackingResult = await ithinkLogistics.trackShipment(order.shippingDetails.awbNumber);

    console.log('📦 Tracking API response:', JSON.stringify(trackingResult, null, 2));

    // Check if request was successful
    // API returns data directly with status_code: 200, no top-level status field
    const isSuccess = trackingResult && (
      trackingResult.status === 'success' ||
      trackingResult.status === true ||
      trackingResult.status_code === 200 ||
      trackingResult.data  // If data exists, it's likely successful
    );

    if (isSuccess) {
      // Extract tracking data from response
      // API returns data in format: { data: { 'AWB_NUMBER': { tracking info } } }
      let trackingData = null;

      if (trackingResult.data) {
        // Get the first key (AWB number) from data object
        const awbKey = Object.keys(trackingResult.data)[0];
        if (awbKey) {
          trackingData = trackingResult.data[awbKey];
        } else {
          // Fallback to array format
          trackingData = trackingResult.data[0] || trackingResult.data;
        }
      }

      if (trackingData && trackingData.current_status) {
        // Map iThink Logistics status to our enum values
        const statusMapping = {
          'pending': 'pending',
          'created': 'created',
          'picked up': 'picked_up',
          'in transit': 'in_transit',
          'out for delivery': 'out_for_delivery',
          'delivered': 'delivered',
          'failed': 'failed',
          'cancelled': 'cancelled',
          'rto': 'failed',
          'lost': 'failed',
        };

        const normalizedStatus = trackingData.current_status.toLowerCase();
        const mappedStatus = statusMapping[normalizedStatus] || 'in_transit';

        // Update shipping details with latest tracking info
        order.shippingDetails.shippingStatus = mappedStatus;
        order.shippingDetails.lastTrackedAt = new Date();

        // Add to status history if new status
        const lastStatus = order.shippingDetails.statusHistory[order.shippingDetails.statusHistory.length - 1];
        if (!lastStatus || lastStatus.status !== trackingData.current_status) {
          order.shippingDetails.statusHistory.push({
            status: trackingData.current_status,
            message: trackingData.last_scan_details?.scan_datetime || 'Status updated',
            timestamp: new Date(),
            location: trackingData.last_scan_details?.location || ''
          });
        }

        await order.save();
        console.log('✅ Tracking synced successfully - Status:', trackingData.current_status, '→', mappedStatus);

        res.json({
          success: true,
          data: order,
          tracking: trackingData,
          message: 'Tracking synced successfully'
        });
      } else {
        console.error('⚠️ No tracking data in response:', trackingResult);
        res.status(400).json({
          success: false,
          message: 'No tracking data available',
          data: trackingResult
        });
      }
    } else {
      console.error('❌ Tracking returned error status:', trackingResult);
      res.status(400).json({
        success: false,
        message: trackingResult?.message || 'Failed to fetch tracking from logistics provider',
        data: trackingResult
      });
    }
  } catch (error) {
    console.error('❌ Sync tracking error:', error);
    console.error('❌ Full tracking error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/orders/:id/create-shipment
// @desc    Manually create shipment for an order (Admin)
// @access  Private/Admin
router.post('/:id/create-shipment', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if shipment already exists
    if (order.shippingDetails?.awbNumber) {
      return res.status(400).json({
        success: false,
        message: 'Shipment already created for this order',
        data: { awbNumber: order.shippingDetails.awbNumber }
      });
    }

    // Check if order has shipping address
    if (!order.shippingAddress || !order.shippingAddress.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Order does not have a shipping address'
      });
    }

    console.log(`📦 Manually creating shipment for order: ${order.orderNumber}`);

    // Calculate total weight based on items (default 0.5kg per item)
    const totalWeight = order.items.reduce((acc, item) => acc + (item.quantity * 0.5), 0);

    // Add timestamp suffix to order number to avoid duplicates in iThink system
    const uniqueOrderId = `${order.orderNumber}-${Date.now()}`;
    console.log(`📦 Using unique order ID for iThink: ${uniqueOrderId}`);

    const shipmentData = {
      orderId: uniqueOrderId,
      orderDate: order.createdAt,
      shippingAddress: order.shippingAddress,
      billingAddress: order.shippingAddress,
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

      if (!awbNumber) {
        console.error('⚠️ No AWB number found in response:', shipmentResult);
        return res.status(400).json({
          success: false,
          message: 'No AWB number received from logistics provider',
          data: shipmentResult
        });
      }

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

      res.json({
        success: true,
        data: order,
        message: `Shipment created successfully with AWB: ${awbNumber}`
      });
    } else {
      console.error('❌ Shipment creation failed:', shipmentResult);

      // Extract error message from response
      let errorMessage = 'Failed to create shipment';
      if (shipmentResult?.data) {
        const firstKey = Object.keys(shipmentResult.data)[0];
        if (firstKey && shipmentResult.data[firstKey]?.remark) {
          errorMessage = shipmentResult.data[firstKey].remark;
        }
      }

      res.status(400).json({
        success: false,
        message: errorMessage,
        data: shipmentResult
      });
    }
  } catch (error) {
    console.error('❌ Create shipment error:', error);
    console.error('❌ Full error:', error.response?.data || error);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to create shipment',
      error: error.response?.data || error.message
    });
  }
});

// @route   GET /api/orders/:id/label
// @desc    Get shipping label (Admin)
// @access  Private/Admin
router.get('/:id/label', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!order.shippingDetails?.awbNumber) {
      return res.status(400).json({
        success: false,
        message: 'No AWB number found for this order'
      });
    }

    console.log(`🖨️ Generating label for AWB: ${order.shippingDetails.awbNumber}`);

    const labelResult = await ithinkLogistics.getShippingLabel(order.shippingDetails.awbNumber, 'A4');

    console.log('📦 Label API response:', JSON.stringify(labelResult, null, 2));

    // Check if request was successful
    // API can return status: 'success' OR just status_code: 200
    const isSuccess = labelResult && (
      labelResult.status === 'success' ||
      labelResult.status === true ||
      labelResult.status_code === 200
    );

    if (isSuccess) {
      // Extract label URL from response
      // API can return in different formats:
      // 1. data.label_url
      // 2. file_name (direct URL)
      // 3. data[key].label_url
      let labelUrl = labelResult.data?.label_url || labelResult.file_name;

      // Check if it's in a nested format
      if (!labelUrl && labelResult.data) {
        const firstKey = Object.keys(labelResult.data)[0];
        if (firstKey && labelResult.data[firstKey]?.label_url) {
          labelUrl = labelResult.data[firstKey].label_url;
        }
      }

      if (labelUrl) {
        // Store label URL in order
        order.shippingDetails.labelUrl = labelUrl;
        await order.save();
        console.log('✅ Label generated successfully:', labelUrl);

        res.json({
          success: true,
          data: { label_url: labelUrl },
          message: 'Label generated successfully'
        });
      } else {
        console.error('⚠️ No label URL in response:', labelResult);
        res.status(400).json({
          success: false,
          message: 'No label URL in response',
          data: labelResult
        });
      }
    } else {
      console.error('❌ Label generation returned error status:', labelResult);
      res.status(400).json({
        success: false,
        message: labelResult?.message || 'Failed to generate label',
        data: labelResult
      });
    }
  } catch (error) {
    console.error('❌ Generate label error:', error);
    console.error('❌ Full label error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
