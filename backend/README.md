# Wild Crunch E-commerce Backend

Complete Node.js + Express + MongoDB backend for Wild Crunch e-commerce platform.

## 🚀 Features

- **Authentication & Authorization** - JWT-based auth with user roles
- **Product Management** - Full CRUD operations for products
- **Shopping Cart** - Add, update, remove items from cart
- **Wishlist** - Save favorite products
- **Order Management** - Create and track orders
- **User Profiles** - Manage user information and addresses
- **Admin Panel** - Admin-only routes for management

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (free tier available)
- npm or yarn

## 🛠️ Installation

### 1. Navigate to backend directory

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up MongoDB Atlas (Free Tier)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (select FREE tier - M0)
4. Click "Connect" on your cluster
5. Whitelist your IP address (or use 0.0.0.0/0 for all IPs during development)
6. Create a database user with username and password
7. Choose "Connect your application"
8. Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`)

### 4. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` and update these values:

```env
PORT=5000
NODE_ENV=development

# Replace with your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/wildcrunch?retryWrites=true&w=majority

# Generate a secure random string for JWT secret
JWT_SECRET=your_super_secret_random_string_here
JWT_EXPIRE=7d

# Your frontend URL
FRONTEND_URL=http://localhost:5173
```

**Important:** 
- Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your MongoDB Atlas credentials
- Replace the `cluster0.xxxxx.mongodb.net` part with your actual cluster URL
- Generate a strong random string for `JWT_SECRET`

### 5. Seed the Database with Products

```bash
npm run seed
```

This will populate your MongoDB database with all the products from your frontend.

### 6. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| GET | `/profile` | Get user profile | Yes |
| PUT | `/profile` | Update profile | Yes |
| POST | `/address` | Add new address | Yes |
| PUT | `/address/:addressId` | Update address | Yes |
| DELETE | `/address/:addressId` | Delete address | Yes |

### Products (`/api/products`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all products (with filters) | No |
| GET | `/:id` | Get single product | No |
| GET | `/categories/list` | Get all categories | No |
| POST | `/` | Create product | Admin |
| PUT | `/:id` | Update product | Admin |
| DELETE | `/:id` | Delete product | Admin |

**Query Parameters for GET /api/products:**
- `category` - Filter by category (Makhana, Protein Puffs, Popcorn, Combo)
- `search` - Search by product name
- `sort` - Sort by: `price-asc`, `price-desc`, `name`
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

### Cart (`/api/cart`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user's cart | Yes |
| POST | `/add` | Add item to cart | Yes |
| PUT | `/update/:productId` | Update item quantity | Yes |
| DELETE | `/remove/:productId` | Remove item from cart | Yes |
| DELETE | `/clear` | Clear entire cart | Yes |

### Wishlist (`/api/wishlist`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user's wishlist | Yes |
| POST | `/add` | Add item to wishlist | Yes |
| POST | `/toggle/:productId` | Toggle item in wishlist | Yes |
| DELETE | `/remove/:productId` | Remove item | Yes |
| DELETE | `/clear` | Clear wishlist | Yes |

### Orders (`/api/orders`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user's orders | Yes |
| GET | `/:id` | Get single order | Yes |
| POST | `/` | Create new order | Yes |
| PUT | `/:id/pay` | Mark order as paid | Yes |
| PUT | `/:id/cancel` | Cancel order | Yes |
| GET | `/admin/all` | Get all orders | Admin |
| PUT | `/:id/status` | Update order status | Admin |

## 🔑 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in your requests:

**Header:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Or store it in a cookie named `token`.

## 📝 Request Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Products
```bash
GET /api/products?category=Makhana&page=1&limit=10
```

### Add to Cart
```bash
POST /api/cart/add
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "productId": "1",
  "quantity": 2
}
```

### Create Order
```bash
POST /api/orders
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "items": [
    {
      "productId": "1",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "9876543210",
    "addressLine1": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "paymentMethod": "COD",
  "shippingPrice": 50,
  "taxPrice": 20
}
```

## 🗂️ Project Structure

```
backend/
├── config/
│   └── db.js                 # Database connection
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── errorHandler.js      # Error handling
├── models/
│   ├── User.js              # User model
│   ├── Product.js           # Product model
│   ├── Cart.js              # Cart model
│   ├── Wishlist.js          # Wishlist model
│   └── Order.js             # Order model
├── routes/
│   ├── auth.js              # Auth routes
│   ├── products.js          # Product routes
│   ├── cart.js              # Cart routes
│   ├── wishlist.js          # Wishlist routes
│   └── orders.js            # Order routes
├── scripts/
│   └── seedProducts.js      # Database seeding script
├── utils/
│   └── generateToken.js     # JWT token generator
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
├── server.js                # Main application file
└── README.md
```

## 🧪 Testing the API

You can test the API using:
- **Postman** - Import the endpoints
- **Thunder Client** - VS Code extension
- **cURL** - Command line
- **Frontend Application** - Connect your React app

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes
- Role-based access control (User/Admin)
- Input validation
- MongoDB injection protection

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify your MongoDB Atlas connection string
- Check if your IP is whitelisted
- Ensure database user has correct permissions

### Port Already in Use
```bash
# Change PORT in .env file or kill the process using port 5000
```

### Seed Script Fails
- Ensure MongoDB is connected
- Check if .env file has correct MONGODB_URI

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [JWT Documentation](https://jwt.io/)
- [Mongoose Documentation](https://mongoosejs.com/)

## 🤝 Support

For issues and questions, please create an issue in the repository.

## 📄 License

MIT
