# 🛍️ Wild Crunch - Full Stack E-commerce Platform

A complete, production-ready e-commerce platform for Wild Crunch snacks with React frontend and Node.js + MongoDB backend.

![MongoDB](https://img.shields.io/badge/MongoDB-FREE_Tier-green)
![Node.js](https://img.shields.io/badge/Node.js-v16+-blue)
![React](https://img.shields.io/badge/React-18.3-blue)
![Express](https://img.shields.io/badge/Express-4.18-lightgrey)

---

## ✨ Features

### 🎨 Frontend
- **Modern React 18** with TypeScript
- **Beautiful UI** with shadcn/ui components and TailwindCSS
- **Responsive Design** - Works on all devices
- **Smooth Animations** with Framer Motion
- **Product Catalog** with filtering and search
- **Shopping Cart** with real-time updates
- **Wishlist** functionality
- **User Authentication** with JWT
- **Order Management** and tracking
- **User Profile** with address management

### 🔧 Backend
- **RESTful API** with Express.js
- **MongoDB Database** (Free Atlas tier)
- **JWT Authentication** with secure password hashing
- **Complete CRUD operations** for all entities
- **Role-based access** (User/Admin)
- **Order processing** with inventory management
- **Input validation** and error handling
- **CORS enabled** for frontend communication

### 📦 Key Functionalities

✅ User registration and login  
✅ Browse products by category  
✅ Search products  
✅ Add to cart/wishlist  
✅ Manage cart quantities  
✅ Multiple shipping addresses  
✅ Place orders with COD/Online payment  
✅ Order tracking  
✅ Profile management  
✅ Admin panel capabilities  
✅ Stock management  
✅ Real-time price calculations  

---

## 🏗️ Tech Stack

### Frontend
- **React 18.3** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router 6** - Navigation
- **Axios** - HTTP client
- **shadcn/ui** - Component library
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **React Hook Form** - Form handling
- **Zod** - Validation

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database (Atlas Free Tier)
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

---

## 📁 Project Structure

```
Wild-Crunch-main/
├── backend/                    # Node.js Backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   └── errorHandler.js   # Error handling
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Product.js         # Product schema
│   │   ├── Cart.js            # Cart schema
│   │   ├── Wishlist.js        # Wishlist schema
│   │   └── Order.js           # Order schema
│   ├── routes/
│   │   ├── auth.js            # Auth endpoints
│   │   ├── products.js        # Product endpoints
│   │   ├── cart.js            # Cart endpoints
│   │   ├── wishlist.js        # Wishlist endpoints
│   │   └── orders.js          # Order endpoints
│   ├── scripts/
│   │   └── seedProducts.js    # Database seeding
│   ├── utils/
│   │   └── generateToken.js   # JWT utilities
│   ├── .env.example           # Environment template
│   ├── .gitignore
│   ├── package.json
│   ├── server.js              # Main server file
│   ├── README.md              # Backend docs
│   └── API_DOCUMENTATION.md   # API reference
│
├── src/                        # React Frontend
│   ├── components/            # UI components
│   ├── contexts/
│   │   └── AuthContext.tsx    # Authentication context
│   ├── hooks/
│   │   ├── useCart.ts         # Cart hook
│   │   ├── useWishlist.ts     # Wishlist hook
│   │   └── useProducts.ts     # Products hook
│   ├── pages/                 # Route pages
│   ├── services/
│   │   └── api.ts             # API service layer
│   ├── data/
│   │   └── product.ts         # Product types
│   └── main.tsx               # App entry point
│
├── .env.example               # Frontend env template
├── package.json               # Frontend dependencies
├── SETUP_GUIDE.md            # Detailed setup guide
├── README_ECOMMERCE.md       # This file
└── vite.config.ts            # Vite configuration
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm or yarn
- MongoDB Atlas account (free)

### Installation

**1. Clone the repository**
```bash
git clone <your-repo-url>
cd Wild-Crunch-main
```

**2. Install dependencies**

Frontend:
```bash
npm install
```

Backend:
```bash
cd backend
npm install
```

**3. Setup MongoDB Atlas**
- Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster (free M0 tier)
- Get connection string
- See detailed guide in `SETUP_GUIDE.md`

**4. Configure Environment Variables**

Backend (.env in `backend/` folder):
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wildcrunch
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

Frontend (.env in root folder):
```env
VITE_API_URL=http://localhost:5000/api
```

**5. Seed Database**
```bash
cd backend
npm run seed
```

**6. Run the Application**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
npm run dev
```

Open browser: `http://localhost:5173`

📖 **For detailed step-by-step instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)**

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/address` - Add address

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories/list` - Get categories

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:productId` - Update quantity
- `DELETE /api/cart/remove/:productId` - Remove item

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist/toggle/:productId` - Toggle item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order

📚 **Full API Documentation:** [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)

---

## 💾 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (user/admin),
  addresses: [Address],
  createdAt: Date
}
```

### Product
```javascript
{
  id: String (unique),
  name: String,
  price: String,
  priceNumeric: Number,
  category: String,
  weight: String,
  imageSrc: String,
  description: String,
  inStock: Boolean,
  stockQuantity: Number,
  ratings: { average, count }
}
```

### Cart
```javascript
{
  user: ObjectId,
  items: [{ product, quantity, price }],
  totalItems: Number,
  totalPrice: Number
}
```

### Order
```javascript
{
  user: ObjectId,
  orderNumber: String (auto-generated),
  items: [OrderItem],
  shippingAddress: Address,
  paymentMethod: String,
  paymentStatus: String,
  orderStatus: String,
  totalPrice: Number,
  createdAt: Date
}
```

---

## 🔐 Authentication Flow

1. User registers or logs in
2. Backend validates credentials
3. JWT token generated and returned
4. Frontend stores token in localStorage
5. Token included in subsequent API requests
6. Backend verifies token for protected routes
7. Token expires after 7 days (configurable)

---

## 🛒 Shopping Flow

1. **Browse Products** - User views product catalog
2. **Add to Cart** - Items added with quantity
3. **Review Cart** - Update quantities or remove items
4. **Checkout** - Select/add shipping address
5. **Payment** - Choose payment method (COD/Online)
6. **Order Creation** - Order saved to database
7. **Stock Update** - Product inventory reduced
8. **Cart Cleared** - User cart emptied
9. **Order Confirmation** - Order number generated
10. **Track Order** - User can view order status

---

## 🧪 Testing

### Manual Testing

**Test User Registration:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```

**Test Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

**Test Products:**
```bash
curl http://localhost:5000/api/products
```

### Using the Frontend

1. Open `http://localhost:5173`
2. Register a new account
3. Browse products
4. Add items to cart
5. Update cart quantities
6. Add to wishlist
7. Proceed to checkout
8. Create an order
9. View order history

---

## 🔧 Configuration

### Backend Environment Variables

```env
PORT=5000                           # Server port
NODE_ENV=development                # Environment
MONGODB_URI=mongodb+srv://...       # MongoDB connection
JWT_SECRET=random_secret            # JWT signing key
JWT_EXPIRE=7d                       # Token expiration
FRONTEND_URL=http://localhost:5173  # CORS origin
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000/api  # Backend API URL
```

---

## 📦 Deployment

### Backend Deployment (Railway/Render)

1. Push code to GitHub
2. Create account on Railway/Render
3. Create new project from GitHub
4. Add environment variables
5. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Push code to GitHub
2. Import project to Vercel/Netlify
3. Set build command: `npm run build`
4. Set environment variables
5. Deploy

### MongoDB Atlas

- Already cloud-hosted
- Free tier sufficient for development
- Upgrade for production

---

## 🐛 Common Issues & Solutions

### Backend won't start
- Check MongoDB connection string
- Verify all environment variables
- Ensure port 5000 is available

### Frontend API errors
- Verify backend is running
- Check VITE_API_URL in .env
- Restart dev server after .env changes

### MongoDB connection failed
- Check IP whitelist in Atlas
- Verify username/password
- Ensure cluster is deployed

### CORS errors
- Check FRONTEND_URL in backend .env
- Restart backend server
- Clear browser cache

📖 **More troubleshooting:** [SETUP_GUIDE.md](./SETUP_GUIDE.md#troubleshooting)

---

## 🎯 Future Enhancements

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Product reviews and ratings
- [ ] Advanced search and filters
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Order analytics
- [ ] Coupon/discount system
- [ ] Product recommendations
- [ ] Image upload for products
- [ ] Multi-language support

---

## 📝 Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
npm start            # Start server (production)
npm run dev          # Start with nodemon (development)
npm run seed         # Seed database with products
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📚 Documentation

- **Setup Guide:** [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Step-by-step setup
- **Backend README:** [backend/README.md](./backend/README.md) - Backend overview
- **API Docs:** [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) - Complete API reference

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- React & Vite teams
- shadcn/ui for beautiful components
- MongoDB Atlas for free database hosting
- Express.js community

---

## 📞 Support

- Create an issue for bugs
- Start a discussion for questions
- Check documentation first

---

**Built with ❤️ for Wild Crunch**

**Happy Coding! 🚀**
