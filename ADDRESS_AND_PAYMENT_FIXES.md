# Address & Payment Flow Fixes

## ✅ Issues Fixed

### **1. Order Model Updated**
**File:** `backend/models/Order.js`

**Changes:**
- Added `pack` and `packPrice` fields to order items
- Updated `shippingAddress` structure to match our data:
  - `fullName` (instead of `name`)
  - Added `email`, `area`, `state` fields
  - `address` (combined address instead of separate lines)
- Added `razorpay` to payment method enum
- Added Razorpay-specific payment details:
  - `razorpayOrderId`
  - `razorpayPaymentId`
  - `razorpaySignature`
- Added `isPaid` and `paidAt` fields

### **2. Address Form Enhanced**
**File:** `src/components/Buy/Address.tsx`

**Changes:**
- Added **State** field to the form (required field)
- Added form validation before saving
- Saving address with proper structure including state
- Using real cart data (removed mock data)
- Pre-filling user's name and email if available

**Address Structure Saved:**
```javascript
{
  fullName: "First Last",
  email: "user@email.com",
  phone: "1234567890",
  address: "Block, Building, Street",
  area: "Area Name",
  city: "Mumbai",
  state: "Maharashtra",
  pincode: "400001"
}
```

### **3. Payment Verification Fixed**
**File:** `backend/routes/payment.js`

**Changes:**
- Added `paymentStatus: 'Paid'` when creating order
- Removed population of `items.product` that might fail
- Better error handling

---

## **How It Works Now**

### **Complete Flow:**

1. **Cart Page** (`/cart`)
   - Shows all products with pack variants
   - Each pack (Individual, Pack of 2, Pack of 4) is a separate item
   - Click "Next Step" → Goes to Address page

2. **Address Page** (`/address`)
   - Fill in all required fields:
     - Personal Information (First name, Last name, Email, Contact)
     - Shipping Address (Building, Block/Flat, Street, Area, City, State, Zipcode)
   - Accept privacy policy & general conditions
   - Click "Next Step" → Validates and saves to localStorage
   - Navigates to Payment page

3. **Payment Page** (`/payment`)
   - Shows order summary with pack information
   - Fetches address from localStorage
   - Click "Pay Now" → Opens Razorpay
   - Complete payment → Verifies signature
   - Creates order in database with:
     - Order number (auto-generated: WC-XXXXX-XXXX)
     - Cart items with pack details
     - Shipping address
     - Payment details (Razorpay IDs)
     - Payment status: Paid
   - Clears cart
   - Redirects to confirmation page

---

## **Database Structure**

### **Order Collection:**
```javascript
{
  _id: ObjectId,
  orderNumber: "WC-XXXXX-XXXX",
  user: ObjectId (ref: User),
  items: [
    {
      product: ObjectId (ref: Product),
      productId: "1",
      name: "Salt & Pepper Makhana",
      price: "₹200",
      priceNumeric: 200,
      quantity: 2,
      pack: "2",           // NEW
      packPrice: 380       // NEW
    }
  ],
  shippingAddress: {
    fullName: "John Doe",
    email: "john@email.com",
    phone: "1234567890",
    address: "101, ABC Building, MG Road",
    area: "Andheri",
    city: "Mumbai",
    state: "Maharashtra",  // NEW
    pincode: "400001",
    country: "India"
  },
  paymentMethod: "razorpay",
  paymentStatus: "Paid",
  paymentDetails: {
    razorpayOrderId: "order_xxx",
    razorpayPaymentId: "pay_xxx",
    razorpaySignature: "sig_xxx"
  },
  itemsPrice: 760,
  shippingPrice: 60,
  totalPrice: 820,
  isPaid: true,
  paidAt: Date,
  orderStatus: "Processing",
  createdAt: Date,
  updatedAt: Date
}
```

---

## **Testing Instructions**

### **1. Restart Backend:**
```bash
cd backend
npm run dev
```

### **2. Test Complete Flow:**

1. **Add Products to Cart:**
   - Go to products page
   - Add same product with different packs
   - Example: 
     - 1x Salt & Pepper (Individual)
     - 2x Salt & Pepper (Pack of 2)
     - 1x Salt & Pepper (Pack of 4)

2. **Go to Cart (`/cart`):**
   - Verify all 3 items show as separate entities
   - Verify pack labels show correctly
   - Verify prices are correct
   - Click "Next Step"

3. **Fill Address Form (`/address`):**
   - First name: John
   - Last name: Doe
   - Email: john@email.com
   - Contact: 9876543210
   - Building: ABC Apartments
   - Block/Flat: 101
   - Street: MG Road
   - Area: Andheri West
   - Zipcode: 400001
   - City: Mumbai
   - State: Maharashtra
   - Check both checkboxes
   - Click "Next Step"

4. **Payment Page (`/payment`):**
   - Verify order summary shows all items with packs
   - Verify total is correct
   - Click "Pay Now"

5. **Razorpay Checkout:**
   - **Test Card:** 4111 1111 1111 1111
   - **CVV:** Any 3 digits
   - **Expiry:** Any future date
   - Complete payment

6. **Verify:**
   - Payment should succeed
   - Order created in database
   - Cart cleared
   - Redirected to confirmation page

---

## **Check Order in Database**

Use MongoDB Compass or shell:

```javascript
db.orders.find().sort({ createdAt: -1 }).limit(1).pretty()
```

Should show:
- Order number
- All items with pack information
- Complete shipping address with state
- Payment status: "Paid"
- Razorpay payment IDs

---

## **Common Issues & Solutions**

### **Issue: 500 Error on Payment**
**Cause:** Environment variables not loaded
**Solution:** 
1. Check `backend/.env` has Razorpay keys
2. Restart backend with `npm run dev`

### **Issue: Address not saving**
**Cause:** Missing required fields
**Solution:** Fill all fields including state

### **Issue: Order not created**
**Cause:** Product reference invalid
**Solution:** Make sure products are seeded with `npm run seed`

---

## **Next Steps**

1. ✅ Address saving to localStorage - DONE
2. ✅ Order creation after payment - DONE
3. ✅ Pack information in orders - DONE
4. ⏳ Save address to user profile - PENDING
5. ⏳ Load saved addresses in checkout - PENDING
6. ⏳ Shiprocket integration - NEXT

---

## **Status: Ready for Testing** ✅

All fixes applied. Please:
1. Restart backend server
2. Test complete checkout flow
3. Verify order is created in database
4. Report any errors

**After successful testing, we'll add:**
- Address management in user profile
- Shiprocket integration for shipping
