import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
    trim: true
  },
  ingredients: {
    type: String,
    trim: true,
    default: ''
  },
  // Pricing variants for different pack sizes
  pricing: {
    individual: {
      price: {
        type: Number,
        required: [true, 'Please provide individual price'],
        min: 0
      },
      originalPrice: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    packOf2: {
      price: {
        type: Number,
        required: [true, 'Please provide pack of 2 price'],
        min: 0
      },
      originalPrice: {
        type: Number,
        default: 0,
        min: 0
      },
      discount: {
        type: Number,
        default: 5,
        min: 0,
        max: 100
      }
    },
    packOf4: {
      price: {
        type: Number,
        required: [true, 'Please provide pack of 4 price'],
        min: 0
      },
      originalPrice: {
        type: Number,
        default: 0,
        min: 0
      },
      discount: {
        type: Number,
        default: 10,
        min: 0,
        max: 100
      }
    }
  },
  // Legacy fields for backward compatibility
  price: {
    type: Number,
    min: 0
  },
  originalPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Please provide category'],
    trim: true
  },
  // Array of image URLs - supports unlimited images
  images: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one product image is required'
    }
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: 0,
    default: 0
  },
  weight: {
    type: Number,
    default: 0
  },
  nutritionInfo: {
    calories: {
      type: Number,
      default: 0
    },
    protein: {
      type: Number,
      default: 0
    },
    carbs: {
      type: Number,
      default: 0
    },
    fat: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ price: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
