# Correct E-commerce Checkout Flow - IMPLEMENTED

This document describes the industry-standard checkout flow now implemented in Wild Crunch.

## Flow Overview

Cart → Create Unpaid Order → Add Address → Payment → Update Order → Order Page

## Step-by-Step Process

### STEP 1: Cart → Create Unpaid Order
When user clicks checkout in cart, create order with status Pending

Endpoint: POST /api/orders/create-from-cart

What Happens:
- Get cart items from database
- Verify products exist
- Create Razorpay order (get Razorpay order ID)
- Create database order with Pending status
- Save Razorpay order ID in order
- Return order data

Frontend: Navigate to /address with orderId

### STEP 2: Address Page
User selects or adds shipping address

Endpoint: PUT /api/orders/:orderId/address

What Happens:
- User selects existing address OR adds new one
- Update order with shipping address
- Order remains Pending (unpaid)

Frontend: Navigate to /payment with orderId

### STEP 3: Payment Page
User pays using existing Razorpay order ID

What Happens:
- Fetch order details
- Open Razorpay with existing order ID
- User completes payment
- Razorpay returns payment details

### STEP 4: Payment Verification
Verify payment and mark order as Paid

Endpoint: POST /api/payment/verify

What Happens:
- Verify Razorpay signature
- Find order in database
- Update order status to Paid
- Save payment details
- Return updated order

Frontend: Clear cart and navigate to /order/:orderId

## Benefits

1. Order exists before payment (can track abandoned checkouts)
2. If payment fails, order status shows Failed
3. Can retry payment for same order
4. Better analytics (conversion funnel)
5. Can save multiple addresses before payment
6. Industry standard pattern

## Status: BACKEND READY

All backend routes implemented. Frontend updates needed next.
