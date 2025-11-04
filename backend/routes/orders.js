import express from 'express';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';

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

// @route   POST /api/orders/create-from-cart
// @desc    Create unpaid order from cart (Step 1: After cart, before address)
// @access  Private
router.post('/create-from-cart', protect, async (req, res) => {
  console.log('🛒 CREATE ORDER FROM CART - Route hit!');
  console.log('User:', req.user?._id);
  
  try {
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

    const shippingPrice = 60;  // Fixed shipping
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
router.put('/:id/address', protect, async (req, res) => {
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

    // Verify user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    // Update shipping address
    order.shippingAddress = shippingAddress;
    await order.save();

    res.json({
      success: true,
      data: order,
      message: 'Shipping address added successfully'
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
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user owns this order or is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

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

export default router;
