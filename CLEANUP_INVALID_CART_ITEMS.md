# Cleanup Invalid Cart Items

## Problem

Error: "Product 690a7130521e5cdd588930a3 not found"

This happens when:
1. Products were added to cart
2. Those products were deleted from database
3. Cart still has references to deleted products
4. Order creation fails because products don't exist

## Quick Fix - Clear Your Cart

### Option 1: Via Frontend
1. Go to cart page (`/cart`)
2. Remove all items manually
3. Add fresh products from database

### Option 2: Via Backend (MongoDB)
Run this in MongoDB shell or Compass:

```javascript
// Clear all cart items for all users
db.carts.updateMany(
  {},
  { $set: { items: [], totalItems: 0, totalPrice: 0 } }
)
```

### Option 3: Via Backend API
Add a cleanup endpoint (temporary):

**File: `backend/routes/cart.js`**

```javascript
// @route   DELETE /api/cart/cleanup
// @desc    Remove invalid products from cart
// @access  Private
router.delete('/cleanup', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.json({
        success: true,
        message: 'No cart found'
      });
    }

    // Check each item
    const validItems = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        validItems.push(item);
      }
    }

    cart.items = validItems;
    await cart.save();

    res.json({
      success: true,
      data: cart,
      message: `Removed ${cart.items.length - validItems.length} invalid items`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
```

## Permanent Solution - Auto-Cleanup

Update the order creation route to skip invalid products:

**File: `backend/routes/orders.js`**

```javascript
// Verify products and build order items with ObjectIds
const orderItems = [];
const invalidProducts = [];
let itemsPrice = 0;

for (const cartItem of cart.items) {
  const product = await Product.findById(cartItem.productId);
  
  if (!product) {
    // Track invalid product instead of failing
    invalidProducts.push(cartItem.productId);
    continue; // Skip this item
  }

  const itemPrice = cartItem.packPrice || cartItem.priceNumeric;
  
  orderItems.push({
    product: product._id,
    productId: cartItem.productId,
    name: cartItem.name,
    price: cartItem.price,
    priceNumeric: cartItem.priceNumeric,
    quantity: cartItem.quantity,
    pack: cartItem.pack || '1',
    packPrice: cartItem.packPrice
  });

  itemsPrice += itemPrice * cartItem.quantity;
}

// If no valid items, return error
if (orderItems.length === 0) {
  return res.status(400).json({
    success: false,
    message: 'No valid products in cart'
  });
}

// Remove invalid items from cart
if (invalidProducts.length > 0) {
  cart.items = cart.items.filter(
    item => !invalidProducts.includes(item.productId)
  );
  await cart.save();
}

// Continue with order creation...
```

## Prevention

### 1. Soft Delete Products
Instead of deleting products, mark them as inactive:

```javascript
// Don't do this:
await Product.findByIdAndDelete(id);

// Do this instead:
await Product.findByIdAndUpdate(id, { isActive: false });
```

### 2. Validate Cart on Load
Check cart items when user visits cart page:

```javascript
// Frontend: src/contexts/CartContext.tsx
const validateCart = async () => {
  try {
    await cartAPI.cleanup(); // Call cleanup endpoint
    await refreshCart();
  } catch (error) {
    console.error('Cart validation error:', error);
  }
};

useEffect(() => {
  if (isAuthenticated) {
    validateCart();
  }
}, [isAuthenticated]);
```

### 3. Show Warning for Invalid Items
Display message when invalid items are detected:

```typescript
if (cart?.items?.some(item => !item.product)) {
  toast.warning('Some items in your cart are no longer available');
}
```

## Testing

### Test Invalid Product Handling:
1. Add product to cart
2. Delete product from admin panel
3. Try to create order
4. ✅ Should skip invalid product
5. ✅ Should create order with valid products only
6. ✅ Should clean up cart

### Test Empty Cart:
1. Delete all products from cart
2. Try to create order
3. ✅ Should show "No valid products in cart"

## Current Status

**Fixed:**
- ✅ Product lookup uses `findById()`
- ✅ Stock field uses `stock` not `stockQuantity`

**Issue:**
- ❌ Old cart items reference deleted products
- ❌ Order creation fails

**Solution:**
1. Clear your cart (remove all items)
2. Add fresh products from database
3. Try order creation again

## Manual Cleanup Steps

### Step 1: Check Your Cart
```bash
# In MongoDB shell
db.carts.find({ user: ObjectId("YOUR_USER_ID") })
```

### Step 2: Check Products
```bash
# Check if products exist
db.products.find({ _id: ObjectId("690a7130521e5cdd588930a3") })
```

### Step 3: Clear Cart
```bash
# Clear cart items
db.carts.updateOne(
  { user: ObjectId("YOUR_USER_ID") },
  { $set: { items: [], totalItems: 0, totalPrice: 0 } }
)
```

### Step 4: Add Fresh Products
1. Go to products page
2. Add products to cart
3. Try checkout again

## API Endpoints

### Clear Cart:
```
DELETE /api/cart/clear
Authorization: Bearer <token>
```

### Remove Invalid Items:
```
DELETE /api/cart/cleanup
Authorization: Bearer <token>
```

## Summary

The error occurs because your cart has old product IDs that no longer exist in the database. 

**Quick Fix:** Clear your cart and add fresh products.

**Long-term Fix:** Implement auto-cleanup or soft-delete for products.
