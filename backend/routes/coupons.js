import express from 'express';
import Coupon from '../models/Coupon.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/coupons/validate
// @desc    Validate a coupon code
// @access  Private
router.post('/validate', protect, async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a coupon code'
      });
    }

    // Find coupon
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    // Check if coupon is valid
    const validityCheck = coupon.isValidCoupon();
    if (!validityCheck.valid) {
      return res.status(400).json({
        success: false,
        message: validityCheck.message
      });
    }

    // Check if user can use this coupon
    const userCheck = coupon.canUserUseCoupon(req.user._id);
    if (!userCheck.valid) {
      return res.status(400).json({
        success: false,
        message: userCheck.message
      });
    }

    // Check minimum purchase requirement
    if (cartTotal < coupon.minimumPurchase) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase of ₹${coupon.minimumPurchase} required to use this coupon`
      });
    }

    // Calculate discount
    const discount = coupon.calculateDiscount(cartTotal);

    res.json({
      success: true,
      data: {
        couponId: coupon._id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount: discount,
        finalAmount: cartTotal - discount
      },
      message: 'Coupon applied successfully'
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/coupons/apply
// @desc    Mark coupon as used
// @access  Private
router.post('/apply', protect, async (req, res) => {
  try {
    const { couponId } = req.body;

    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Increment usage count
    coupon.usageCount += 1;

    // Update user usage
    const userUsageIndex = coupon.usedBy.findIndex(
      u => u.user.toString() === req.user._id.toString()
    );

    if (userUsageIndex >= 0) {
      coupon.usedBy[userUsageIndex].usedCount += 1;
    } else {
      coupon.usedBy.push({
        user: req.user._id,
        usedCount: 1
      });
    }

    await coupon.save();

    res.json({
      success: true,
      message: 'Coupon applied successfully'
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/coupons
// @desc    Get all coupons (Admin only)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const coupons = await Coupon.find({})
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: coupons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/coupons/active
// @desc    Get all active coupons for users
// @access  Public
router.get('/active', async (req, res) => {
  try {
    const now = new Date();

    const coupons = await Coupon.find({
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now }
    })
      .select('code description discountType discountValue minimumPurchase maximumDiscount validUntil')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: coupons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/coupons/:id
// @desc    Get single coupon (Admin only)
// @access  Private/Admin
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.json({
      success: true,
      data: coupon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/coupons
// @desc    Create a new coupon (Admin only)
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const couponData = {
      code: req.body.code,
      description: req.body.description,
      discountType: req.body.discountType,
      discountValue: parseFloat(req.body.discountValue),
      minimumPurchase: req.body.minimumPurchase ? parseFloat(req.body.minimumPurchase) : 0,
      maximumDiscount: req.body.maximumDiscount ? parseFloat(req.body.maximumDiscount) : null,
      usageLimit: req.body.usageLimit ? parseInt(req.body.usageLimit) : null,
      perUserLimit: req.body.perUserLimit ? parseInt(req.body.perUserLimit) : 1,
      validFrom: req.body.validFrom ? new Date(req.body.validFrom) : new Date(),
      validUntil: new Date(req.body.validUntil),
      isActive: req.body.isActive !== false,
      applicableCategories: req.body.applicableCategories || [],
      excludedProducts: req.body.excludedProducts || []
    };

    const coupon = await Coupon.create(couponData);

    res.status(201).json({
      success: true,
      data: coupon,
      message: 'Coupon created successfully'
    });
  } catch (error) {
    console.error('Create coupon error:', error);

    // Handle duplicate code error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A coupon with this code already exists'
      });
    }

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/coupons/:id
// @desc    Update a coupon (Admin only)
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const updateData = {
      code: req.body.code,
      description: req.body.description,
      discountType: req.body.discountType,
      discountValue: parseFloat(req.body.discountValue),
      minimumPurchase: req.body.minimumPurchase ? parseFloat(req.body.minimumPurchase) : 0,
      maximumDiscount: req.body.maximumDiscount ? parseFloat(req.body.maximumDiscount) : null,
      usageLimit: req.body.usageLimit ? parseInt(req.body.usageLimit) : null,
      perUserLimit: req.body.perUserLimit ? parseInt(req.body.perUserLimit) : 1,
      validFrom: req.body.validFrom ? new Date(req.body.validFrom) : new Date(),
      validUntil: new Date(req.body.validUntil),
      isActive: req.body.isActive !== false,
      applicableCategories: req.body.applicableCategories || [],
      excludedProducts: req.body.excludedProducts || []
    };

    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.json({
      success: true,
      data: coupon,
      message: 'Coupon updated successfully'
    });
  } catch (error) {
    console.error('Update coupon error:', error);

    // Handle duplicate code error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A coupon with this code already exists'
      });
    }

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/coupons/:id
// @desc    Delete a coupon (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
