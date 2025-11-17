import express from 'express';
import ithinkLogistics from '../utils/ithinkLogistics.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/shipping/check-pincode
 * @desc    Check if pincode is serviceable
 * @access  Public
 */
router.post('/check-pincode', async (req, res) => {
  try {
    const { pincode } = req.body;

    if (!pincode) {
      return res.status(400).json({
        success: false,
        message: 'Pincode is required',
      });
    }

    const result = await ithinkLogistics.checkPincode(pincode);

    res.json({
      success: true,
      data: result,
      message: 'Pincode serviceability checked',
    });
  } catch (error) {
    console.error('Check Pincode Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check pincode serviceability',
    });
  }
});

/**
 * @route   POST /api/shipping/calculate-rate
 * @desc    Calculate shipping rate
 * @access  Public
 */
router.post('/calculate-rate', async (req, res) => {
  try {
    const {
      fromPincode,
      toPincode,
      weight,
      length,
      width,
      height,
      paymentMode,
      productMrp,
    } = req.body;

    if (!toPincode || !weight || !productMrp) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: toPincode, weight, productMrp',
      });
    }

    // Use pickup address pincode if fromPincode not provided
    const sourcePincode = fromPincode || '400067'; // Default warehouse pincode

    const rateParams = {
      fromPincode: sourcePincode,
      toPincode,
      weight: weight || 0.5, // Default 500g
      length: length || 15,
      width: width || 15,
      height: height || 10,
      paymentMode: paymentMode || 'prepaid',
      productMrp,
    };

    const result = await ithinkLogistics.getRate(rateParams);

    res.json({
      success: true,
      data: result,
      message: 'Shipping rate calculated',
    });
  } catch (error) {
    console.error('Calculate Rate Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to calculate shipping rate',
    });
  }
});

/**
 * @route   POST /api/shipping/create-shipment
 * @desc    Create shipment with iThink Logistics (Internal use only)
 * @access  Private
 */
router.post('/create-shipment', protect, async (req, res) => {
  try {
    const { orderData } = req.body;

    if (!orderData) {
      return res.status(400).json({
        success: false,
        message: 'Order data is required',
      });
    }

    const result = await ithinkLogistics.createShipment(orderData);

    res.json({
      success: true,
      data: result,
      message: 'Shipment created successfully',
    });
  } catch (error) {
    console.error('Create Shipment Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create shipment',
    });
  }
});

/**
 * @route   POST /api/shipping/track
 * @desc    Track shipment by AWB number
 * @access  Private
 */
router.post('/track', protect, async (req, res) => {
  try {
    const { awbNumber } = req.body;

    if (!awbNumber) {
      return res.status(400).json({
        success: false,
        message: 'AWB number is required',
      });
    }

    const result = await ithinkLogistics.trackShipment(awbNumber);

    res.json({
      success: true,
      data: result,
      message: 'Shipment tracking retrieved',
    });
  } catch (error) {
    console.error('Track Shipment Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to track shipment',
    });
  }
});

/**
 * @route   POST /api/shipping/cancel
 * @desc    Cancel shipment
 * @access  Private
 */
router.post('/cancel', protect, async (req, res) => {
  try {
    const { awbNumbers } = req.body;

    if (!awbNumbers) {
      return res.status(400).json({
        success: false,
        message: 'AWB number(s) required',
      });
    }

    const result = await ithinkLogistics.cancelShipment(awbNumbers);

    res.json({
      success: true,
      data: result,
      message: 'Shipment cancelled',
    });
  } catch (error) {
    console.error('Cancel Shipment Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel shipment',
    });
  }
});

/**
 * @route   POST /api/shipping/label
 * @desc    Get shipping label
 * @access  Private
 */
router.post('/label', protect, async (req, res) => {
  try {
    const { awbNumbers, pageSize } = req.body;

    if (!awbNumbers) {
      return res.status(400).json({
        success: false,
        message: 'AWB number(s) required',
      });
    }

    const result = await ithinkLogistics.getShippingLabel(awbNumbers, pageSize);

    res.json({
      success: true,
      data: result,
      message: 'Shipping label retrieved',
    });
  } catch (error) {
    console.error('Get Label Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get shipping label',
    });
  }
});

/**
 * @route   POST /api/shipping/manifest
 * @desc    Generate manifest
 * @access  Private
 */
router.post('/manifest', protect, async (req, res) => {
  try {
    const { awbNumbers } = req.body;

    if (!awbNumbers) {
      return res.status(400).json({
        success: false,
        message: 'AWB number(s) required',
      });
    }

    const result = await ithinkLogistics.generateManifest(awbNumbers);

    res.json({
      success: true,
      data: result,
      message: 'Manifest generated',
    });
  } catch (error) {
    console.error('Generate Manifest Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate manifest',
    });
  }
});

export default router;
