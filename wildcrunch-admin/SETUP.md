# Wild Crunch Admin Panel - Setup Guide

Complete setup guide for the Wild Crunch Admin Panel.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running Locally](#running-locally)
5. [Features](#features)
6. [Deployment](#deployment)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Backend API** running (Wild Crunch backend)

## Installation

### 1. Navigate to Admin Panel Directory

```bash
cd wildcrunch-admin
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Axios for API calls
- And more...

## Configuration

### 1. Environment Variables

Create a `.env.local` file in the root of the `wildcrunch-admin` directory:

```bash
cp .env.example .env.local
```

### 2. Update Environment Variables

Edit `.env.local` with your configuration:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Admin Credentials (CHANGE THESE IN PRODUCTION!)
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=wildcrunch@admin123
```

**⚠️ Security Warning**: 
- Never commit `.env.local` to version control
- Change default credentials before deploying to production
- Use strong, unique passwords

### 3. Backend Configuration

Ensure your backend is configured to accept requests from the admin panel:

**Backend `.env` file:**
```env
FRONTEND_URL=http://localhost:3000
```

**Backend CORS settings** should include your admin panel URL.

## Running Locally

### Development Mode

Start the development server:

```bash
npm run dev
```

The admin panel will be available at: **http://localhost:3000**

### Production Build

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## Features

### 🔐 Authentication

- Static credential-based login
- Session management with localStorage
- Protected routes

**Default Credentials:**
- Username: `admin`
- Password: `wildcrunch@admin123`

### 📦 Product Management

- **View Products**: Browse all products with search and filter
- **Add Products**: Create new products with full details
- **Edit Products**: Update existing product information
- **Delete Products**: Remove products from inventory
- **Image Management**: Add product images via URL
- **Stock Management**: Track inventory and stock status
- **Categories**: Organize products by category (Makhana, Protein Puffs, Popcorn, Combo)

**Product Fields:**
- Name, Weight, Price
- Category, Images, Background Color
- Description, Ingredients
- Nutritional Information (Calories, Protein, Carbs, Fat, Fiber)
- Stock Status and Quantity

### 🎟️ Coupon Management

- **Create Coupons**: Generate discount codes
- **Edit Coupons**: Modify coupon details
- **Toggle Status**: Activate/deactivate coupons
- **Delete Coupons**: Remove unused coupons
- **Track Usage**: Monitor coupon redemptions

**Coupon Features:**
- Percentage or Fixed amount discounts
- Minimum purchase requirements
- Maximum discount limits
- Usage limits
- Validity periods
- Category-specific coupons
- Active/Inactive status

### 📊 Dashboard

- Product statistics
- Coupon statistics
- Quick actions
- System information

## Project Structure

```
wildcrunch-admin/
├── app/                      # Next.js app directory
│   ├── dashboard/           # Dashboard pages
│   │   ├── products/        # Product management
│   │   ├── coupons/         # Coupon management
│   │   ├── layout.tsx       # Dashboard layout
│   │   └── page.tsx         # Dashboard home
│   ├── login/               # Login page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   └── providers/           # Context providers
├── lib/                     # Utility functions
│   ├── api.ts              # API client
│   └── utils.ts            # Helper functions
├── public/                  # Static assets
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── next.config.mjs         # Next.js configuration
├── package.json            # Dependencies
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── vercel.json             # Vercel deployment config
├── DEPLOYMENT.md           # Deployment guide
└── README.md               # Project documentation
```

## API Integration

The admin panel connects to your backend API for all operations.

### API Endpoints Used

**Products:**
- `GET /api/products` - Fetch all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

**Coupons:**
- `GET /api/coupons` - Fetch all coupons
- `POST /api/coupons` - Create coupon
- `PUT /api/coupons/:id` - Update coupon
- `DELETE /api/coupons/:id` - Delete coupon
- `POST /api/coupons/:id/toggle` - Toggle coupon status

### Authentication

The admin panel uses static credentials (not JWT-based). For production, consider implementing:
- JWT-based authentication
- Role-based access control
- Session management
- Password hashing

## Troubleshooting

### Common Issues

**1. Cannot connect to API**
- Verify backend is running
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS settings in backend

**2. Login not working**
- Check credentials in `.env.local`
- Clear browser localStorage
- Verify environment variables are loaded

**3. Products/Coupons not loading**
- Check browser console for errors
- Verify API endpoints are working
- Check network tab in browser DevTools

**4. Build errors**
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Check for TypeScript errors

### Debug Mode

Enable debug logging:

```javascript
// In lib/api.ts
api.interceptors.response.use(
  response => {
    console.log('API Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
```

## Development Tips

### Hot Reload

Next.js supports hot reload. Changes to files will automatically refresh the browser.

### TypeScript

The project uses TypeScript for type safety. Run type checking:

```bash
npm run lint
```

### Styling

Uses Tailwind CSS for styling. Customize in `tailwind.config.ts`.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel.

Quick deploy:

```bash
npm install -g vercel
vercel
```

## Security Considerations

1. **Change Default Credentials**: Update admin username and password
2. **Environment Variables**: Never commit `.env.local`
3. **HTTPS**: Always use HTTPS in production
4. **CORS**: Configure backend CORS properly
5. **Input Validation**: Backend should validate all inputs
6. **Rate Limiting**: Implement rate limiting on backend
7. **Audit Logs**: Consider adding activity logging

## Performance Optimization

- Images are loaded via URL (consider using Next.js Image component)
- API calls are optimized with proper error handling
- Components use React best practices
- Lazy loading for better performance

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Support

For issues or questions:
1. Check this documentation
2. Review error logs
3. Check backend API status
4. Verify environment configuration

## License

This admin panel is part of the Wild Crunch e-commerce platform.

## Version

Current Version: **1.0.0**

Last Updated: October 2024
