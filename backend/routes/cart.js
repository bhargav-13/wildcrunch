import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity = 1, pack = '1', packPrice } = req.body;

    // Find product
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Calculate pack price if not provided
    let finalPackPrice = packPrice;
    if (!finalPackPrice) {
      // Use pricing variants if available, otherwise use legacy price
      if (product.pricing) {
        if (pack === '1') {
          finalPackPrice = product.pricing.individual.price;
        } else if (pack === '2') {
          finalPackPrice = product.pricing.packOf2.price;
        } else if (pack === '4') {
          finalPackPrice = product.pricing.packOf4.price;
        }
      } else {
        // Fallback to legacy price calculation
        const basePrice = product.price;
        if (pack === '1') {
          finalPackPrice = basePrice;
        } else if (pack === '2') {
          finalPackPrice = Math.round(basePrice * 2 * 0.95); // 5% discount
        } else if (pack === '4') {
          finalPackPrice = Math.round(basePrice * 4 * 0.90); // 10% discount
        }
      }
    }

    // Check stock
    if (!product.isActive || product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Product out of stock'
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if same product with same pack already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId === productId && item.pack === pack
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item with correct product fields
      const basePrice = product.pricing?.individual?.price || product.price;
      cart.items.push({
        product: product._id,
        productId: productId,
        name: product.name,
        price: `₹${basePrice}`,
        priceNumeric: basePrice,
        imageSrc: product.images?.[0] || '',
        weight: product.weight ? `${product.weight}g` : '',
        quantity,
        pack,
        packPrice: finalPackPrice
      });
    }

    await cart.save();
    await cart.populate('items.product');

    res.json({
      success: true,
      data: cart,
      message: 'Item added to cart'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/cart/update/:productId
// @desc    Update cart item quantity (with optional pack parameter)
// @access  Private
router.put('/update/:productId', protect, async (req, res) => {
  try {
    const { quantity, pack } = req.body;
    const { productId } = req.params;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Find item by productId and pack (if pack is provided)
    const item = pack 
      ? cart.items.find(item => item.productId === productId && item.pack === pack)
      : cart.items.find(item => item.productId === productId);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    res.json({
      success: true,
      data: cart,
      message: 'Cart updated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/cart/remove/:productId
// @desc    Remove item from cart (with optional pack query parameter)
// @access  Private
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const { pack } = req.query;

    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Remove specific pack variant if pack is provided, otherwise remove all variants
    if (pack) {
      cart.items = cart.items.filter(item => !(item.productId === productId && item.pack === pack));
    } else {
      cart.items = cart.items.filter(item => item.productId !== productId);
    }
    
    await cart.save();
    await cart.populate('items.product');

    res.json({
      success: true,
      data: cart,
      message: 'Item removed from cart'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      data: cart,
      message: 'Cart cleared'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
