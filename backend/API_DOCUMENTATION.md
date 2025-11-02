# Wild Crunch API Documentation

Complete API reference for Wild Crunch E-commerce Backend.

## Base URL
```
http://localhost:5000/api
```

## Response Format

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "message": "Optional detailed message"
}
```

---

## 🔐 Authentication API

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "user",
    "token": "jwt_token_here"
  }
}
```

---

### Login

**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "user",
    "token": "jwt_token_here"
  }
}
```

---

### Get Profile

**GET** `/auth/profile`

Get current user's profile information.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "user",
    "addresses": [...]
  }
}
```

---

### Update Profile

**PUT** `/auth/profile`

Update user profile information.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "9999999999",
  "password": "newpassword123"
}
```

---

### Add Address

**POST** `/auth/address`

Add a new shipping address.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "addressLine1": "123 Main Street",
  "addressLine2": "Apartment 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "country": "India",
  "isDefault": true
}
```

---

## 🛍️ Products API

### Get All Products

**GET** `/products`

Retrieve products with filtering and pagination.

**Query Parameters:**
- `category` - Filter by category (optional)
- `search` - Search products by name (optional)
- `sort` - Sort by: `price-asc`, `price-desc`, `name`, `newest` (optional)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Example:**
```
GET /products?category=Makhana&page=1&limit=10&sort=price-asc
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_mongo_id",
      "id": "1",
      "name": "Salt & Pepper Makhana",
      "weight": "80 gram",
      "price": "₹200",
      "priceNumeric": 200,
      "category": "Makhana",
      "imageSrc": "/images/1.png",
      "bgColor": "#F1B213",
      "description": "Crispy and healthy...",
      "ingredients": "Fox Nuts, Salt...",
      "nutritionalInfo": { ... },
      "inStock": true,
      "stockQuantity": 100,
      "ratings": {
        "average": 4.5,
        "count": 120
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 19,
    "pages": 2
  }
}
```

---

### Get Single Product

**GET** `/products/:id`

Get product details by ID.

**Example:**
```
GET /products/1
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "product_mongo_id",
    "id": "1",
    "name": "Salt & Pepper Makhana",
    ...
  }
}
```

---

### Get Categories

**GET** `/products/categories/list`

Get all available product categories.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": ["Makhana", "Protein Puffs", "Popcorn", "Combo"]
}
```

---

### Upload Product Image (Admin Only)

**POST** `/products/upload`

Upload a product image to Cloudinary. Returns the Cloudinary URL to use in product creation/update.

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
image: [File] (Max size: 5MB, Formats: jpg, jpeg, png, webp, gif)
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/wildcrunch/products/abc123.jpg",
    "publicId": "wildcrunch/products/abc123",
    "originalName": "product-image.jpg",
    "size": 245678,
    "format": "jpg"
  }
}
```

**Notes:**
- Images are automatically optimized and resized (max 1000x1000px)
- Automatic WebP conversion for supported browsers
- Stored in `wildcrunch/products` folder on Cloudinary

---

### Create Product (Admin Only)

**POST** `/products`

Create a new product. Can optionally include image upload in the same request.

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json OR multipart/form-data (if uploading image)
```

**Option 1: JSON Request (with existing image URL)**
```json
{
  "id": "20",
  "name": "New Product",
  "weight": "100 gram",
  "price": "₹250",
  "priceNumeric": 250,
  "category": "Makhana",
  "imageSrc": "https://res.cloudinary.com/your-cloud/image/upload/v123/wildcrunch/products/abc.jpg",
  "bgColor": "#FF5733",
  "description": "Product description",
  "ingredients": "Ingredients list",
  "stockQuantity": 50
}
```

**Option 2: FormData Request (with image upload)**

Send product data as form fields + image file:
```
id: "20"
name: "New Product"
weight: "100 gram"
price: "₹250"
priceNumeric: 250
category: "Makhana"
bgColor: "#FF5733"
description: "Product description"
ingredients: "Ingredients list"
stockQuantity: 50
image: [File]
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "mongo_id",
    "id": "20",
    "name": "New Product",
    "imageSrc": "https://res.cloudinary.com/...",
    ...
  },
  "imageUploaded": true
}
```

---

### Update Product (Admin Only)

**PUT** `/products/:id`

Update an existing product. Can optionally upload new image.

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json OR multipart/form-data (if uploading image)
```

**Request Body:**
Same format as Create Product (JSON or FormData with optional image)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "mongo_id",
    "id": "20",
    "name": "Updated Product",
    ...
  },
  "imageUploaded": false
}
```

---

### Delete Product Image (Admin Only)

**DELETE** `/products/image/:publicId`

Delete an image from Cloudinary using its public ID.

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Example:**
```
DELETE /products/image/wildcrunch%2Fproducts%2Fabc123
```

**Note:** URL-encode the publicId if it contains slashes (e.g., `wildcrunch/products/abc123` becomes `wildcrunch%2Fproducts%2Fabc123`)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Image deleted successfully from Cloudinary"
}
```

---

