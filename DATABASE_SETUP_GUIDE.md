# Fresh Database Setup Guide - Wild Crunch Admin Panel

## What Was Changed

I've created a completely fresh database structure for products with unlimited image support. Here's what's new:

### 1. New Product Model (backend/models/Product.js)

The product model now supports:
- **Unlimited Images** - `images` field is an array of URLs
- **Proper Data Types** - Numbers for price, stock, weight, nutrition
- **Clean Structure** - No redundant fields
- **Validation** - At least 1 image required

**Fields:**
- `name` - Product name (required)
- `description` - Product description (required)
- `price` - Current price (Number, required)
- `originalPrice` - Original price for discounts (Number, optional)
- `category` - Product category (String, required)
- `images` - Array of image URLs (Array, required, min 1 image)
- `stock` - Stock quantity (Number, required)
- `weight` - Weight in grams (Number, optional)
- `nutritionInfo` - Calories, protein, carbs, fat (Numbers, optional)
- `isActive` - Active status (Boolean, default true)
- `ratings` - Average and count (auto-calculated)

### 2. Updated Product Routes (backend/routes/products.js)

All CRUD operations now work with MongoDB `_id`:
- `GET /api/products` - Get all products (with filtering/sorting)
- `GET /api/products/:id` - Get single product by MongoDB _id
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `GET /api/products/categories/list` - Get all categories

### 3. Image Upload via Backend (backend/routes/upload.js)

Secure image upload using your Cloudinary credentials:
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images
- All uploads protected with admin authentication

### 4. Admin Panel Features

The admin panel now supports:
- Add products with unlimited images
- Edit products and their images
- View all products with images and prices
- Delete products
- Filter and search products
- Proper image display in product list

## How to Reset and Start Fresh

### Step 1: Clear Old Products

```bash
cd backend
npm run clear-products
```

This will delete ALL existing products from the database.

### Step 2: Restart Backend Server

**IMPORTANT: Stop your current backend server (Ctrl+C) and restart it:**

```bash
cd backend
npm start
```

This loads the new routes and model.

### Step 3: Start Admin Panel

```bash
cd wildcrunch-admin
npm run dev
```

The admin panel runs on http://localhost:3001

### Step 4: Login and Add Products

1. Go to http://localhost:3001
2. Login with:
   - Email: `admin@wildcrunch.com`
   - Password: `admin123`
3. Click **Products** in sidebar
4. Click **Add Product** button
5. Fill in product details
6. Upload unlimited images (click upload button multiple times)
7. Click **Create Product**

## Product Creation Workflow

1. **Fill Basic Info:**
   - Name (required)
   - Description (required)
   - Category (required)

2. **Set Pricing:**
   - Price (required)
   - Original Price (optional, for showing discounts)
   - Stock (required)

3. **Add Details:**
   - Weight in grams (optional)
   - Nutrition info: calories, protein, carbs, fat (all optional)

4. **Upload Images:**
   - Click the upload box
   - Select one or multiple images
   - Repeat to add more images (unlimited)
   - Remove any image by hovering and clicking X

5. **Set Status:**
   - Check "Active" to make visible to customers
   - Uncheck to hide from customers

6. **Save:**
   - Click "Create Product" for new product
   - Click "Update Product" for existing product

## Features

### Unlimited Images
- Upload as many product images as you want
- Drag to reorder (coming soon)
- Click X to remove any image
- First image is the main product image

### Smart Data Handling
- All numbers stored properly (not as strings)
- Proper validation on all fields
- Clean error messages

### Admin Security
- All product operations require admin login
- Image uploads protected
- JWT token authentication

## Troubleshooting

### Backend Won't Start
**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
1. Find what's using port 5000
2. Stop that process
3. Restart backend

### Images Won't Upload
**Error:** `Failed to upload images` or `ERR_CONNECTION_REFUSED`

**Solution:**
1. Make sure backend is running on port 5000
2. Check Cloudinary credentials in `backend/.env`
3. Verify admin token is valid (try logging out and in)

### Products Not Showing
**Solution:**
1. Check browser console for errors
2. Verify backend is running
3. Check MongoDB connection in backend logs
4. Try clearing products and adding a fresh one

### Can't Edit Products
**Solution:**
1. Make sure you clicked the Edit button (pencil icon)
2. Check browser console for errors
3. Verify product has valid `_id` field

## API Response Format

All endpoints return standardized responses:

**Success:**
```json
{
  "success": true,
  "products": [...],  // for GET all
  "data": {...}        // for GET one, POST, PUT
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Next Steps

1. **Clear old products:** `npm run clear-products`
2. **Restart backend:** Stop and `npm start`
3. **Add products one by one** through admin panel
4. **Products will automatically show** in frontend (once you connect frontend to backend)

## Database Structure

Your MongoDB now has this structure:

```
wildcrunch (database)
├── users (collection)
│   └── admin user
├── products (collection)  ← NEW CLEAN STRUCTURE
│   └── products with unlimited images
├── orders (collection)
└── ... (other collections)
```

## Important Notes

1. **Don't run old seed scripts** - They use the old product structure
2. **Add products manually** through admin panel for now
3. **All prices are in Rupees (₹)**
4. **At least 1 image is required** for each product
5. **Backend must be restarted** to load new routes
6. **Use MongoDB _id** for all product operations (not custom id field)

---

Your database is now ready for fresh product data! 🎉
