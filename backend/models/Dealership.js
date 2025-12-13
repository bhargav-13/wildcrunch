import mongoose from 'mongoose';

const dealershipSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  city: {
    type: String,
    trim: true
  },
  zip: {
    type: String,
    trim: true
  },
  district: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  businessAddress: {
    type: String,
    trim: true
  },
  currentNatureBusiness: {
    type: String,
    trim: true
  },
  experienceCurrentBusiness: {
    type: String,
    trim: true
  },
  businessType: {
    type: String,
    trim: true
  },
  capacityInvestment: {
    type: String,
    trim: true
  },
  currentBusinessBrief: {
    type: String,
    trim: true
  },
  whyInterested: {
    type: String,
    trim: true
  },
  excitingManpower: {
    type: String,
    trim: true
  },
  referenceName: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'approved', 'rejected'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Dealership = mongoose.model('Dealership', dealershipSchema);

export default Dealership;
