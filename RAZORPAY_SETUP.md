# Razorpay Payment Integration - Complete Setup

## ✅ Implementation Complete

### **Backend Setup**

#### 1. **Razorpay SDK Installed**
```bash
npm install razorpay
```

#### 2. **Environment Variables Added**
File: `backend/.env`
```
RAZORPAY_KEY_ID=rzp_test_RXdR3zic3uXGS2
RAZORPAY_KEY_SECRET=wmZcTKWykMLfyJCPYi7lCtXT
```

#### 3. **Payment Routes Created**
File: `backend/routes/payment.js`

**Endpoints:**
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment signature
- `GET /api/payment/key` - Get Razorpay key ID

**Features:**
- Signature verification using HMAC SHA256
- Automatic order creation in database after successful payment
- Error handling and validation

#### 4. **Server Updated**
- Payment routes registered in `server.js`
- Endpoint available at `/api/payment`

---

### **Frontend Setup**

#### 1. **Razorpay SDK Added**
- Razorpay Checkout script added to `index.html`
- NPM package installed for TypeScript support

#### 2. **Payment API Service**
File: `src/services/api.ts`

```typescript
export const paymentAPI = {
  getKey: () => api.get('/payment/key'),
  createOrder: (data) => api.post('/payment/create-order', data),
  verifyPayment: (data) => api.post('/payment/verify', data),
};
```

#### 3. **usePayment Hook**
File: `src/hooks/usePayment.ts`

**Features:**
- Initializes Razorpay checkout
- Handles payment success/failure
- Automatic signature verification
- Creates order in database after payment

**Usage:**
```typescript
const { initializePayment, loading, error } = usePayment();

await initializePayment(
  amount,
  orderData,
  onSuccess,
  onFailure
);
```

#### 4. **Payment Page Updated**
File: `src/components/Buy/Payment.tsx`

**Features:**
- Uses real cart data (no more mock data)
- Shows pack information (Individual, Pack of 2, Pack of 4)
- Fetches shipping address from localStorage
- Razorpay integration on "Pay Now" button
- Clears cart after successful payment
- Redirects to confirmation page with order ID

---

## **Payment Flow**

### **Step-by-Step Process:**

1. **User clicks "Pay Now"** on payment page

2. **Frontend validates:**
   - User is authenticated
   - Cart has items
   - Shipping address is selected

3. **Create Razorpay Order:**
   - Frontend calls `POST /api/payment/create-order`
   - Backend creates order with Razorpay
   - Returns order ID and amount

4. **Open Razorpay Checkout:**
   - Modal opens with payment options
   - User enters card/UPI/netbanking details
   - Razorpay processes payment

5. **Payment Success:**
   - Razorpay returns payment details
   - Frontend calls `POST /api/payment/verify`
   - Backend verifies signature
   - Order created in database
   - Cart cleared
   - User redirected to confirmation

6. **Payment Failure:**
   - Error message shown
   - Cart remains intact
   - User can retry

---

## **Testing the Integration**

### **Test Mode Credentials:**
- Key ID: `rzp_test_RXdR3zic3uXGS2`
- Secret: `wmZcTKWykMLfyJCPYi7lCtXT`

### **Test Cards:**
- **Success:** `4111 1111 1111 1111`
- **Failure:** `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date
- OTP: Any 6 digits (for 3DS)

### **Test Flow:**
1. Add products to cart (with different packs)
2. Navigate to `/cart`
3. Click "Next Step" → Goes to address page
4. Select/add shipping address
5. Click "Next Step" → Goes to payment page
6. Click "Pay Now"
7. Razorpay modal opens
8. Enter test card details
9. Complete payment
10. Redirected to confirmation page
11. Cart is cleared

---

## **Order Data Structure**

```typescript
{
  items: [
    {
      product: "productId",
      productId: "1",
      name: "Salt & Pepper Makhana",
      price: "₹200",
      priceNumeric: 200,
      quantity: 2,
      pack: "2",
      packPrice: 380
    }
  ],
  shippingAddress: {
    fullName: "John Doe",
    phone: "1234567890",
    address: "123 Main St",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  },
  itemsPrice: 760,
  shippingPrice: 60,
  totalPrice: 820,
  paymentMethod: "razorpay",
  paymentDetails: {
    razorpayOrderId: "order_xxx",
    razorpayPaymentId: "pay_xxx",
    razorpaySignature: "signature_xxx"
  }
}
```

---

## **Security Features**

1. **Signature Verification:**
   - HMAC SHA256 signature validation
   - Prevents payment tampering

2. **Server-Side Validation:**
   - Amount verification
   - User authentication required
   - Order creation only after payment

3. **Environment Variables:**
   - Secrets stored in .env
   - Not committed to Git

---

## **Next Steps**

### **For Production:**
1. Replace test keys with live keys
2. Update Razorpay account to live mode
3. Enable webhooks for payment notifications
4. Add order confirmation emails
5. Integrate Shiprocket for shipping

### **Current Status:**
✅ Razorpay integrated
✅ Test mode working
✅ Pack variants supported
✅ Cart data synced
⏳ Shiprocket integration (next)

---

## **API Reference**

### **Create Order**
```
POST /api/payment/create-order
Authorization: Bearer <token>

{
  "amount": 820,
  "currency": "INR"
}

Response:
{
  "success": true,
  "data": {
    "orderId": "order_xxx",
    "amount": 82000,
    "currency": "INR",
    "keyId": "rzp_test_xxx"
  }
}
```

### **Verify Payment**
```
POST /api/payment/verify
Authorization: Bearer <token>

{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx",
  "orderData": { ... }
}

Response:
{
  "success": true,
  "data": <Order Object>,
  "message": "Payment verified and order created successfully"
}
```

---

## **Troubleshooting**

### **Razorpay not loading:**
- Check if script is loaded in browser console
- Verify `window.Razorpay` exists

### **Payment fails:**
- Check backend logs for errors
- Verify API keys are correct
- Ensure MongoDB is connected

### **Signature mismatch:**
- Check RAZORPAY_KEY_SECRET is correct
- Verify order_id and payment_id match

---

**Status:** ✅ Ready for testing!