### Delete Product (Admin Only)

**DELETE** `/products/:id`

Delete a product by ID.

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 🛒 Cart API

### Get Cart

**GET** `/cart`

Get current user's shopping cart.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "cart_id",
    "user": "user_id",
    "items": [
      {
        "product": "product_mongo_id",
        "productId": "1",
        "name": "Salt & Pepper Makhana",
        "price": "₹200",
        "priceNumeric": 200,
        "imageSrc": "/images/1.png",
        "weight": "80 gram",
        "quantity": 2
      }
    ],
    "totalItems": 2,
    "totalPrice": 400
  }
}
```

---

### Add to Cart

**POST** `/cart/add`

Add item to cart or update quantity if exists.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "productId": "1",
  "quantity": 2
}
```

**Response:** `200 OK`

---

### Update Cart Item

**PUT** `/cart/update/:productId`

Update quantity of cart item.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "quantity": 3
}
```

---

### Remove from Cart

**DELETE** `/cart/remove/:productId`

Remove specific item from cart.

**Headers:**
```
Authorization: Bearer {token}
```

**Example:**
```
DELETE /cart/remove/1
```

---

### Clear Cart

**DELETE** `/cart/clear`

Remove all items from cart.

**Headers:**
```
Authorization: Bearer {token}
```

---

## ❤️ Wishlist API

### Get Wishlist

**GET** `/wishlist`

Get current user's wishlist.

**Headers:**
```
Authorization: Bearer {token}
```

---

### Add to Wishlist

**POST** `/wishlist/add`

Add product to wishlist.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "productId": "1"
}
```

---

### Toggle Wishlist

**POST** `/wishlist/toggle/:productId`

Add to wishlist if not exists, remove if exists.

**Headers:**
```
Authorization: Bearer {token}
```

**Example:**
```
POST /wishlist/toggle/1
```

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Item added to wishlist",
  "action": "added"  // or "removed"
}
```

---

### Remove from Wishlist

**DELETE** `/wishlist/remove/:productId`

Remove product from wishlist.

**Headers:**
```
Authorization: Bearer {token}
```

---

## 📦 Orders API

### Create Order

**POST** `/orders`

Create a new order from cart or direct items.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "1",
      "quantity": 2
    },
    {
      "productId": "3",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "9876543210",
    "addressLine1": "123 Main Street",
    "addressLine2": "Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "paymentMethod": "COD",
  "shippingPrice": 50,
  "taxPrice": 36
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "orderNumber": "WC-ABC123-XYZ",
    "user": "user_id",
    "items": [...],
    "shippingAddress": {...},
    "paymentMethod": "COD",
    "paymentStatus": "Pending",
    "orderStatus": "Processing",
    "itemsPrice": 400,
    "shippingPrice": 50,
    "taxPrice": 36,
    "totalPrice": 486,
    "createdAt": "2024-01-20T10:30:00.000Z"
  },
  "message": "Order created successfully"
}
```

---

### Get User Orders

**GET** `/orders`

Get all orders for current user.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "orderNumber": "WC-ABC123-XYZ",
      "orderStatus": "Processing",
      "totalPrice": 486,
      "createdAt": "2024-01-20T10:30:00.000Z",
      ...
    }
  ]
}
```

---

### Get Order by ID

**GET** `/orders/:id`

Get specific order details.

**Headers:**
```
Authorization: Bearer {token}
```

---

### Mark Order as Paid

**PUT** `/orders/:id/pay`

Update order payment status to paid.

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "transactionId": "TXN123456789"
}
```

---

### Cancel Order

**PUT** `/orders/:id/cancel`

Cancel an order (restores product stock).

**Headers:**
```
Authorization: Bearer {token}
```

---

### Get All Orders (Admin)

**GET** `/orders/admin/all`

Get all orders in the system.

**Headers:**
```
Authorization: Bearer {admin_token}
```

---

### Update Order Status (Admin)

**PUT** `/orders/:id/status`

Update order status.

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "orderStatus": "Shipped"
}
```

**Valid Status Values:**
- `Processing`
- `Confirmed`
- `Shipped`
- `Delivered`
- `Cancelled`

---

## 🔑 Payment Methods

Supported payment methods:
- `COD` - Cash on Delivery
- `Card` - Credit/Debit Card
- `UPI` - UPI Payment
- `Net Banking` - Net Banking

---

## 📊 Order Status Flow

```
Processing → Confirmed → Shipped → Delivered
     ↓
 Cancelled
```

---

## ⚠️ Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 🔐 Authentication Notes

- Token expires after 7 days (configurable)
- Include token in `Authorization` header as `Bearer {token}`
- Store token securely on client side
- Admin routes require user role to be `admin`

---

## 💡 Tips

1. Always include `Content-Type: application/json` header for POST/PUT requests
2. Product stock is automatically managed during order creation
3. Cart is automatically cleared after successful order
4. Use pagination for better performance with large datasets
5. Images should be served from a CDN or static folder

---

## 📞 Support

For additional help, refer to the main README.md or create an issue in the repository.
