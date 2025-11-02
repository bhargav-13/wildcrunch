# Deployment Guide - Wild Crunch Admin Panel

This guide will help you deploy the Wild Crunch Admin Panel to Vercel.

## Prerequisites

1. A GitHub account
2. A Vercel account (sign up at https://vercel.com)
3. Your backend API deployed and accessible

## Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Push the `wildcrunch-admin` folder to GitHub:

```bash
cd wildcrunch-admin
git init
git add .
git commit -m "Initial commit - Wild Crunch Admin Panel"
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (or select wildcrunch-admin if it's in a monorepo)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Add Environment Variables:
   - Click "Environment Variables"
   - Add the following variables:

   ```
   NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
   NEXT_PUBLIC_ADMIN_USERNAME=admin
   NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password_here
   ```

   **⚠️ IMPORTANT**: Change the default password!

6. Click "Deploy"

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
cd wildcrunch-admin
vercel
```

4. Follow the prompts and add environment variables when asked

## Step 3: Configure Environment Variables

After deployment, you can manage environment variables:

1. Go to your project on Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add/Update the following:

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Your backend API URL | `https://api.wildcrunch.com/api` |
| `NEXT_PUBLIC_ADMIN_USERNAME` | Admin username | `admin` |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Admin password | `SecurePassword123!` |

## Step 4: Update Backend CORS

Make sure your backend allows requests from your Vercel deployment:

1. Update your backend `.env` file:
```
FRONTEND_URL=https://your-admin-panel.vercel.app
```

2. Or update CORS settings in `backend/server.js` to include your Vercel URL

## Step 5: Test the Deployment

1. Visit your deployed URL (e.g., `https://wildcrunch-admin.vercel.app`)
2. Login with your admin credentials
3. Test all features:
   - Product management (add, edit, delete)
   - Coupon management (create, edit, toggle, delete)
   - Image uploads
   - Dashboard statistics

## Automatic Deployments

Vercel automatically deploys:
- **Production**: When you push to the `main` branch
- **Preview**: When you create a pull request

## Custom Domain (Optional)

1. Go to your project on Vercel
2. Navigate to Settings → Domains
3. Add your custom domain (e.g., `admin.wildcrunch.com`)
4. Follow DNS configuration instructions

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### API Connection Issues

- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend CORS settings
- Ensure backend is deployed and accessible

### Authentication Issues

- Verify environment variables are set correctly
- Check browser console for errors
- Clear browser cache and localStorage

## Security Best Practices

1. **Change Default Credentials**: Never use default username/password in production
2. **Use Strong Passwords**: Use a password manager to generate secure passwords
3. **HTTPS Only**: Vercel provides HTTPS by default
4. **Environment Variables**: Never commit `.env.local` to Git
5. **Regular Updates**: Keep dependencies updated

## Monitoring

Monitor your deployment:
- **Analytics**: Vercel provides built-in analytics
- **Logs**: Check deployment and function logs in Vercel dashboard
- **Errors**: Set up error tracking (e.g., Sentry)

## Support

For issues:
1. Check Vercel documentation: https://vercel.com/docs
2. Check Next.js documentation: https://nextjs.org/docs
3. Review application logs in Vercel dashboard

## Rollback

To rollback to a previous deployment:
1. Go to Deployments in Vercel dashboard
2. Find the working deployment
3. Click "..." → "Promote to Production"
