# Cloudinary Setup Guide for Wild Crunch

This guide will help you set up Cloudinary for product image uploads in the Wild Crunch e-commerce backend.

## What is Cloudinary?

Cloudinary is a cloud-based media management platform that provides:
- **Free Tier**: 25 GB storage, 25 GB bandwidth/month, 25,000 transformations
- Automatic image optimization and format conversion (WebP)
- Built-in CDN for fast global delivery
- Image transformations (resize, crop, quality adjustment)
- No credit card required for free tier

## Setup Instructions

### Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Click **"Sign Up for Free"**
3. Fill in your details:
   - Name
   - Email
   - Password
   - Company name (can be your project name)
4. Verify your email address
5. Complete the signup process

### Step 2: Get Your Credentials

1. After signing up, you'll be taken to the **Dashboard**
2. You'll see your credentials in the **"Account Details"** section:
   - **Cloud Name**: Your unique cloud identifier
   - **API Key**: Your public API key
   - **API Secret**: Your private API secret (keep this secure!)

Alternatively, you can find them at:
- Dashboard → Settings (gear icon) → Access Keys

### Step 3: Add Credentials to Your Backend

1. Open your backend `.env` file (or create one if it doesn't exist)
2. Add the following environment variables:

```bash
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

3. Replace the placeholder values with your actual credentials:
   - Replace `your_cloud_name_here` with your Cloud Name
   - Replace `your_api_key_here` with your API Key
   - Replace `your_api_secret_here` with your API Secret

**Example:**
```bash
CLOUDINARY_CLOUD_NAME=wildcrunch-demo
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

### Step 4: Verify the Setup

1. Start your backend server:
   ```bash
   npm run dev
   ```

2. Check the console output. You should see:
   ```
   ✅ Cloudinary configured successfully
   ```

3. If you see a warning instead:
   ```
   ⚠️  Cloudinary credentials not configured. Image uploads will fail.
   ```
   Double-check that:
   - Your `.env` file is in the `/backend` directory
   - The variable names are spelled correctly
   - There are no extra spaces in the values
   - You've saved the `.env` file

### Step 5: Test Image Upload

You can test the image upload functionality using these methods:

#### Option 1: Using Postman/Thunder Client

1. **Create an Admin User** (or login with existing admin):
   - POST `http://localhost:5000/api/auth/login`
   - Body: `{ "email": "admin@example.com", "password": "your_password" }`
   - Copy the `token` from the response

2. **Upload an Image**:
   - POST `http://localhost:5000/api/products/upload`
   - Headers: `Authorization: Bearer YOUR_TOKEN_HERE`
   - Body: Select `form-data`
   - Add field: `image` (type: File)
   - Select an image file from your computer
   - Send the request

3. **Expected Response**:
   ```json
   {
     "success": true,
     "message": "Image uploaded successfully",
     "data": {
       "url": "https://res.cloudinary.com/wildcrunch-demo/image/upload/v1234567890/wildcrunch/products/abc123.jpg",
       "publicId": "wildcrunch/products/abc123",
       "originalName": "product-image.jpg",
       "size": 245678,
       "format": "jpg"
     }
   }
   ```

4. **Copy the `url`** - you can use this URL as the `imageSrc` when creating products

#### Option 2: Using curl

```bash
# Replace YOUR_TOKEN with your actual JWT token
curl -X POST http://localhost:5000/api/products/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/your/image.jpg"
```

## Image Upload Features

### Automatic Optimization
- Images are automatically resized to max 1000x1000px (maintains aspect ratio)
- Quality is automatically optimized
- Automatic format conversion to WebP for supported browsers
- Original images are preserved

### Supported Formats
- JPG/JPEG
- PNG
- WebP
- GIF

### File Size Limits
- Maximum file size: **5 MB**
- Recommended size: **1-2 MB** for best performance

### Storage Location
All product images are stored in the `wildcrunch/products` folder in your Cloudinary account.

You can view them at:
1. Cloudinary Dashboard → Media Library
2. Navigate to the `wildcrunch/products` folder

## API Endpoints

### 1. Upload Product Image
```
POST /api/products/upload
Headers: Authorization: Bearer {admin_token}
Body: FormData with 'image' field
```

### 2. Create Product with Image
```
POST /api/products
Headers: Authorization: Bearer {admin_token}
Body: FormData with product fields + 'image' file
```

### 3. Update Product with New Image
```
PUT /api/products/:id
Headers: Authorization: Bearer {admin_token}
Body: FormData with product fields + 'image' file
```

### 4. Delete Image from Cloudinary
```
DELETE /api/products/image/:publicId
Headers: Authorization: Bearer {admin_token}
```

See `API_DOCUMENTATION.md` for detailed request/response examples.

## Troubleshooting

### Error: "Cloudinary credentials not configured"
- Check that your `.env` file exists in `/backend` directory
- Verify variable names are exactly: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Ensure there are no typos or extra spaces
- Restart your server after updating `.env`

### Error: "Only image files are allowed"
- Ensure you're uploading an image file (jpg, png, webp, gif)
- Check the file extension is correct
- Try a different image file

### Error: "File size too large"
- Maximum file size is 5MB
- Compress your image before uploading
- Use online tools like TinyPNG or ImageOptim

### Error: "Invalid signature"
- Your API Secret might be incorrect
- Copy it again from Cloudinary Dashboard
- Make sure there are no extra characters or spaces

### Images not loading in frontend
- Check that the Cloudinary URL is correctly saved in the database
- Verify the URL is publicly accessible (open it in a browser)
- Check CORS settings in Cloudinary Dashboard (usually not needed)

## Best Practices

1. **Image Size**: Upload high-quality images (1000x1000px or larger)
2. **File Names**: Use descriptive names for easier management
3. **Cleanup**: Delete unused images from Cloudinary to save space
4. **Backup**: Keep original images as backup before uploading
5. **Testing**: Test uploads in development before using in production

## Free Tier Limits

Cloudinary's free tier includes:
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **Images**: Unlimited number of images

**Estimated Capacity**:
- ~25,000 product images (assuming 1MB average)
- ~25,000 page views per month (if each loads 1 image)

This is more than enough for most small to medium e-commerce sites!

## Upgrading (Optional)

If you exceed the free tier limits, Cloudinary offers paid plans starting at $99/month with:
- 85 GB storage
- 160 GB bandwidth
- 155,000 transformations

You can monitor your usage at:
Dashboard → Analytics → Usage

## Security Notes

1. **Never commit `.env` file** to Git (it's already in `.gitignore`)
2. **Keep API Secret secure** - don't share it publicly
3. **Use environment variables** for all sensitive credentials
4. **Admin-only endpoints** - image upload requires admin authentication
5. **File validation** - only image files are accepted (enforced by middleware)

## Support

- Cloudinary Documentation: https://cloudinary.com/documentation
- Cloudinary Support: https://support.cloudinary.com
- Wild Crunch Backend Docs: See `API_DOCUMENTATION.md`

---

**You're all set!** 🎉

Your Wild Crunch backend now supports cloud-based image uploads with automatic optimization and global CDN delivery.
