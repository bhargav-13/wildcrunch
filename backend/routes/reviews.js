import express from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/reviews/:productId
// @desc    Get all reviews for a product
// @access  Public
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { sort = '-createdAt', page = 1, limit = 10 } = req.query;

    // Build sort options
    let sortOptions = {};
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'highest') {
      sortOptions = { rating: -1, createdAt: -1 };
    } else if (sort === 'lowest') {
      sortOptions = { rating: 1, createdAt: -1 };
    } else if (sort === 'helpful') {
      sortOptions = { helpfulCount: -1, createdAt: -1 };
    } else {
      // Default: newest first
      sortOptions = { createdAt: -1 };
    }

    // Execute query with pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const reviews = await Review.find({ product: productId })
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name');

    const total = await Review.countDocuments({ product: productId });

    // Get average rating
    const ratingStats = await Review.getAverageRating(productId);

    res.json({
      success: true,
      data: reviews,
      stats: ratingStats,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/reviews/:productId
// @desc    Create a review for a product
// @access  Public (allows guest reviews with name)
router.post('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, rating, comment } = req.body;

    // Validate required fields
    if (!name || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, rating, and comment'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Create review data
    const reviewData = {
      product: productId,
      name: name.trim(),
      rating: parseInt(rating),
      comment: comment.trim()
    };

    // If user is authenticated, add user reference
    if (req.user) {
      reviewData.user = req.user._id;
      // Could add logic here to check if it's a verified purchase
      reviewData.isVerifiedPurchase = false;
    }

    // Create review
    const review = await Review.create(reviewData);

    // Update product ratings
    const ratingStats = await Review.getAverageRating(productId);
    await Product.findByIdAndUpdate(productId, {
      'ratings.average': ratingStats.average,
      'ratings.count': ratingStats.count
    });

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/reviews/:reviewId
// @desc    Update a review
// @access  Private (only review owner can update)
router.put('/:reviewId', protect, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user && review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own reviews'
      });
    }

    // Update review
    if (rating) review.rating = parseInt(rating);
    if (comment) review.comment = comment.trim();

    await review.save();

    // Update product ratings
    const ratingStats = await Review.getAverageRating(review.product);
    await Product.findByIdAndUpdate(review.product, {
      'ratings.average': ratingStats.average,
      'ratings.count': ratingStats.count
    });

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/reviews/:reviewId
// @desc    Delete a review
// @access  Private (only review owner can delete)
router.delete('/:reviewId', protect, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user && review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reviews'
      });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(reviewId);

    // Update product ratings
    const ratingStats = await Review.getAverageRating(productId);
    await Product.findByIdAndUpdate(productId, {
      'ratings.average': ratingStats.average,
      'ratings.count': ratingStats.count
    });

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/reviews/:reviewId/helpful
// @desc    Mark review as helpful or unhelpful
// @access  Public
router.post('/:reviewId/helpful', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { helpful } = req.body; // true for helpful, false for unhelpful

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (helpful === true) {
      review.helpfulCount += 1;
    } else if (helpful === false) {
      review.unhelpfulCount += 1;
    }

    await review.save();

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
