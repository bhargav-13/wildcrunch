# Stock Validation Fix - Add to Cart

## Problem

When trying to add products to cart, users were getting:
- **Error:** "Product out of stock"

Even though products had stock available in the database.

## Root Cause

The cart route was using incorrect field names to check stock:

### Before (Incorrect):
```javascript
// Line 62 - Wrong field names
if (!product.inStock || product.stockQuantity < quantity) {
  return res.status(400).json({
    success: false,
    message: 'Product out of stock'
  });
}
```

**Issues:**
1. `product.inStock` doesn't exist → Product model uses `isActive`
2. `product.stockQuantity` doesn't exist → Product model uses `stock`
3. `product.priceNumeric` doesn't exist → Product model uses `price` or `pricing.individual.price`

## Product Model Fields

The actual Product schema uses:
```javascript
{
  isActive: Boolean,        // Not 'inStock'
  stock: Number,            // Not 'stockQuantity'
  price: Number,            // Not 'priceNumeric'
  pricing: {                // New pricing variants
    individual: { price, originalPrice },
    packOf2: { price, originalPrice, discount },
    packOf4: { price, originalPrice, discount }
  }
}
```

## Solution

Updated the cart route to use correct field names:

### After (Correct):
```javascript
// Check stock with correct field names
if (!product.isActive || product.stock < quantity) {
  return res.status(400).json({
    success: false,
    message: 'Product out of stock'
  });
}
```

### Price Calculation Fix:
```javascript
// Calculate pack price if not provided
let finalPackPrice = packPrice;
if (!finalPackPrice) {
  // Use pricing variants if available
  if (product.pricing) {
    if (pack === '1') {
      finalPackPrice = product.pricing.individual.price;
    } else if (pack === '2') {
      finalPackPrice = product.pricing.packOf2.price;
    } else if (pack === '4') {
      finalPackPrice = product.pricing.packOf4.price;
    }
  } else {
    // Fallback to legacy price calculation
    const basePrice = product.price;
    if (pack === '1') {
      finalPackPrice = basePrice;
    } else if (pack === '2') {
      finalPackPrice = Math.round(basePrice * 2 * 0.95);
    } else if (pack === '4') {
      finalPackPrice = Math.round(basePrice * 4 * 0.90);
    }
  }
}
```

## Files Modified

### `backend/routes/cart.js`

**Line 62 - Stock Validation:**
```javascript
// Before
if (!product.inStock || product.stockQuantity < quantity)

// After
if (!product.isActive || product.stock < quantity)
```

**Lines 48-71 - Price Calculation:**
```javascript
// Before
const basePrice = product.priceNumeric;

// After
if (product.pricing) {
  // Use pricing variants
  finalPackPrice = product.pricing.individual.price;
} else {
  // Fallback to legacy price
  const basePrice = product.price;
}
```

## How It Works Now

### Stock Validation:
1. **Check if product is active:** `product.isActive === true`
2. **Check if enough stock:** `product.stock >= quantity`
3. **Allow add to cart** if both conditions pass

### Price Calculation:
1. **Check for pricing variants:** If `product.pricing` exists, use variant prices
2. **Fallback to legacy:** If no variants, calculate from `product.price`
3. **Use provided price:** If `packPrice` is sent from frontend, use it directly

## Testing

### Test Add to Cart:
1. Create a product in admin panel with:
   - Stock: 100
   - isActive: true
   - Pricing variants set

2. Navigate to product page
3. Select pack size
4. Click "Add to Cart"
5. ✅ Should add successfully

### Test Stock Validation:
1. Create product with stock: 5
2. Try to add quantity: 10
3. ❌ Should show "Product out of stock"

### Test Inactive Product:
1. Set product isActive: false in admin
2. Try to add to cart
3. ❌ Should show "Product out of stock"

## Field Mapping Reference

| Frontend/Old | Backend Model | Description |
|--------------|---------------|-------------|
| `inStock` | `isActive` | Product availability status |
| `stockQuantity` | `stock` | Available quantity |
| `priceNumeric` | `price` | Legacy price field |
| N/A | `pricing.individual.price` | Individual pack price |
| N/A | `pricing.packOf2.price` | Pack of 2 price |
| N/A | `pricing.packOf4.price` | Pack of 4 price |

## Why This Happened

The field names were inconsistent between:
1. **Frontend transformation** - Used `inStock`, `stockQuantity`, `priceNumeric`
2. **Backend model** - Uses `isActive`, `stock`, `price`
3. **Cart route** - Was using frontend field names instead of model fields

## Related Fixes

This fix complements:
- `CART_WISHLIST_FIX.md` - Fixed product ID lookup
- `PRODUCT_VARIANTS_IMPLEMENTATION.md` - Added pricing variants
- `BACKEND_INTEGRATION_COMPLETE.md` - Backend integration

## Verification

After this fix, the following should work:
- ✅ Add to cart with sufficient stock
- ✅ Add to cart with different pack sizes
- ✅ Correct prices calculated for each pack
- ✅ Stock validation prevents over-ordering
- ✅ Inactive products cannot be added
- ✅ Error messages are accurate

## Admin Panel Checklist

When creating products, ensure:
- [ ] Stock quantity is set (e.g., 100)
- [ ] isActive is checked (enabled)
- [ ] All pricing variants are filled:
  - [ ] Individual price
  - [ ] Pack of 2 price
  - [ ] Pack of 4 price
- [ ] At least one image uploaded

## Future Improvements

1. **Real-time stock updates:** Decrease stock when added to cart
2. **Stock reservation:** Reserve stock during checkout
3. **Low stock warning:** Show "Only X left" message
4. **Backorder support:** Allow orders when out of stock
5. **Stock history:** Track stock changes over time
