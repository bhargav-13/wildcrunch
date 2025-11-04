# Wild Crunch Admin Panel - Installation Checklist

Complete this checklist to get your admin panel running.

## Pre-Installation ☐

- [ ] Node.js 18+ installed on your system
- [ ] Backend API is available and running
- [ ] MongoDB database is accessible
- [ ] Cloudinary account credentials available

## Installation Steps

### 1. Install Dependencies ☐

```bash
cd wildcrunch-admin
npm install
```

**Expected time**: 2-3 minutes

**Verify**: Check that `node_modules` folder is created

---

### 2. Environment Configuration ☐

File `.env.local` is already configured. Verify it contains:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=Root
CLOUDINARY_API_KEY=357564319159327
CLOUDINARY_API_SECRET=t192zZAslPpXGHLT6G0tPiKxUn0
```

- [ ] Environment file exists
- [ ] All variables are set

---

### 3. Backend Setup ☐

Ensure your backend is running:

```bash
cd ../backend
npm start
```

- [ ] Backend starts without errors
- [ ] Backend accessible at http://localhost:5000
- [ ] MongoDB connection successful

**Test**: Visit http://localhost:5000/api/products (should return products or empty array)

---

### 4. Create Admin User ☐

You need a user with admin role in MongoDB.

#### Option A: Update Existing User

Using MongoDB Compass or mongosh:

```javascript
use wildcrunch

db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

#### Option B: Create New Admin User

1. Register via your frontend/API
2. Then update role in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@wildcrunch.com" },
  { $set: { role: "admin" } }
)
```

- [ ] Admin user created
- [ ] User has `role: "admin"` in database
- [ ] You know the login credentials

---

### 5. Cloudinary Upload Preset ☐

Create an unsigned upload preset for image uploads:

1. Login to [Cloudinary Console](https://cloudinary.com/console)
2. Go to **Settings** → **Upload**
3. Scroll to **Upload Presets**
4. Click **Add upload preset**
5. Fill in:
   - **Preset name**: `wildcrunch`
   - **Signing mode**: Unsigned
   - **Folder**: `wildcrunch-products`
6. Click **Save**

- [ ] Upload preset created
- [ ] Preset name is exactly `wildcrunch`
- [ ] Signing mode is "Unsigned"
- [ ] Folder is set to `wildcrunch-products`

---

### 6. Start Admin Panel ☐

```bash
cd wildcrunch-admin
npm run dev
```

- [ ] Server starts without errors
- [ ] Admin panel accessible at http://localhost:3001
- [ ] No console errors in terminal

---

### 7. First Login ☐

1. Open http://localhost:3001
2. You should see the login page
3. Enter your admin credentials
4. Click "Sign In"

- [ ] Login page loads correctly
- [ ] Can enter email and password
- [ ] Login successful
- [ ] Redirected to dashboard

---

### 8. Test Dashboard ☐

After logging in, verify:

- [ ] Dashboard loads successfully
- [ ] Statistics cards show numbers (may be 0 if no data)
- [ ] No errors in browser console
- [ ] Sidebar navigation visible
- [ ] User name appears in sidebar

---

### 9. Test Product Management ☐

Go to Products page:

1. Click "Products" in sidebar
2. Try creating a new product:
   - Click "Add Product"
   - Fill in all required fields
   - Upload at least one image
   - Click "Create Product"

- [ ] Products page loads
- [ ] Can click "Add Product"
- [ ] Modal opens correctly
- [ ] Image upload works
- [ ] Product created successfully
- [ ] New product appears in list

---

### 10. Test Order Management ☐

1. Click "Orders" in sidebar
2. Orders page loads
3. If you have orders, they should appear

- [ ] Orders page loads
- [ ] Can view order list
- [ ] Can click on an order to view details
- [ ] Order details modal opens

---

### 11. Test Other Pages ☐

Verify all pages work:

- [ ] Customers page loads
- [ ] Categories page loads
- [ ] Can navigate between pages
- [ ] Logout works

---

## Troubleshooting

### Issue: Cannot install dependencies

**Error**: `npm install` fails

**Solution**:
```bash
# Clear cache and try again
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: Cannot login

**Error**: "Access denied. Admin privileges required"

**Solution**:
1. Check user exists in database
2. Verify user has `role: "admin"`
3. Check email/password are correct

**Verify in MongoDB**:
```javascript
db.users.findOne({ email: "your-email@example.com" })
// Should show role: "admin"
```

---

### Issue: API connection fails

**Error**: Network errors, "Failed to fetch"

**Solution**:
1. Check backend is running on port 5000
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check CORS settings in backend
4. Try accessing API directly: http://localhost:5000/api/products

**Backend CORS should include**:
```javascript
const corsOptions = {
  origin: ['http://localhost:3001', 'http://localhost:8080'],
  credentials: true,
};
```

---

### Issue: Image upload fails

**Error**: "Failed to upload image to Cloudinary"

**Solution**:
1. Verify upload preset exists in Cloudinary
2. Check preset name is exactly `wildcrunch`
3. Ensure preset is "Unsigned"
4. Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is correct

**Test Cloudinary**:
```javascript
// Should be: Root
console.log(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
```

---

### Issue: Page not found errors

**Error**: 404 on dashboard routes

**Solution**:
1. Ensure you're using correct URL: http://localhost:3001
2. Check Next.js dev server is running
3. Look for errors in terminal where `npm run dev` is running

---

### Issue: Build fails

**Error**: TypeScript errors during build

**Solution**:
```bash
# Check for type errors
npm run build

# If errors, check the specific files mentioned
# Most common: missing dependencies
npm install
```

---

## Production Deployment Checklist ☐

Once local installation works, you can deploy:

- [ ] Backend deployed to Render/Railway
- [ ] Admin panel code pushed to GitHub
- [ ] Environment variables configured for production
- [ ] Cloudinary upload preset exists
- [ ] Admin user exists in production database
- [ ] CORS configured for production URLs
- [ ] Deployed to Vercel/Render
- [ ] Tested login on production
- [ ] Tested product creation on production
- [ ] Custom domain configured (optional)

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

---

## Final Verification ☐

Everything should work if you can:

- [ ] ✅ Login successfully
- [ ] ✅ See dashboard with statistics
- [ ] ✅ Create a new product with image
- [ ] ✅ View products list
- [ ] ✅ Edit a product
- [ ] ✅ View orders (if any exist)
- [ ] ✅ View customers
- [ ] ✅ View categories
- [ ] ✅ Navigate between pages smoothly
- [ ] ✅ Logout and login again

---

## Success! 🎉

If all checkboxes are checked, your Wild Crunch Admin Panel is fully installed and working!

### Next Steps:

1. **Customize**: Update branding, colors, logo
2. **Add Data**: Create products, process orders
3. **Deploy**: Follow DEPLOYMENT_GUIDE.md to go live
4. **Share**: Give access to team members

### Need Help?

- Check `README.md` for detailed documentation
- Review `QUICK_START.md` for quick reference
- Check browser console for error messages
- Check terminal for server errors
- Verify all environment variables are set

---

**Installation completed on**: ________________

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________
