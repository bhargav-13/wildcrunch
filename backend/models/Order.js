import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productId: String,
  name: String,
  price: String,
  priceNumeric: Number,
  imageSrc: String,
  weight: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  pack: {
    type: String,
    default: '1'
  },
  packPrice: Number
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    area: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['COD', 'Card', 'UPI', 'Net Banking', 'razorpay']
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  paymentDetails: {
    transactionId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paidAt: Date
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: Date,
  itemsPrice: {
    type: Number,
    required: true
  },
  shippingPrice: {
    type: Number,
    default: 0
  },
  taxPrice: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true
  },
  orderStatus: {
    type: String,
    enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNumber = `WC-${timestamp}-${random}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
