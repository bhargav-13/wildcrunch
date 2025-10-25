# 📧 Email Notification Setup Guide

This guide will help you set up email notifications for order confirmations.

## Features

✅ Admin receives email when order is successfully paid  
✅ Beautiful HTML email with all order details  
✅ Fallback text-only email for email clients that don't support HTML  
✅ All order information included: items, prices, shipping address, customer details  

---

## Email Configuration

### Step 1: Add Email Settings to backend/.env

Add these environment variables to your `backend/.env` file:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Admin Email (where notifications will be sent)
ADMIN_EMAIL=admin@yourwebsite.com
```

### Step 2: Gmail Setup (Recommended for testing)

If using Gmail, you need to create an **App Password**:

1. Go to your Google Account settings
2. Navigate to **Security** → **2-Step Verification** (enable if not already enabled)
3. Go to **Security** → **App passwords**
4. Select **Mail** as the app
5. Select **Other** and name it "Wild Crunch Backend"
6. Click **Generate**
7. Copy the 16-character password
8. Use this as your `SMTP_PASSWORD` in .env

**Important:** Don't use your regular Gmail password, use the app password!

---

## Alternative Email Providers

### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_EMAIL=apikey
SMTP_PASSWORD=your_sendgrid_api_key
```

### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_EMAIL=your_mailgun_email
SMTP_PASSWORD=your_mailgun_password
```

### AWS SES

```env
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_PORT=587
SMTP_EMAIL=your_ses_username
SMTP_PASSWORD=your_ses_password
```

### Outlook

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_EMAIL=your-email@outlook.com
SMTP_PASSWORD=your-password
```

---

## Complete .env Example

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wildcrunch

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:5173

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-16-character-app-password
ADMIN_EMAIL=admin@yourwebsite.com
```

---

## Testing Email Setup

### 1. Restart Backend Server

After updating .env, restart your backend server:

```bash
cd backend
npm run dev
```

### 2. Test with a Real Order

1. Add products to cart
2. Complete checkout
3. Make payment
4. Check admin email for notification

### 3. Check Backend Logs

You should see one of these messages in the backend console:

✅ **Success:** `✅ Admin notification email sent successfully`  
⚠️ **Not Configured:** `⚠️ Email not configured. Skipping email notification.`  
❌ **Error:** Error details will be shown

---

## Email Template Features

The admin notification email includes:

### 📋 Order Details
- Order number
- Payment status
- Payment method
- Transaction ID
- Order date

### 👤 Customer Information
- Customer name
- Email address
- Phone number

### 📍 Shipping Address
- Full address with all details
- Contact information

### 📦 Order Items
- Product names
- Pack information (Individual/Pack of 2/Pack of 4)
- Quantities
- Individual prices
- Item subtotals

### 💰 Price Summary
- Subtotal
- Shipping charges
- **Total amount**

---

## Troubleshooting

### Email Not Sending

**Check 1: Environment Variables**
```bash
# Verify .env file has all email variables
cat backend/.env | grep SMTP
```

**Check 2: Backend Logs**
Look for error messages in the backend console

**Check 3: Gmail App Password**
- Make sure you're using App Password, not regular password
- App password is 16 characters (no spaces)
- Example: `abcd efgh ijkl mnop` should be `abcdefghijklmnop`

**Check 4: Two-Factor Authentication**
- Gmail requires 2FA to be enabled to use App Passwords

### Common Errors

**Error: Invalid login**
- Wrong email or password
- Not using App Password for Gmail

**Error: Connection timeout**
- Check SMTP_PORT (587 for TLS, 465 for SSL)
- Check firewall settings
- Try different SMTP_HOST

**Error: Authentication failed**
- Gmail: Make sure 2FA is enabled
- Gmail: Use App Password, not regular password
- Other providers: Check credentials

---

## Production Recommendations

### For Production:

1. **Use Professional Email Service**
   - SendGrid (10,000 emails/month free)
   - Mailgun (5,000 emails/month free)
   - AWS SES (62,000 emails/month free)

2. **Add Email Templates**
   - Customer confirmation emails
   - Shipping updates
   - Order cancellation emails

3. **Queue System**
   - Use Redis/Bull for email queue
   - Retry failed emails
   - Better error handling

4. **Email Tracking**
   - Track email opens
   - Track link clicks
   - Delivery reports

---

## Files Modified

### New Files:
- `backend/utils/sendEmail.js` - Email utility service

### Modified Files:
- `backend/routes/payment.js` - Added email notification on payment success

---

## Security Notes

⚠️ **Important:**
- Never commit `.env` file to Git
- Never share App Passwords
- Use environment variables for all secrets
- For production, use secure email services (not Gmail)

---

## Testing Without Email Configuration

If you don't want to set up email right now:
- The system will continue to work
- Payment verification will succeed
- You'll see a warning in the logs: `⚠️ Email not configured`
- You can add email configuration later

---

## Status: ✅ Ready to Use

Email notifications are now integrated into your order flow! Simply add your email configuration to `.env` and you're ready to go!
