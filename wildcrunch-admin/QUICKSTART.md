# Quick Start Guide - Wild Crunch Admin Panel

Get up and running in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd wildcrunch-admin
npm install
```

### 2. Configure Environment

Create `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=wildcrunch@admin123
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Access Admin Panel

Open http://localhost:3000 in your browser

**Login with:**
- Username: `admin`
- Password: `wildcrunch@admin123`

## ✅ What You Can Do

### Product Management
- ➕ Add new products
- ✏️ Edit existing products
- 🗑️ Delete products
- 🖼️ Manage product images
- 📦 Track inventory

### Coupon Management
- 🎟️ Create discount coupons
- 💰 Set percentage or fixed discounts
- 📅 Set validity periods
- 🔄 Toggle active/inactive status
- 📊 Track usage

### Dashboard
- 📈 View statistics
- 🔍 Quick access to features
- 💡 System information

## 📝 Important Notes

1. **Backend Required**: Make sure your backend API is running on port 5000
2. **CORS**: Backend must allow requests from http://localhost:3000
3. **Change Password**: Update credentials before deploying to production!

## 🚢 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Follow prompts and add environment variables when asked.

## 📚 Full Documentation

- [SETUP.md](./SETUP.md) - Complete setup guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment instructions
- [README.md](./README.md) - Project overview

## 🆘 Need Help?

**API not connecting?**
- Check if backend is running
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`

**Login not working?**
- Check credentials in `.env.local`
- Clear browser cache/localStorage

**Build errors?**
- Delete `node_modules` and `.next`
- Run `npm install` again

## 🎯 Next Steps

1. Customize admin credentials
2. Add your products
3. Create discount coupons
4. Deploy to Vercel
5. Configure custom domain (optional)

Happy managing! 🎉
