import express from 'express';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/products/categories/list
// @desc    Get all unique product categories
// @access  Public
// IMPORTANT: This route must be BEFORE /:id route
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category');

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 100 } = req.query;

    // Build query
    const query = {};

    // Filter by category (check if category array contains the specified category)
    if (category && category !== 'All') {
      query.category = { $in: [category] };
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    let sortOptions = {};
    if (sort === 'price-asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'name') {
      sortOptions = { name: 1 };
    } else {
      sortOptions = { createdAt: -1 };
    }

    // Execute query with pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products: products, // Return as 'products' for admin panel
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by MongoDB _id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/products
// @desc    Create a new product (Admin only)
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const productData = {
      name: req.body.name,
      description: req.body.description,
      ingredients: req.body.ingredients || '',
      // New pricing structure with variants
      pricing: {
        individual: {
          price: parseFloat(req.body.pricing?.individual?.price || req.body.price || 0),
          originalPrice: parseFloat(req.body.pricing?.individual?.originalPrice || req.body.originalPrice || 0)
        },
        packOf2: {
          price: parseFloat(req.body.pricing?.packOf2?.price || 0),
          originalPrice: parseFloat(req.body.pricing?.packOf2?.originalPrice || 0),
          discount: parseFloat(req.body.pricing?.packOf2?.discount || 5)
        },
        packOf4: {
          price: parseFloat(req.body.pricing?.packOf4?.price || 0),
          originalPrice: parseFloat(req.body.pricing?.packOf4?.originalPrice || 0),
          discount: parseFloat(req.body.pricing?.packOf4?.discount || 10)
        }
      },
      // Legacy fields for backward compatibility
      price: parseFloat(req.body.pricing?.individual?.price || req.body.price || 0),
      originalPrice: parseFloat(req.body.pricing?.individual?.originalPrice || req.body.originalPrice || 0),
      category: req.body.category,
      images: req.body.images || [],
      stock: parseInt(req.body.stock) || 0,
      weight: req.body.weight ? parseFloat(req.body.weight) : 0,
      nutritionInfo: {
        calories: req.body.nutritionInfo?.calories ? parseFloat(req.body.nutritionInfo.calories) : 0,
        protein: req.body.nutritionInfo?.protein ? parseFloat(req.body.nutritionInfo.protein) : 0,
        carbs: req.body.nutritionInfo?.carbs ? parseFloat(req.body.nutritionInfo.carbs) : 0,
        fat: req.body.nutritionInfo?.fat ? parseFloat(req.body.nutritionInfo.fat) : 0
      },
      backgroundColor: req.body.backgroundColor || '#FFFFFF',
      isActive: req.body.isActive !== false
    };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      ingredients: req.body.ingredients || '',
      // New pricing structure with variants
      pricing: {
        individual: {
          price: parseFloat(req.body.pricing?.individual?.price || req.body.price || 0),
          originalPrice: parseFloat(req.body.pricing?.individual?.originalPrice || req.body.originalPrice || 0)
        },
        packOf2: {
          price: parseFloat(req.body.pricing?.packOf2?.price || 0),
          originalPrice: parseFloat(req.body.pricing?.packOf2?.originalPrice || 0),
          discount: parseFloat(req.body.pricing?.packOf2?.discount || 5)
        },
        packOf4: {
          price: parseFloat(req.body.pricing?.packOf4?.price || 0),
          originalPrice: parseFloat(req.body.pricing?.packOf4?.originalPrice || 0),
          discount: parseFloat(req.body.pricing?.packOf4?.discount || 10)
        }
      },
      // Legacy fields for backward compatibility
      price: parseFloat(req.body.pricing?.individual?.price || req.body.price || 0),
      originalPrice: parseFloat(req.body.pricing?.individual?.originalPrice || req.body.originalPrice || 0),
      category: req.body.category,
      images: req.body.images || [],
      stock: parseInt(req.body.stock) || 0,
      weight: req.body.weight ? parseFloat(req.body.weight) : 0,
      nutritionInfo: {
        calories: req.body.nutritionInfo?.calories ? parseFloat(req.body.nutritionInfo.calories) : 0,
        protein: req.body.nutritionInfo?.protein ? parseFloat(req.body.nutritionInfo.protein) : 0,
        carbs: req.body.nutritionInfo?.carbs ? parseFloat(req.body.nutritionInfo.carbs) : 0,
        fat: req.body.nutritionInfo?.fat ? parseFloat(req.body.nutritionInfo.fat) : 0
      },
      backgroundColor: req.body.backgroundColor || '#FFFFFF',
      isActive: req.body.isActive !== false
    };

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
