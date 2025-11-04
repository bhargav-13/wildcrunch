# Wild Crunch Admin Panel

A modern, full-featured admin dashboard for the Wild Crunch e-commerce platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Dashboard Analytics**: Real-time statistics, revenue tracking, and order insights
- **Product Management**: Complete CRUD operations with Cloudinary image uploads
- **Order Management**: View orders, update order status, manage fulfillment
- **Customer Management**: View customer information and purchase history
- **Category Management**: Automatic category tracking and statistics
- **Authentication**: Secure admin login with JWT tokens
- **Responsive Design**: Mobile-first design that works on all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Image Upload**: Cloudinary
- **Charts**: Recharts
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running (see backend setup)
- Cloudinary account

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:

   Create a `.env.local` file in the root directory:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:5000/api

   # Cloudinary Configuration
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=Root
   CLOUDINARY_API_KEY=357564319159327
   CLOUDINARY_API_SECRET=t192zZAslPpXGHLT6G0tPiKxUn0

   # Admin Credentials
   ADMIN_EMAIL=admin@wildcrunch.com
   ADMIN_PASSWORD=admin123
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3001](http://localhost:3001)

## Project Structure

```
wildcrunch-admin/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── products/       # Products management
│   │   │   ├── orders/         # Orders management
│   │   │   ├── customers/      # Customers view
│   │   │   └── categories/     # Categories view
│   │   ├── login/              # Login page
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── DashboardLayout.tsx # Dashboard layout wrapper
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── ProductModal.tsx    # Product add/edit modal
│   │   └── OrderDetailsModal.tsx # Order details modal
│   ├── lib/                    # Utilities and helpers
│   │   ├── api.ts              # API client and endpoints
│   │   ├── cloudinary.ts       # Cloudinary upload utilities
│   │   └── utils.ts            # Helper functions
│   └── store/                  # State management
│       └── authStore.ts        # Authentication store
├── public/                     # Static files
├── .env.local                  # Environment variables (not in git)
├── .env.production             # Production environment variables
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## Deployment

### Deploy to Vercel

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set environment variables** in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: Your production API URL
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Root
   - `CLOUDINARY_API_KEY`: 357564319159327
   - `CLOUDINARY_API_SECRET`: t192zZAslPpXGHLT6G0tPiKxUn0

4. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Deploy to Render

1. **Create a new Web Service** on Render dashboard

2. **Connect your repository**

3. **Configure build settings**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

4. **Add environment variables**:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

5. **Deploy**

## Cloudinary Setup

To enable image uploads, you need to create an upload preset in Cloudinary:

1. Go to Cloudinary Dashboard
2. Navigate to Settings > Upload
3. Scroll to "Upload presets"
4. Click "Add upload preset"
5. Set preset name to: `wildcrunch`
6. Set signing mode to: "Unsigned"
7. Set folder to: `wildcrunch-products`
8. Save

## Backend Requirements

The admin panel requires the following backend API endpoints:

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/profile` - Get admin profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `GET /api/products/categories/list` - Get categories

### Orders
- `GET /api/orders/admin/all` - Get all orders (admin only)
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (admin only)

## Default Admin Credentials

For development/testing:
- Email: `admin@wildcrunch.com`
- Password: `admin123`

**⚠️ Important**: Change these credentials in production!

## Features in Detail

### Dashboard
- Total revenue, orders, products, and customers
- Recent orders list
- Low stock alerts
- Quick statistics

### Product Management
- Add new products with multiple images
- Edit existing products
- Delete products
- Cloudinary image upload
- Stock management
- Category selection
- Nutrition information
- Active/inactive status

### Order Management
- View all orders
- Filter by status (pending, processing, shipped, delivered, cancelled)
- Search by order ID or customer
- Update order status
- View order details
- Customer shipping information
- Payment status

### Customer Management
- View all customers
- Customer statistics (total orders, total spent)
- Search customers
- Last order date

### Category Management
- Automatic category creation from products
- Product count per category
- Stock levels per category
- Visual statistics

## Security Notes

- All admin routes are protected with authentication
- JWT tokens are stored in localStorage
- Tokens are automatically added to API requests
- Expired tokens redirect to login
- Only users with "admin" role can access

## Common Issues

### Cloudinary Upload Fails
- Ensure upload preset "wildcrunch" is created in Cloudinary
- Check that the preset is set to "Unsigned"
- Verify CLOUDINARY_CLOUD_NAME is correct

### API Connection Issues
- Check that backend is running
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS settings in backend

### Authentication Fails
- Ensure user has "admin" role in database
- Check JWT_SECRET matches between admin panel and backend
- Verify token expiration settings

## Scripts

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private - Wild Crunch

## Support

For issues or questions, contact: admin@wildcrunch.com
