# ⚡ Quick Start Guide - Wild Crunch E-commerce

Get your e-commerce platform running in **5 minutes**!

---

## 📋 Prerequisites

✅ Node.js v16+ installed  
✅ npm installed  
✅ MongoDB Atlas account (create free at [mongodb.com](https://www.mongodb.com/cloud/atlas))

---

## 🚀 Setup Steps

### 1️⃣ Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
cd ..
```

---

### 2️⃣ MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create new cluster (FREE M0 tier)
4. Create database user:
   - Username: `wildcrunch`
   - Password: `yourpassword123` (choose your own)
5. Add IP: **Allow Access from Anywhere** (0.0.0.0/0)
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Add `/wildcrunch` after `.net/`

Example:
```
mongodb+srv://wildcrunch:yourpassword123@cluster0.xxxxx.mongodb.net/wildcrunch?retryWrites=true&w=majority
```

---

### 3️⃣ Configure Environment

**Backend** - Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://wildcrunch:yourpassword123@cluster0.xxxxx.mongodb.net/wildcrunch?retryWrites=true&w=majority
JWT_SECRET=my_super_secret_key_12345
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

**Frontend** - Create `.env` in root:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 4️⃣ Seed Database

```bash
cd backend
npm run seed
```

You should see: `✅ 19 products seeded successfully!`

---

### 5️⃣ Start Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

### 6️⃣ Open Browser

Visit: **http://localhost:5173**

---

## ✅ Test It Works

1. **Register Account:**
   - Click "Login" → "Sign Up"
   - Fill details and register

2. **Browse Products:**
   - Go to Products page
   - Should see 19 products

3. **Add to Cart:**
   - Click "Add to Cart" on any product
   - Cart icon should show count

4. **Create Order:**
   - Go to cart
   - Click checkout
   - Fill address
   - Place order

---

## 🎉 You're Done!

Your full-stack e-commerce platform is running!

---

## 📚 Next Steps

- **Full Setup:** See [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **API Docs:** See [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)
- **Overview:** See [README_ECOMMERCE.md](./README_ECOMMERCE.md)

---

## 🐛 Troubleshooting

**Backend won't start?**
- Check MongoDB connection string in `backend/.env`
- Verify IP is whitelisted in Atlas

**Frontend can't connect?**
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in `.env`
- Restart frontend after changing `.env`

**Need more help?**
- See full [SETUP_GUIDE.md](./SETUP_GUIDE.md#troubleshooting)

---

**Happy Coding! 🚀**
