import express from 'express';
import Dealership from '../models/Dealership.js';

const router = express.Router();

// @route   POST /api/dealership/submit
// @desc    Submit dealership form
// @access  Public
router.post('/submit', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      age,
      phone,
      email,
      city,
      zip,
      district,
      state,
      company,
      businessAddress,
      currentNatureBusiness,
      experienceCurrentBusiness,
      businessType,
      capacityInvestment,
      currentBusinessBrief,
      whyInterested,
      excitingManpower,
      referenceName
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !age || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: First Name, Last Name, Age, Phone, and Email'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Save to database
    const dealership = await Dealership.create({
      firstName,
      lastName,
      age,
      phone,
      email,
      city,
      zip,
      district,
      state,
      company,
      businessAddress,
      currentNatureBusiness,
      experienceCurrentBusiness,
      businessType,
      capacityInvestment,
      currentBusinessBrief,
      whyInterested,
      excitingManpower,
      referenceName,
      status: 'pending'
    });

    console.log('Dealership application saved:', dealership._id);

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully! Our team will contact you soon.'
    });

  } catch (error) {
    console.error('Dealership form submission error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to submit application. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/dealership
// @desc    Get all dealership applications (Admin only)
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const dealerships = await Dealership.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: dealerships.length,
      data: dealerships
    });
  } catch (error) {
    console.error('Error fetching dealerships:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dealership applications'
    });
  }
});

// @route   PATCH /api/dealership/:id
// @desc    Update dealership status/notes (Admin only)
// @access  Private/Admin
router.patch('/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;

    const dealership = await Dealership.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true, runValidators: true }
    );

    if (!dealership) {
      return res.status(404).json({
        success: false,
        message: 'Dealership application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: dealership
    });
  } catch (error) {
    console.error('Error updating dealership:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update dealership application'
    });
  }
});

export default router;
