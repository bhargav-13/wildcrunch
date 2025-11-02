# Wild Crunch Admin Panel 🎯

A modern, full-featured admin panel for managing the Wild Crunch e-commerce platform. Built with Next.js 14, TypeScript, and Tailwind CSS.

![Admin Panel](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🔐 Authentication
- Static credential-based login system
- Session management with localStorage
- Protected routes and automatic redirects

### 📦 Product Management
- **Full CRUD Operations**: Create, Read, Update, Delete products
- **Rich Product Details**: Name, weight, price, category, images
- **Inventory Tracking**: Stock status and quantity management
- **Nutritional Info**: Calories, protein, carbs, fat, fiber
- **Image Management**: Upload product images via URL
- **Category Organization**: Makhana, Protein Puffs, Popcorn, Combo
- **Search & Filter**: Quick product search functionality

### 🎟️ Coupon Management
- **Create Coupons**: Generate discount codes with custom rules
- **Discount Types**: Percentage or fixed amount discounts
- **Advanced Rules**: 
  - Minimum purchase requirements
  - Maximum discount limits
  - Usage limits and tracking
  - Validity periods (start/end dates)
  - Category-specific coupons
- **Toggle Status**: Activate/deactivate coupons instantly
- **Usage Analytics**: Track redemption counts

### 📊 Dashboard
- Real-time statistics (products, coupons, stock)
- Quick action shortcuts
- System information
- Modern, responsive UI

### 🎨 UI/UX
- Modern, clean interface with shadcn/ui components
- Fully responsive design
- Dark mode support (via next-themes)
- Toast notifications for user feedback
- Loading states and error handling

## 🚀 Quick Start

See [QUICKSTART.md](./QUICKSTART.md) for a 5-minute setup guide.

### Installation

```bash
cd wildcrunch-admin
npm install
```

### Configuration

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=wildcrunch@admin123
```

### Run Development Server

```bash
npm run dev
```

Visit **http://localhost:3000** and login with:
- Username: `admin`
- Password: `wildcrunch@admin123`

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes
- **[SETUP.md](./SETUP.md)** - Complete setup and configuration guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deploy to Vercel

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - High-quality React components
- **Lucide React** - Beautiful icons

### State & Data
- **Axios** - HTTP client for API calls
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Sonner** - Toast notifications

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📁 Project Structure

```
wildcrunch-admin/
├── app/                      # Next.js App Router
│   ├── dashboard/           # Dashboard pages
│   │   ├── products/        # Product management
│   │   ├── coupons/         # Coupon management
│   │   ├── layout.tsx       # Dashboard layout with sidebar
│   │   └── page.tsx         # Dashboard home
│   ├── login/               # Login page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing/redirect page
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   └── providers/           # Context providers
├── lib/                     # Utilities
│   ├── api.ts              # Axios API client
│   └── utils.ts            # Helper functions
├── .env.example            # Environment template
├── next.config.mjs         # Next.js config
├── tailwind.config.ts      # Tailwind config
├── vercel.json             # Vercel deployment
└── package.json            # Dependencies
```

## 🔒 Security

**Important Security Notes:**

1. **Change Default Credentials**: Never use default credentials in production
2. **Environment Variables**: Never commit `.env.local` to Git
3. **HTTPS Only**: Always use HTTPS in production (Vercel provides this)
4. **CORS Configuration**: Ensure backend CORS is properly configured
5. **Input Validation**: Backend validates all inputs

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_ADMIN_USERNAME=your_admin_username
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
```

## 🎯 Features Roadmap

- [x] Product CRUD operations
- [x] Coupon management
- [x] Dashboard statistics
- [x] Image upload via URL
- [ ] Image upload to cloud storage (Cloudinary/S3)
- [ ] Order management
- [ ] User management
- [ ] Analytics and reports
- [ ] Bulk operations
- [ ] Export data (CSV/Excel)

## 🤝 Contributing

This is a private project for Wild Crunch. For issues or suggestions, please contact the development team.

## 📄 License

Proprietary - Wild Crunch E-commerce Platform

## 🆘 Support

For help and support:
1. Check documentation files
2. Review error logs in browser console
3. Verify backend API connectivity
4. Check environment configuration

## 📊 API Integration

The admin panel integrates with the Wild Crunch backend API:

**Products API:**
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

**Coupons API:**
- `GET /api/coupons` - List all coupons
- `POST /api/coupons` - Create coupon
- `PUT /api/coupons/:id` - Update coupon
- `DELETE /api/coupons/:id` - Delete coupon
- `POST /api/coupons/:id/toggle` - Toggle status

## 🎨 Screenshots

### Dashboard
Clean, modern dashboard with real-time statistics

### Product Management
Comprehensive product management with image support

### Coupon Management
Advanced coupon creation with multiple discount types

---

**Version:** 1.0.0  
**Last Updated:** October 2024  
**Maintained by:** Wild Crunch Development Team
