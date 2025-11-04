# Wild Crunch Admin Panel - Deployment Guide

Complete guide for deploying the Wild Crunch Admin Panel to Vercel and Render.

## Prerequisites

Before deploying, ensure you have:

1. ✅ A GitHub/GitLab account with your code pushed
2. ✅ Backend API deployed and accessible
3. ✅ Cloudinary account configured
4. ✅ MongoDB database URL
5. ✅ Admin user created in database with role: "admin"

---

## Option 1: Deploy to Vercel (Recommended)

Vercel is optimized for Next.js applications and offers the best performance.

### Step 1: Prepare for Deployment

1. **Update Production Environment**:

   Edit `.env.production` file:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=Root
   CLOUDINARY_API_KEY=357564319159327
   CLOUDINARY_API_SECRET=t192zZAslPpXGHLT6G0tPiKxUn0
   ```

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

### Step 2: Deploy on Vercel

1. **Go to [Vercel](https://vercel.com)**

2. **Sign in** with your GitHub account

3. **Click "Add New Project"**

4. **Import your repository**:
   - Select your `wildcrunch-admin` repository
   - Click "Import"

5. **Configure Project**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (or specify if admin is in subdirectory)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

6. **Add Environment Variables**:

   Click "Environment Variables" and add:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_API_URL` | `https://your-backend.onrender.com/api` |
   | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `Root` |
   | `CLOUDINARY_API_KEY` | `357564319159327` |
   | `CLOUDINARY_API_SECRET` | `t192zZAslPpXGHLT6G0tPiKxUn0` |

7. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Your admin panel will be live at: `https://your-project.vercel.app`

### Step 3: Custom Domain (Optional)

1. Go to your project settings
2. Click "Domains"
3. Add your custom domain: `admin.wildcrunch.com`
4. Follow DNS configuration instructions

---

## Option 2: Deploy to Render

Render is a good alternative with free tier available.

### Step 1: Prepare for Deployment

1. **Ensure `render.yaml` exists** (already created)

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

### Step 2: Deploy on Render

1. **Go to [Render](https://render.com)**

2. **Sign in** with your GitHub account

3. **Click "New +" → "Web Service"**

4. **Connect Repository**:
   - Select your `wildcrunch-admin` repository
   - Click "Connect"

5. **Configure Service**:
   - Name: `wildcrunch-admin`
   - Region: **Singapore** (or closest to your users)
   - Branch: `main`
   - Root Directory: `./` (or specify path)
   - Runtime: **Node**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Instance Type: **Free** (or paid for better performance)

6. **Add Environment Variables**:

   Click "Environment" → "Add Environment Variable":

   ```env
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=Root
   CLOUDINARY_API_KEY=357564319159327
   CLOUDINARY_API_SECRET=t192zZAslPpXGHLT6G0tPiKxUn0
   ```

7. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes for first deploy)
   - Your admin panel will be live at: `https://wildcrunch-admin.onrender.com`

### Step 3: Custom Domain on Render

1. Go to your service settings
2. Click "Custom Domain"
3. Add: `admin.wildcrunch.com`
4. Configure DNS records as instructed

---

## Backend Deployment (If Not Already Done)

### Deploy Backend to Render

1. **Create New Web Service** for backend

2. **Configure**:
   - Name: `wildcrunch-backend`
   - Runtime: **Node**
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://bhargavcodelix_db_user:if9uZlc9aT072m15@wildcrunch.ojbmcp5.mongodb.net/wildcrunch?retryWrites=true&w=majority
   JWT_SECRET=WildCrunch2024_SecureKey_opb030406_RandomString_bhargavcodelix_XyZ123!@#
   JWT_EXPIRE=7d
   FRONTEND_URL=https://your-frontend.vercel.app
   RAZORPAY_KEY_ID=rzp_test_RXdR3zic3uXGS2
   RAZORPAY_KEY_SECRET=wmZcTKWykMLfyJCPYi7lCtXT
   CLOUDINARY_CLOUD_NAME=Root
   CLOUDINARY_API_KEY=357564319159327
   CLOUDINARY_API_SECRET=t192zZAslPpXGHLT6G0tPiKxUn0
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_EMAIL=bhargav.codelix@gmail.com
   SMTP_PASSWORD=paic azbe zlzx lgvy
   ADMIN_EMAIL=wildcrunch@gmail.com
   ```

4. **Deploy**

5. **Note the URL**: `https://wildcrunch-backend.onrender.com`

