# Wild Crunch Admin Panel - Quick Start Guide

Get your admin panel up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd wildcrunch-admin
npm install
```

This will install all required packages (~2 minutes).

## Step 2: Configure Environment

The `.env.local` file is already configured with your MongoDB and Cloudinary credentials:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=Root
CLOUDINARY_API_KEY=357564319159327
CLOUDINARY_API_SECRET=t192zZAslPpXGHLT6G0tPiKxUn0
ADMIN_EMAIL=admin@wildcrunch.com
ADMIN_PASSWORD=admin123
```

No changes needed for local development!

## Step 3: Start the Backend

Make sure your backend is running:

```bash
cd ../backend
npm start
```

Backend should be running on: `http://localhost:5000`

## Step 4: Start Admin Panel

```bash
cd ../wildcrunch-admin
npm run dev
```

Admin panel will start on: `http://localhost:3001`

## Step 5: Create Admin User

You need an admin user in your database. Two options:

### Option A: Using MongoDB Compass

1. Open MongoDB Compass
2. Connect to: `mongodb+srv://bhargavcodelix_db_user:if9uZlc9aT072m15@wildcrunch.ojbmcp5.mongodb.net/wildcrunch`
3. Go to `users` collection
4. Find any user or create new one
5. Edit the document and set: `role: "admin"`

### Option B: Using Backend API

1. Register a new user through your frontend/API
2. Then update in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "admin@wildcrunch.com" },
     { $set: { role: "admin" } }
   )
   ```

## Step 6: Login to Admin Panel

1. Open: `http://localhost:3001`
2. You'll be redirected to login page
3. Login with your admin user credentials

Default test credentials (if you created this user):
- Email: `admin@wildcrunch.com`
- Password: `admin123`

## Step 7: Set Up Cloudinary Upload Preset

For image uploads to work:

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Login with account that has cloud name: **Root**
3. Settings → Upload → Upload Presets
4. Click "Add upload preset"
5. Configure:
   - Preset name: `wildcrunch`
   - Signing mode: **Unsigned**
   - Folder: `wildcrunch-products`
6. Save

## You're Ready! 🎉

Now you can:

- ✅ View dashboard analytics
- ✅ Add/edit/delete products
- ✅ Manage orders and update status
- ✅ View customers
- ✅ Track categories

## Common Issues

### Cannot login

**Issue**: "Access denied. Admin privileges required"

**Solution**: Make sure your user has `role: "admin"` in database

### API connection failed

**Issue**: Network errors in browser console

**Solution**:
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

### Image upload fails

**Issue**: Cloudinary upload error

**Solution**:
- Create upload preset "wildcrunch" (see Step 7)
- Make sure it's "Unsigned"
- Verify cloud name is "Root"

## Next Steps

1. **Add Products**: Go to Products → Add Product
2. **Test Orders**: Create an order from frontend, view in admin
3. **Customize**: Update colors, logo, etc. in the code
4. **Deploy**: See `DEPLOYMENT_GUIDE.md` when ready

## File Structure

```
wildcrunch-admin/
├── src/
│   ├── app/              # Pages
│   ├── components/       # UI components
│   ├── lib/             # API & utilities
│   └── store/           # State management
├── .env.local           # Environment variables
└── package.json         # Dependencies
```

## Useful Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Check code quality
```

## Getting Help

- Check browser console for errors
- Check backend logs
- Read full README.md
- Check DEPLOYMENT_GUIDE.md for production

---

Happy managing! 🚀
