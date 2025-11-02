import express from 'express';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '../utils/cloudinaryUpload.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 20 } = req.query;

    // Build query
    const query = {};

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search by name
    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    let sortOptions = {};
    if (sort === 'price-asc') {
      sortOptions = { priceNumeric: 1 };
    } else if (sort === 'price-desc') {
      sortOptions = { priceNumeric: -1 };
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
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by custom id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });

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
// @desc    Create a product (Admin only)
// @access  Public (for admin panel)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    let productData = { ...req.body };

    // Parse nutritionalInfo if it's a string (from FormData)
    if (typeof productData.nutritionalInfo === 'string') {
      productData.nutritionalInfo = JSON.parse(productData.nutritionalInfo);
    }

    // Convert boolean strings to actual booleans
    if (typeof productData.inStock === 'string') {
      productData.inStock = productData.inStock === 'true';
    }

    // If image file is uploaded, upload to Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      productData.imageSrc = result.secure_url;
    }

    const product = await Product.create(productData);

    res.status(201).json({
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

// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
// @access  Public (for admin panel)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const existingProduct = await Product.findOne({ id: req.params.id });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let productData = { ...req.body };

    // Parse nutritionalInfo if it's a string (from FormData)
    if (typeof productData.nutritionalInfo === 'string') {
      productData.nutritionalInfo = JSON.parse(productData.nutritionalInfo);
    }

    // Convert boolean strings to actual booleans
    if (typeof productData.inStock === 'string') {
      productData.inStock = productData.inStock === 'true';
    }

    // If new image file is uploaded
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (existingProduct.imageSrc) {
        const publicId = getPublicIdFromUrl(existingProduct.imageSrc);
        if (publicId) {
          try {
            await deleteFromCloudinary(publicId);
          } catch (deleteError) {
            console.error('Error deleting old image:', deleteError.message);
          }
        }
      }

      // Upload new image
      const result = await uploadToCloudinary(req.file.buffer);
      productData.imageSrc = result.secure_url;
    }

    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      productData,
      { new: true, runValidators: true }
    );

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

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
// @access  Public (for admin panel)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete image from Cloudinary if it exists
    if (product.imageSrc) {
      const publicId = getPublicIdFromUrl(product.imageSrc);
      if (publicId) {
        try {
          await deleteFromCloudinary(publicId);
        } catch (deleteError) {
          console.error('Error deleting image:', deleteError.message);
        }
      }
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

// @route   GET /api/products/categories/list
// @desc    Get all product categories
// @access  Public
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

export default router;
