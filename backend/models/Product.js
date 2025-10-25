import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },
  weight: {
    type: String,
    trim: true
  },
  price: {
    type: String,
    required: [true, 'Please provide product price']
  },
  priceNumeric: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please provide category'],
    enum: ['Makhana', 'Protein Puffs', 'Popcorn', 'Combo']
  },
  imageSrc: {
    type: String,
    required: true
  },
  bgColor: {
    type: String,
    default: '#F1B213'
  },
  description: {
    type: String,
    default: ''
  },
  ingredients: {
    type: String,
    default: ''
  },
  nutritionalInfo: {
    calories: String,
    protein: String,
    carbs: String,
    fat: String,
    fiber: String
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 100
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
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
productSchema.index({ category: 1, inStock: 1 });
productSchema.index({ name: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
