import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please provide coupon code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide coupon description'],
    trim: true
  },
  discountType: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: [true, 'Please provide discount value'],
    min: 0
  },
  minimumPurchase: {
    type: Number,
    default: 0,
    min: 0
  },
  maximumDiscount: {
    type: Number,
    default: null,
    min: 0
  },
  usageLimit: {
    type: Number,
    default: null, // null means unlimited
    min: 1
  },
  usageCount: {
    type: Number,
    default: 0,
    min: 0
  },
  perUserLimit: {
    type: Number,
    default: 1,
    min: 1
  },
  validFrom: {
    type: Date,
    required: true,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableCategories: {
    type: [String],
    default: [] // Empty array means applicable to all categories
  },
  excludedProducts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
    default: []
  },
  usedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    usedCount: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true
});

// Index for faster lookups
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });

// Method to check if coupon is valid
couponSchema.methods.isValidCoupon = function() {
  const now = new Date();

  // Check if active
  if (!this.isActive) {
    return { valid: false, message: 'This coupon is no longer active' };
  }

  // Check date validity
  if (now < this.validFrom) {
    return { valid: false, message: 'This coupon is not yet valid' };
  }

  if (now > this.validUntil) {
    return { valid: false, message: 'This coupon has expired' };
  }

  // Check usage limit
  if (this.usageLimit && this.usageCount >= this.usageLimit) {
    return { valid: false, message: 'This coupon has reached its usage limit' };
  }

  return { valid: true };
};

// Method to check if user can use this coupon
couponSchema.methods.canUserUseCoupon = function(userId) {
  const userUsage = this.usedBy.find(u => u.user.toString() === userId.toString());

  if (userUsage && userUsage.usedCount >= this.perUserLimit) {
    return { valid: false, message: 'You have already used this coupon the maximum number of times' };
  }

  return { valid: true };
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function(orderTotal) {
  let discount = 0;

  if (this.discountType === 'percentage') {
    discount = (orderTotal * this.discountValue) / 100;

    // Apply maximum discount cap if set
    if (this.maximumDiscount && discount > this.maximumDiscount) {
      discount = this.maximumDiscount;
    }
  } else {
    // Fixed discount
    discount = this.discountValue;
  }

  // Discount cannot exceed order total
  return Math.min(discount, orderTotal);
};

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
