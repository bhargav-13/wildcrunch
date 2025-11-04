# Product Image Guidelines for Wild Crunch Admin Panel

## Recommended Image Specifications

### Image Dimensions

**Optimal Resolution:**
- **Width:** 800px - 1200px
- **Height:** 800px - 1200px
- **Aspect Ratio:** 1:1 (Square) or close to square
- **Format:** PNG (recommended for transparent backgrounds) or JPG

### Category-Specific Guidelines

#### Regular Products (Makhana, Plain Makhana, Protein Puffs, Popcorn)
- **Recommended Size:** 1000px × 1000px
- **Min Size:** 800px × 800px
- **Max Size:** 2000px × 2000px
- **Background:** Transparent PNG preferred
- **File Size:** Under 1MB (Cloudinary will optimize)

**Best Practices:**
- Use transparent backgrounds (PNG)
- Center the product in the frame
- Leave some padding around the edges (10-15%)
- Ensure good lighting and clear product visibility

#### Combo Products
- **Recommended Size:** 1200px × 1000px
- **Min Size:** 1000px × 800px
- **Aspect Ratio:** Slightly wider (6:5 or 5:4)
- **Background:** Transparent PNG preferred

**Best Practices:**
- Arrange products side by side
- Ensure all items in combo are visible
- Maintain consistent lighting

### File Format Recommendations

1. **PNG (Preferred)**
   - Use for: Products with transparent backgrounds
   - Pros: No background, crisp edges, professional look
   - File Size: Larger, but Cloudinary compresses

2. **JPG (Alternative)**
   - Use for: Products with solid backgrounds
   - Pros: Smaller file sizes
   - Note: Will show background color

### Image Quality Checklist

✅ **Good Product Image:**
- Clear, high-resolution photo
- Product is centered
- Good lighting (no harsh shadows)
- Transparent or solid background
- No watermarks or text overlays
- Product fills 70-85% of frame
- Sharp focus on product

❌ **Avoid:**
- Blurry or pixelated images
- Images smaller than 800px
- Heavy shadows or poor lighting
- Multiple products in one image (unless combo)
- Text or logos on the product image
- Extreme aspect ratios (very wide or very tall)

## How Images Are Displayed

### Frontend Display Sizes

**Mobile (Small Screens):**
- Regular Products: 300px × 280px
- Combo Products: 200px × 220px

**Desktop (Large Screens):**
- Regular Products: 420px × 380px
- Combo Products: 250px × 280px

**CSS Handling:**
- `object-fit: contain` - Image scales to fit while maintaining aspect ratio
- No distortion or cropping
- Automatically handles different sizes
- Responsive across all devices

## Upload Process

### Admin Panel Steps

1. **Prepare Image:**
   - Resize to 1000px × 1000px (recommended)
   - Remove background if possible (use transparent PNG)
   - Ensure good lighting and clarity
   - Keep file under 5MB (system limit)

2. **Upload:**
   - Click "Add Product" in admin panel
   - Fill in product details
   - Click upload box in "Product Images" section
   - Select one or multiple images
   - Wait for upload confirmation

3. **Verify:**
   - Check uploaded image preview
   - First image will be the main display image
   - Additional images for product gallery (future feature)

### Multiple Images

- You can upload **unlimited images** per product
- **First image** = Main product image (shown on product listing)
- **Additional images** = Product gallery, detail views
- Reorder by dragging (if needed)
- Remove by clicking X on image preview

## Image Optimization

### Cloudinary Auto-Optimization

The system automatically:
- Compresses images for faster loading
- Converts to optimal format (WebP for modern browsers)
- Generates different sizes for responsive display
- Maintains image quality while reducing file size

### What You Don't Need To Do

❌ Don't manually compress images
❌ Don't create multiple size versions
❌ Don't worry about exact pixel dimensions
❌ Don't convert formats manually

### What You Should Do

✅ Use high-quality source images (1000px+)
✅ Use transparent backgrounds when possible
✅ Ensure good lighting and clarity
✅ Center the product in the frame
✅ Keep files under 5MB

## Examples

### Perfect Image Setup

**Product Name:** Peri Peri Makhana
- **Image 1 (Main):** Front view, transparent background, 1000×1000px
- **Image 2:** Side angle view, transparent background, 1000×1000px
- **Image 3:** Packaging back (nutrition info), 1000×1000px
- **Image 4:** Lifestyle shot (in use), 1200×1000px

### Minimum Acceptable Setup

**Product Name:** Salted Popcorn
- **Image 1 (Main):** Product photo, white background, 800×800px

## Troubleshooting

### Image Looks Stretched
- **Cause:** Extreme aspect ratio (e.g., 1000×300)
- **Fix:** Use closer to square ratio (1:1 or 4:5)

### Image Too Small
- **Cause:** Low resolution (under 500px)
- **Fix:** Upload higher resolution image (1000px+)

### Image Blurry
- **Cause:** Poor source quality or heavy compression
- **Fix:** Use original, uncompressed image

### Background Shows Through
- **Cause:** JPG with colored background instead of PNG
- **Fix:** Convert to PNG with transparent background

## Quick Reference

| Specification | Value |
|--------------|-------|
| **Optimal Size** | 1000px × 1000px |
| **Min Size** | 800px × 800px |
| **Max Size** | 2000px × 2000px |
| **Format** | PNG (transparent) or JPG |
| **File Size** | Under 5MB (under 1MB preferred) |
| **Aspect Ratio** | 1:1 (Square) |
| **Background** | Transparent (PNG) |
| **DPI** | 72 DPI (web standard) |

## Tools for Image Preparation

### Free Online Tools

1. **Remove Background:**
   - remove.bg
   - Adobe Express (free)
   - Canva background remover

2. **Resize Images:**
   - Squoosh.app
   - ResizeImage.net
   - Canva

3. **Image Editing:**
   - Photopea (free Photoshop alternative)
   - GIMP (desktop, free)
   - Canva (online, free tier)

---

**Need Help?**
Contact the development team if you encounter any issues with image uploads or display.

**Last Updated:** 2025
