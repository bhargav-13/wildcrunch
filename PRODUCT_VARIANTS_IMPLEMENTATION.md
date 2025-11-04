# Product Variants Implementation

## Overview
This document describes the implementation of product pricing variants (Individual, Pack of 2, Pack of 4) across the entire application stack.

## Changes Made

### 1. Backend - Database Model (`backend/models/Product.js`)

**Added pricing variants structure:**
```javascript
pricing: {
  individual: {
    price: Number,
    originalPrice: Number
  },
  packOf2: {
    price: Number,
    originalPrice: Number,
    discount: Number (default: 5%)
  },
  packOf4: {
    price: Number,
    originalPrice: Number,
    discount: Number (default: 10%)
  }
}
```

**Key Features:**
- Supports three pricing tiers: Individual, Pack of 2, Pack of 4
- Each tier has its own price and original price (for showing discounts)
- Discount percentages are configurable per tier
- Legacy `price` and `originalPrice` fields maintained for backward compatibility

### 2. Backend - API Routes (`backend/routes/products.js`)

**Updated endpoints:**
- `POST /api/products` - Create product with pricing variants
- `PUT /api/products/:id` - Update product with pricing variants

**Backward Compatibility:**
- Routes accept both new `pricing` object and legacy `price`/`originalPrice` fields
- If only legacy fields provided, they're used for individual pricing
- Legacy fields are auto-populated from individual pricing for compatibility

### 3. Admin Panel (`wildcrunch-admin/src/components/ProductModal.tsx`)

**New UI Features:**
- Three separate pricing sections (Individual, Pack of 2, Pack of 4)
- Each section includes:
  - Price (₹) - Required
  - Original Price (₹) - Optional (for showing strikethrough)
  - Discount (%) - Display-only for Pack of 2 and Pack of 4

**Form Structure:**
```typescript
pricing: {
  individual: { price, originalPrice },
  packOf2: { price, originalPrice, discount },
  packOf4: { price, originalPrice, discount }
}
```

**Admin Workflow:**
1. Enter product details
2. Set Individual price (required)
3. Set Pack of 2 price (required)
4. Set Pack of 4 price (required)
5. Optionally set original prices to show discounts
6. Discount percentages are configurable (default 5% and 10%)

### 4. Frontend - Product Interface (`src/data/product.ts`, `src/hooks/useProducts.ts`)

**Updated Product Interface:**
```typescript
interface Product {
  // ... existing fields
  pricing?: {
    individual: { price, originalPrice },
    packOf2: { price, originalPrice, discount },
    packOf4: { price, originalPrice, discount }
  }
}
```

### 5. Frontend - Product Page (`src/components/Product/Inproduct.tsx`)

**Updated Price Calculation:**
- Now uses backend pricing data when available
- Falls back to legacy calculation for products without pricing variants
- Seamless integration with existing pack selection UI

**Price Display Logic:**
```typescript
if (product.pricing) {
  // Use backend pricing
  return product.pricing[selectedPack].price;
} else {
  // Fallback to legacy calculation
  return calculateLegacyPrice(basePrice, selectedPack);
}
```

## How to Use

### For Admins:

1. **Creating a New Product:**
   - Go to Admin Panel → Products → Add Product
   - Fill in product details
   - Set pricing for all three variants:
     - Individual: Base price per unit
     - Pack of 2: Total price for 2 units
     - Pack of 4: Total price for 4 units
   - Optionally set original prices to show discounts
   - Save the product

2. **Example Pricing:**
   - Individual: ₹200
   - Pack of 2: ₹380 (5% off = ₹190 per unit)
   - Pack of 4: ₹720 (10% off = ₹180 per unit)

### For Customers:

1. **Product Page:**
   - Select pack size (Individual, Pack of 2, Pack of 4)
   - Price updates automatically based on selection
   - Discount percentage shown for pack options
   - Add to cart with selected pack size

## Migration Notes

### Existing Products:
- Products created before this update will continue to work
- They use legacy price calculation (5% off for Pack of 2, 10% off for Pack of 4)
- Can be updated in admin panel to use new pricing structure

### Database Migration:
- No migration required - new fields are optional
- Existing products remain functional
- Update products individually through admin panel as needed

## API Examples

### Create Product with Variants:
```json
POST /api/products
{
  "name": "Habanero Chilly Makhana",
  "description": "Spicy makhana snack",
  "pricing": {
    "individual": {
      "price": 200,
      "originalPrice": 250
    },
    "packOf2": {
      "price": 380,
      "originalPrice": 500,
      "discount": 5
    },
    "packOf4": {
      "price": 720,
      "originalPrice": 1000,
      "discount": 10
    }
  },
  "category": "Makhana",
  "stock": 100,
  "images": ["url1", "url2"]
}
```

### Update Product Variants:
```json
PUT /api/products/:id
{
  "pricing": {
    "individual": { "price": 220, "originalPrice": 250 },
    "packOf2": { "price": 418, "originalPrice": 500, "discount": 5 },
    "packOf4": { "price": 792, "originalPrice": 1000, "discount": 10 }
  }
}
```

## Benefits

1. **Flexible Pricing:** Admins can set custom prices for each pack size
2. **Better Discounts:** Show actual savings to customers
3. **Inventory Management:** Track sales by pack size
4. **Marketing:** Promote bulk purchases with visible discounts
5. **Backward Compatible:** Existing products continue to work

## Testing Checklist

- [ ] Create new product with all pricing variants in admin panel
- [ ] Update existing product with new pricing structure
- [ ] Verify prices display correctly on product page
- [ ] Test pack selection changes price correctly
- [ ] Add to cart with different pack sizes
- [ ] Verify cart shows correct prices
- [ ] Complete checkout with variant products
- [ ] Check order confirmation shows correct pricing

## Future Enhancements

1. Bulk pricing calculator in admin panel
2. Automatic discount calculation based on quantity
3. Time-limited promotional pricing
4. Customer-specific pricing tiers
5. Analytics on pack size preferences
