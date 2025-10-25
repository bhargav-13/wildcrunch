import express from 'express';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items.product');

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    }

    res.json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/wishlist/add
// @desc    Add item to wishlist
// @access  Private
router.post('/add', protect, async (req, res) => {
  try {
    const { productId } = req.body;

    // Find product
    const product = await Product.findOne({ id: productId });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, items: [] });
    }

    // Check if product already in wishlist
    const exists = wishlist.items.some(item => item.productId === productId);

    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    // Add new item
    wishlist.items.push({
      product: product._id,
      productId: product.id
    });

    await wishlist.save();
    await wishlist.populate('items.product');

    res.json({
      success: true,
      data: wishlist,
      message: 'Item added to wishlist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/wishlist/remove/:productId
// @desc    Remove item from wishlist
// @access  Private
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.items = wishlist.items.filter(item => item.productId !== productId);
    await wishlist.save();
    await wishlist.populate('items.product');

    res.json({
      success: true,
      data: wishlist,
      message: 'Item removed from wishlist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/wishlist/clear
// @desc    Clear entire wishlist
// @access  Private
router.delete('/clear', protect, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.items = [];
    await wishlist.save();

    res.json({
      success: true,
      data: wishlist,
      message: 'Wishlist cleared'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/wishlist/toggle/:productId
// @desc    Toggle item in wishlist (add if not exists, remove if exists)
// @access  Private
router.post('/toggle/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    // Find product
    const product = await Product.findOne({ id: productId });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, items: [] });
    }

    // Check if product already in wishlist
    const existingIndex = wishlist.items.findIndex(item => item.productId === productId);

    if (existingIndex > -1) {
      // Remove from wishlist
      wishlist.items.splice(existingIndex, 1);
      await wishlist.save();
      await wishlist.populate('items.product');

      return res.json({
        success: true,
        data: wishlist,
        message: 'Item removed from wishlist',
        action: 'removed'
      });
    } else {
      // Add to wishlist
      wishlist.items.push({
        product: product._id,
        productId: product.id
      });
      await wishlist.save();
      await wishlist.populate('items.product');

      return res.json({
        success: true,
        data: wishlist,
        message: 'Item added to wishlist',
        action: 'added'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
