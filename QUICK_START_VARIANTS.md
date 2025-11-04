# Quick Start: Product Variants

## Admin Panel - Adding Product with Variants

### Step 1: Access Admin Panel
1. Navigate to your admin panel
2. Go to **Products** section
3. Click **Add New Product**

### Step 2: Fill Basic Information
- **Product Name:** e.g., "Habanero Chilly Makhana"
- **Category:** Select from dropdown
- **Description:** Product description
- **Stock:** Available quantity
- **Weight:** Product weight in grams

### Step 3: Set Pricing Variants

#### Individual Pricing
- **Price (₹):** 200 *(required)*
- **Original Price (₹):** 250 *(optional - shows discount)*

#### Pack of 2 Pricing
- **Price (₹):** 380 *(required - total for 2 units)*
- **Original Price (₹):** 500 *(optional)*
- **Discount (%):** 5 *(default - can be changed)*

#### Pack of 4 Pricing
- **Price (₹):** 720 *(required - total for 4 units)*
- **Original Price (₹):** 1000 *(optional)*
- **Discount (%):** 10 *(default - can be changed)*

### Step 4: Upload Images
- Upload product images (minimum 1 required)
- First image will be the main display image

### Step 5: Save
- Click **Create Product** or **Update Product**

## Pricing Examples

### Example 1: Standard Discount
```
Individual: ₹200
Pack of 2: ₹380 (₹190 per unit, 5% off)
Pack of 4: ₹720 (₹180 per unit, 10% off)
```

### Example 2: Higher Bulk Discount
```
Individual: ₹200
Pack of 2: ₹360 (₹180 per unit, 10% off)
Pack of 4: ₹640 (₹160 per unit, 20% off)
```

### Example 3: With Original Prices
```
Individual: 
  - Price: ₹200
  - Original: ₹250 (20% off shown to customer)

Pack of 2:
  - Price: ₹380
  - Original: ₹500 (24% off shown)

Pack of 4:
  - Price: ₹720
  - Original: ₹1000 (28% off shown)
```

## Customer Experience

### On Product Page:
1. Customer sees three radio button options:
   - ⚪ **Individual** - ₹200
   - ⚪ **Pack of 2 (5% off)** - ₹380
   - ⚪ **Pack of 4 (10% off)** - ₹720

2. Price updates automatically when selection changes

3. Customer selects quantity and adds to cart

4. Cart shows: "Habanero Chilly Makhana (Pack of 2, Qty: 1) - ₹380"

## Tips for Setting Prices

### Calculate Per-Unit Savings:
```
Individual: ₹200 per unit
Pack of 2: ₹380 ÷ 2 = ₹190 per unit (₹10 savings)
Pack of 4: ₹720 ÷ 4 = ₹180 per unit (₹20 savings)
```

### Recommended Discount Structure:
- **Pack of 2:** 5-10% off per unit
- **Pack of 4:** 10-15% off per unit

### Competitive Pricing:
- Check competitor prices for similar pack sizes
- Ensure bulk discounts are attractive
- Consider shipping costs in pricing

## Common Questions

**Q: What if I don't want to offer all pack sizes?**
A: You still need to enter prices for all variants. Set the same price if you don't want to offer discounts.

**Q: Can I change prices later?**
A: Yes, edit the product in admin panel and update pricing variants.

**Q: What happens to existing products?**
A: They continue to work with automatic 5% and 10% discounts. Update them to use custom pricing.

**Q: How do I show a sale price?**
A: Use the "Original Price" field to show the strikethrough price.

**Q: Can discounts be different for each product?**
A: Yes, each product can have its own discount percentages.

## Troubleshooting

### Prices not updating on frontend:
1. Clear browser cache
2. Verify product was saved in admin panel
3. Check that all required price fields are filled

### Discount not showing:
1. Ensure "Original Price" is set and higher than "Price"
2. Verify discount percentage is set correctly

### Admin panel not showing variants:
1. Refresh the page
2. Check browser console for errors
3. Verify you're using the latest version

## Support

For issues or questions, check:
- `PRODUCT_VARIANTS_IMPLEMENTATION.md` - Technical details
- Admin panel help section
- Contact development team
