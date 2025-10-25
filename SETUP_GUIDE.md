# 🚀 Wild Crunch - Complete Setup Guide

This guide will walk you through setting up the **complete e-commerce system** with MongoDB backend step by step.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [MongoDB Atlas Setup (Free)](#mongodb-atlas-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Running the Application](#running-the-application)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager (comes with Node.js)
- **Git** (optional, for version control)
- A modern web browser

Check your Node.js version:
```bash
node --version
npm --version
```

---

## 🗄️ MongoDB Atlas Setup

MongoDB Atlas offers a **FREE tier** perfect for development and small projects.

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"** or **"Sign Up"**
3. Create an account using email or Google/GitHub

### Step 2: Create a Cluster

1. After login, click **"Build a Database"**
2. Select **FREE (Shared)** tier - M0 Sandbox
3. Choose a cloud provider (AWS, Google Cloud, or Azure)
4. Select a region **closest to you** (e.g., Mumbai for India)
5. Keep cluster name as default or customize it
6. Click **"Create Cluster"** (takes 3-5 minutes)

### Step 3: Configure Database Access

1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Create username and **strong password** (save these!)
5. Under "Database User Privileges", select **"Read and write to any database"**
6. Click **"Add User"**

### Step 4: Configure Network Access

1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. For development: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ For production, whitelist specific IPs
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Go back to **"Database"** (Clusters view)
2. Click **"Connect"** button on your cluster
3. Select **"Connect your application"**
4. Choose **"Node.js"** as driver
5. Copy the connection string (looks like):
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Important**: Replace `<password>` with your actual database user password
7. Add database name after `.net/`: 
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/wildcrunch?retryWrites=true&w=majority
   ```

---

## 🔧 Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv
- and more...

### Step 3: Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# For Windows (PowerShell)
Copy-Item .env.example .env

# Or manually create and edit .env
```

Edit `.env` file with your values:

```env
PORT=5000
NODE_ENV=development

# Paste your MongoDB Atlas connection string here
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/wildcrunch?retryWrites=true&w=majority

# Generate a random secret (or use any long random string)
JWT_SECRET=your_super_secret_random_string_here_make_it_long_and_complex

JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:5173
```

**How to generate a secure JWT_SECRET:**

```bash
# On Windows PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})

# Or use any random string generator online
```

### Step 4: Seed Database with Products

This will populate your MongoDB database with all products:

```bash
npm run seed
```

You should see:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
✅ 19 products seeded successfully!
```

### Step 5: Start Backend Server

**Development mode (recommended):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
🚀 Server running in development mode
📡 Listening on port 5000
🌐 API URL: http://localhost:5000
💚 Health check: http://localhost:5000/api/health
MongoDB Connected: cluster0.xxxxx.mongodb.net
```

**Test the backend:**

Open browser and visit: `http://localhost:5000/api/health`

You should see:
```json
{
  "success": true,
  "message": "Wild Crunch API is running",
  "timestamp": "2024-..."
}
```

✅ **Backend is now running!**

---

## 🎨 Frontend Setup

### Step 1: Navigate to Project Root

```bash
# If you're in backend folder, go back
cd ..
```

### Step 2: Install Frontend Dependencies

```bash
npm install
```

This will install all React, Vite, and UI dependencies including the newly added `axios`.

### Step 3: Configure Frontend Environment

Create `.env` file in the **root directory** (not in backend):

```bash
Copy-Item .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Start Frontend

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Frontend is now running!**

---

## 🎉 Running the Application

You need **TWO terminal windows**:

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

### Terminal 2: Frontend
```bash
npm run dev
```

Now open your browser and visit: **http://localhost:5173**

---

## ✅ Testing the Complete System

### 1. Test Product Listing

- Go to **Products** page
- You should see all 19 products loaded from MongoDB

### 2. Test User Registration

- Click **Login** (top right)
- Click **Sign Up** or Register
- Fill in details:
  - Name: Test User
  - Email: test@example.com
  - Password: test123
- Click Register
- You should be logged in automatically

### 3. Test Shopping Cart

- Browse products
- Click **"Add to Cart"** on any product
- Check cart icon (should show count)
- Go to **Cart** page
- Try updating quantities
- Try removing items

### 4. Test Wishlist

- Click heart icon on any product
- Go to **Wishlist** page
- Should see saved products
- Try removing from wishlist

### 5. Test Order Creation

- Add items to cart
- Go to cart
- Click **"Proceed to Checkout"**
- Fill in shipping address
- Select payment method
- Create order
- Check order confirmation

### 6. Test User Profile

- Go to **Profile** page
- View your details
- Update profile information
- Add/edit addresses

---

## 🔍 Verify Database

### Check MongoDB Atlas

1. Go to MongoDB Atlas
2. Click **"Browse Collections"**
3. You should see database: **wildcrunch**
4. Collections:
   - `users` - Your registered users
   - `products` - 19 products
   - `carts` - User shopping carts
   - `wishlists` - User wishlists
   - `orders` - Created orders

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: MongoDB Connection Failed**
```
Error: MongoServerError: bad auth
```
**Solution:** 
- Check username/password in connection string
- Ensure password is URL-encoded (replace special characters)
- Verify database user was created in Atlas

**Problem: Port 5000 already in use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
- Change PORT in backend/.env to 5001
- Update frontend VITE_API_URL to http://localhost:5001/api

**Problem: Seed script fails**
```
Connection refused
```
**Solution:**
- Check MONGODB_URI in .env
- Ensure IP address is whitelisted in Atlas
- Wait for cluster to finish deploying

### Frontend Issues

**Problem: API calls fail (Network Error)**
```
Network Error
```
**Solution:**
- Ensure backend is running
- Check VITE_API_URL in .env
- Restart frontend dev server after changing .env

**Problem: CORS errors**
```
Access-Control-Allow-Origin error
```
**Solution:**
- Backend CORS is configured
- Ensure FRONTEND_URL in backend/.env matches frontend URL
- Restart backend server

**Problem: "Cannot find module 'axios'"**
```
Cannot find module 'axios'
```
**Solution:**
```bash
npm install axios
```

### General Issues

**Problem: Changes not reflecting**
- Hard reload browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Restart dev servers

**Problem: Login not working**
- Check browser console for errors
- Verify backend is running
- Check Network tab in DevTools

---

## 📚 API Endpoints Reference

Quick reference for testing with tools like Postman:

**Base URL:** `http://localhost:5000/api`

### Authentication
- POST `/auth/register` - Register user
- POST `/auth/login` - Login
- GET `/auth/profile` - Get profile (requires auth)

### Products
- GET `/products` - Get all products
- GET `/products/:id` - Get single product

### Cart
- GET `/cart` - Get cart (requires auth)
- POST `/cart/add` - Add to cart (requires auth)
- PUT `/cart/update/:productId` - Update quantity (requires auth)
- DELETE `/cart/remove/:productId` - Remove item (requires auth)

### Wishlist
- GET `/wishlist` - Get wishlist (requires auth)
- POST `/wishlist/toggle/:productId` - Toggle item (requires auth)

### Orders
- POST `/orders` - Create order (requires auth)
- GET `/orders` - Get user orders (requires auth)
- GET `/orders/:id` - Get order details (requires auth)

For detailed API documentation, see `backend/API_DOCUMENTATION.md`

---

## 🎯 Next Steps

After successful setup:

1. **Explore the code** - Understand how frontend and backend connect
2. **Customize** - Modify products, add features
3. **Deploy** - Deploy to production (Vercel, Netlify, Railway, etc.)
4. **Add features** - Payment gateway, reviews, search, etc.

---

## 📖 Additional Resources

- **Backend README:** `backend/README.md`
- **API Documentation:** `backend/API_DOCUMENTATION.md`
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/
- **Express.js Guide:** https://expressjs.com/

---

## 🤝 Need Help?

If you encounter any issues:

1. Check the error message carefully
2. Review this guide
3. Check troubleshooting section
4. Verify all environment variables
5. Create an issue in the repository

---

## 📄 License

MIT License - Feel free to use for learning and commercial projects!

---

**Congratulations! 🎉 Your Wild Crunch e-commerce platform is now running with a complete MongoDB backend!**
