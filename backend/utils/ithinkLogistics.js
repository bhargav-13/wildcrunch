import axios from 'axios';

/**
 * iThink Logistics API Client
 * Documentation: https://docs.ithinklogistics.com/
 */
class IThinkLogisticsClient {
  constructor() {
    this.baseURL = process.env.ITHINK_API_URL;
    this.accessToken = process.env.ITHINK_ACCESS_TOKEN;
    this.secretKey = process.env.ITHINK_SECRET_KEY;
    this.pickupAddressId = process.env.ITHINK_PICKUP_ADDRESS_ID;

    // Log initialization
    console.log('🚚 iThink Logistics initialized:', {
      baseURL: this.baseURL,
      hasAccessToken: !!this.accessToken,
      hasSecretKey: !!this.secretKey,
      hasPickupAddressId: !!this.pickupAddressId,
    });

    if (!this.baseURL || !this.accessToken || !this.secretKey) {
      console.error('⚠️ Missing iThink Logistics credentials!');
    }
  }

  /**
   * Make API request to iThink Logistics
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request data
   * @returns {Promise<object>} - API response
   */
  async makeRequest(endpoint, data) {
    try {
      console.log(`📤 iThink API Request: ${endpoint}`);

      const payload = {
        data: {
          ...data,
          access_token: this.accessToken,
          secret_key: this.secretKey,
        },
      };

      const response = await axios.post(`${this.baseURL}${endpoint}`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`✅ iThink API Response: ${endpoint} - Status: ${response.data.status || 'unknown'}`);

      return response.data;
    } catch (error) {
      console.error(`❌ iThink API Error [${endpoint}]:`, error.response?.data || error.message);
      console.error('Request URL:', `${this.baseURL}${endpoint}`);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to communicate with shipping provider'
      );
    }
  }

  /**
   * Check if pincode is serviceable
   * @param {string} pincode - Pincode to check
   * @returns {Promise<object>} - Serviceability details
   */
  async checkPincode(pincode) {
    return this.makeRequest('/pincode/check.json', {
      pincode,
    });
  }

  /**
   * Get shipping rate
   * @param {object} params - Rate parameters
   * @returns {Promise<object>} - Rate details
   */
  async getRate(params) {
    const {
      fromPincode,
      toPincode,
      weight,
      length = 10,
      width = 10,
      height = 10,
      paymentMode = 'prepaid',
      productMrp,
    } = params;

    return this.makeRequest('/rate/check.json', {
      from_pincode: fromPincode,
      to_pincode: toPincode,
      shipping_length_cms: length.toString(),
      shipping_width_cms: width.toString(),
      shipping_height_cms: height.toString(),
      shipping_weight_kg: weight.toString(),
      order_type: 'forward',
      payment_method: paymentMode.toLowerCase(),
      product_mrp: productMrp.toString(),
    });
  }

  /**
   * Create shipment order
   * @param {object} orderData - Order details
   * @returns {Promise<object>} - Shipment creation response
   */
  async createShipment(orderData) {
    const {
      orderId,
      orderDate,
      shippingAddress,
      billingAddress,
      items,
      pricing,
      dimensions,
      paymentMode,
      logistics = 'Delhivery', // Default logistics partner
    } = orderData;

    // Format products for iThink API
    const products = items.map((item) => ({
      product_name: item.name,
      product_sku: item.productId || item.sku || 'SKU-001',
      product_quantity: item.quantity.toString(),
      product_price: item.price.toString(),
      product_tax_rate: '0',
      product_hsn_code: item.hsnCode || '00000',
      product_discount: item.discount?.toString() || '0',
    }));

    // Determine if billing is same as shipping
    const isBillingSameAsShipping = this.compareBillingAddress(
      shippingAddress,
      billingAddress
    );

    const shipmentData = {
      shipments: [
        {
          waybill: '',
          order: orderId,
          sub_order: 'A',
          order_date: this.formatDate(orderDate),
          total_amount: pricing.totalAmount.toString(),
          name: shippingAddress.fullName,
          company_name: '',
          add: shippingAddress.address,
          add2: shippingAddress.area || '',
          add3: '',
          pin: shippingAddress.pincode,
          city: shippingAddress.city,
          state: shippingAddress.state,
          country: shippingAddress.country || 'India',
          phone: shippingAddress.phone,
          alt_phone: shippingAddress.phone,
          email: shippingAddress.email,
          is_billing_same_as_shipping: isBillingSameAsShipping ? 'yes' : 'no',
          billing_name: billingAddress?.fullName || shippingAddress.fullName,
          billing_company_name: '',
          billing_add: billingAddress?.address || shippingAddress.address,
          billing_add2: billingAddress?.area || shippingAddress.area || '',
          billing_add3: '',
          billing_pin: billingAddress?.pincode || shippingAddress.pincode,
          billing_city: billingAddress?.city || shippingAddress.city,
          billing_state: billingAddress?.state || shippingAddress.state,
          billing_country: billingAddress?.country || shippingAddress.country || 'India',
          billing_phone: billingAddress?.phone || shippingAddress.phone,
          billing_alt_phone: billingAddress?.phone || shippingAddress.phone,
          billing_email: billingAddress?.email || shippingAddress.email,
          products,
          shipment_length: dimensions?.length?.toString() || '15',
          shipment_width: dimensions?.width?.toString() || '15',
          shipment_height: dimensions?.height?.toString() || '10',
          weight: dimensions?.weight?.toString() || '500',
          shipping_charges: pricing.shippingPrice?.toString() || '0',
          giftwrap_charges: '0',
          transaction_charges: pricing.transactionFee?.toString() || '0',
          total_discount: pricing.discount?.toString() || '0',
          first_attemp_discount: '0',
          cod_charges: '0',
          advance_amount: paymentMode === 'prepaid' ? pricing.totalAmount.toString() : '0',
          cod_amount: paymentMode === 'COD' ? pricing.totalAmount.toString() : '0',
          payment_mode: paymentMode.toUpperCase(),
          reseller_name: '',
          eway_bill_number: '',
          gst_number: '',
          return_address_id: this.pickupAddressId,
        },
      ],
      pickup_address_id: this.pickupAddressId,
      logistics,
      s_type: '',
      order_type: '',
    };

    return this.makeRequest('/order/add.json', shipmentData);
  }

  /**
   * Track shipment by AWB number
   * @param {string} awbNumber - AWB tracking number
   * @returns {Promise<object>} - Tracking details
   */
  async trackShipment(awbNumber) {
    return this.makeRequest('/order/track.json', {
      awb_number_list: awbNumber,
    });
  }

  /**
   * Cancel shipment
   * @param {string} awbNumbers - Comma-separated AWB numbers
   * @returns {Promise<object>} - Cancellation response
   */
  async cancelShipment(awbNumbers) {
    return this.makeRequest('/order/cancel.json', {
      awb_numbers: awbNumbers,
    });
  }

  /**
   * Get shipping label
   * @param {string} awbNumbers - Comma-separated AWB numbers
   * @param {string} pageSize - Page size (A4, A6, etc.)
   * @returns {Promise<object>} - Label URL
   */
  async getShippingLabel(awbNumbers, pageSize = 'A4') {
    return this.makeRequest('/shipping/label.json', {
      awb_numbers: awbNumbers,
      page_size: pageSize,
      display_cod_prepaid: '',
      display_shipper_mobile: '',
      display_shipper_address: '',
    });
  }

  /**
   * Generate manifest
   * @param {string} awbNumbers - Comma-separated AWB numbers
   * @returns {Promise<object>} - Manifest response
   */
  async generateManifest(awbNumbers) {
    return this.makeRequest('/shipping/manifest.json', {
      awb_numbers: awbNumbers,
    });
  }

  /**
   * Format date to DD-MM-YYYY
   * @param {Date|string} date - Date to format
   * @returns {string} - Formatted date
   */
  formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  /**
   * Compare billing and shipping addresses
   * @param {object} shipping - Shipping address
   * @param {object} billing - Billing address
   * @returns {boolean} - True if same
   */
  compareBillingAddress(shipping, billing) {
    if (!billing) return true;

    return (
      shipping.address === billing.address &&
      shipping.city === billing.city &&
      shipping.pincode === billing.pincode &&
      shipping.state === billing.state
    );
  }

  /**
   * Calculate volumetric weight
   * @param {number} length - Length in cm
   * @param {number} width - Width in cm
   * @param {number} height - Height in cm
   * @returns {number} - Volumetric weight in kg
   */
  calculateVolumetricWeight(length, width, height) {
    return (length * width * height) / 5000;
  }
}

// Export singleton instance
const ithinkLogistics = new IThinkLogisticsClient();
export default ithinkLogistics;
