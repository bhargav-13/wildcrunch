# Cloudinary Setup Guide

This guide will help you set up Cloudinary for product image management in Wild Crunch.

## Prerequisites

1. A Cloudinary account (free tier available)
2. Node.js and npm installed

## Step 1: Create Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email address

## Step 2: Get Cloudinary Credentials

1. Log in to your Cloudinary dashboard
2. You'll see your account details on the dashboard:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## Step 3: Configure Backend

1. Navigate to the `backend` directory
2. Copy `.env.example` to `.env` if you haven't already:
   ```bash
   cp .env.example .env
   ```

3. Add your Cloudinary credentials to `.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Install required packages:
   ```bash
   npm install cloudinary multer
   ```

## Step 4: Configure Admin Panel

1. Navigate to the `wildcrunch-admin` directory
2. Copy `.env.example` to `.env.local` if you haven't already:
   ```bash
   cp .env.example .env.local
   ```

3. Add your Cloudinary configuration:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

### Creating an Upload Preset (Optional)

If you want to use Cloudinary's upload widget in the future:

1. Go to **Settings** > **Upload** in your Cloudinary dashboard
2. Scroll to **Upload presets**
3. Click **Add upload preset**
4. Set the following:
   - **Signing Mode**: Unsigned (for client-side uploads) or Signed (for server-side)
   - **Folder**: `wildcrunch/products`
   - Add any transformations you want applied automatically
5. Save and copy the preset name to your `.env.local`

## Step 5: How It Works

### Backend Upload Flow

1. **Admin uploads image** → Image file sent to backend as multipart/form-data
2. **Multer middleware** → Validates and stores file in memory
3. **Cloudinary upload** → Image uploaded to Cloudinary with automatic optimization
4. **Database save** → Cloudinary URL saved to product in MongoDB

### Features Included

- **Image Upload**: Drag & drop or click to upload images
- **File Validation**: Only accepts images (JPEG, PNG, GIF, WEBP) up to 5MB
- **Automatic Optimization**: Images are automatically optimized by Cloudinary
- **Image Transformations**: Limits max dimensions to 1000x1000px
- **Old Image Cleanup**: When updating/deleting products, old images are removed from Cloudinary
- **Fallback URL Input**: Can also paste image URLs directly

## API Endpoints

### Create Product with Image
```bash
POST /api/products
Content-Type: multipart/form-data

FormData:
- image: <file>
- name: "Product Name"
- price: "₹299"
- category: "Makhana"
- ... (other fields)
```

### Update Product with Image
```bash
PUT /api/products/:id
Content-Type: multipart/form-data

FormData:
- image: <file> (optional - only if changing image)
- name: "Updated Name"
- ... (other fields)
```

### Delete Product
```bash
DELETE /api/products/:id

# Automatically deletes associated image from Cloudinary
```

## File Structure

```
backend/
├── config/
│   └── cloudinary.js          # Cloudinary configuration
├── middleware/
│   └── upload.js              # Multer file upload middleware
├── utils/
│   └── cloudinaryUpload.js    # Upload/delete utility functions
└── routes/
    └── products.js            # Updated with image handling

wildcrunch-admin/
└── components/
    └── ImageUpload.tsx        # Image upload component
```

## Troubleshooting

### Images not uploading

1. Check that Cloudinary credentials are correct in `.env`
2. Verify the backend server is running
3. Check browser console for errors
4. Ensure image file is under 5MB

### Old images not being deleted

- The system extracts the public ID from the Cloudinary URL
- If the URL format is different, check the `getPublicIdFromUrl` function
- Manually delete orphaned images from Cloudinary dashboard if needed

### CORS errors

- Ensure your backend CORS configuration allows the admin panel origin
- Check `backend/server.js` for allowed origins

## Security Notes

- Never commit `.env` files to version control
- Keep your API Secret secure
- Use signed uploads for production environments
- Consider adding authentication to product routes in production

## Next Steps

1. Test image upload by creating a new product
2. Verify images appear in Cloudinary dashboard under `wildcrunch/products`
3. Test image update by editing a product
4. Test image deletion by deleting a product

## Support

For Cloudinary-specific issues, visit:
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Node.js SDK Guide](https://cloudinary.com/documentation/node_integration)