---

## Cloudinary Configuration

### Create Upload Preset

1. **Login to [Cloudinary](https://cloudinary.com)**

2. **Go to Settings** → **Upload**

3. **Click "Add upload preset"**

4. **Configure**:
   - Preset name: `wildcrunch`
   - Signing mode: **Unsigned**
   - Folder: `wildcrunch-products`
   - Use filename: **Yes**

5. **Save**

---

## Database Setup

### Create Admin User

Connect to MongoDB and run:

```javascript
db.users.insertOne({
  name: "Admin",
  email: "admin@wildcrunch.com",
  password: "$2a$10$hashedPasswordHere", // Hash using bcrypt
  role: "admin",
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or use your backend's register endpoint and manually update the role in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@wildcrunch.com" },
  { $set: { role: "admin" } }
)
```

---

## Post-Deployment Checklist

### 1. Update CORS in Backend

In your backend `server.js`, ensure CORS allows your admin panel URL:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:8080',
    'http://localhost:3001',
    'https://your-admin.vercel.app',
    'https://wildcrunch-admin.onrender.com',
  ],
  credentials: true,
};

app.use(cors(corsOptions));
```

### 2. Test Admin Login

1. Go to your deployed admin panel
2. Try logging in with admin credentials
3. Verify dashboard loads

### 3. Test Product Upload

1. Go to Products page
2. Click "Add Product"
3. Upload an image
4. Verify it uploads to Cloudinary
5. Create the product

### 4. Test Order Management

1. Create a test order from frontend
2. Check if it appears in admin panel
3. Try updating order status

---

## Environment Variables Summary

### For Admin Panel

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.wildcrunch.com/api` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `Root` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `357564319159327` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `t192zZ...` |

---

## Troubleshooting

### Build Fails on Vercel/Render

**Error**: Module not found
- **Solution**: Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error**: Environment variable not found
- **Solution**: Check all required env vars are added in deployment platform

### API Connection Issues

**Error**: CORS error in browser console
- **Solution**: Update backend CORS to include admin panel URL

**Error**: Failed to fetch
- **Solution**:
  - Check `NEXT_PUBLIC_API_URL` is correct
  - Ensure backend is running
  - Check network tab for exact error

### Image Upload Fails

**Error**: Cloudinary upload failed
- **Solution**:
  - Verify upload preset `wildcrunch` exists
  - Check preset is "Unsigned"
  - Verify cloud name is correct

### Login Issues

**Error**: Access denied / Not admin
- **Solution**: Check user role in database is "admin"

**Error**: Invalid credentials
- **Solution**: Verify admin user exists with correct password

---

## Production Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret
- [ ] Enable HTTPS only
- [ ] Set secure cookie options
- [ ] Add rate limiting on backend
- [ ] Enable CORS only for specific domains
- [ ] Use environment variables for all secrets
- [ ] Regular security updates
- [ ] Monitor error logs

---

## Monitoring & Maintenance

### Vercel

- Check deployment logs in Vercel dashboard
- Set up error tracking (Sentry recommended)
- Monitor usage and performance

### Render

- Check logs in Render dashboard
- Set up health checks
- Monitor instance metrics

---

## Scaling Considerations

### Performance Optimization

1. **Enable CDN** for static assets
2. **Optimize images** before upload
3. **Add caching** for API responses
4. **Use SWR** for data fetching (future improvement)

### Upgrade Plans

- **Vercel Pro**: For better performance and analytics
- **Render Standard**: For zero-downtime deploys

---

## Support

If you encounter issues:

1. Check deployment logs
2. Verify environment variables
3. Test API endpoints directly
4. Check browser console for errors

For backend issues, verify:
- Database connection
- API endpoints are accessible
- CORS is configured correctly

---

## Quick Links

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Cloudinary Docs](https://cloudinary.com/documentation)

---

**Congratulations!** Your Wild Crunch Admin Panel is now deployed and ready to use! 🎉
