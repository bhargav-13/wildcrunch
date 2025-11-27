# 🚀 Dealership Form Setup Guide

## Quick Setup Steps

### 1. Install Required Package

```bash
cd backend
npm install nodemailer
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory with SMTP credentials:

```env
# Email Configuration (REQUIRED)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3. Gmail Setup (Recommended)

#### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com
2. Navigate to **Security**
3. Enable **2-Step Verification**

#### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select **App**: Mail
3. Select **Device**: Other (Custom name)
4. Enter "Wild Crunch Backend"
5. Click **Generate**
6. **Copy the 16-character password** (remove spaces)
7. Use this password as `SMTP_PASS` in your `.env` file

### 4. Example `.env` Configuration

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@wildcrunch.in
SMTP_PASS=abcdefghijklmnop
```

⚠️ **Important**:
- Use the App Password, NOT your regular Gmail password
- Remove all spaces from the App Password
- Never commit the `.env` file to Git

### 5. Test the Form

1. Start your backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start your frontend:
   ```bash
   cd ../
   npm run dev
   ```

3. Navigate to the Dealership page
4. Fill out the form completely
5. Click Submit

### 6. Expected Behavior

✅ **On Success:**
- User sees a success modal with animation
- Admin receives detailed email at `care@wildcrunch.in`
- User receives confirmation email
- Form resets for next submission

❌ **On Error:**
- Error toast notification appears
- Check console for error details
- Verify SMTP credentials in `.env`

## Alternative SMTP Providers

### SendGrid (Recommended for Production)

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
```

**Setup:**
1. Sign up at https://sendgrid.com
2. Create an API key
3. Verify your domain
4. Use API key as password

### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your_mailgun_smtp_password
```

### Amazon SES

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your_aws_smtp_username
SMTP_PASS=your_aws_smtp_password
```

## Troubleshooting

### Error: "Missing credentials for PLAIN"
**Solution:** Add SMTP credentials to your `.env` file

### Error: "Invalid login"
**Solution:**
- Make sure 2FA is enabled on Gmail
- Use App Password, not regular password
- Remove all spaces from the App Password

### Emails going to spam
**Solution:**
- Use a professional email service (SendGrid, Mailgun)
- Configure SPF and DKIM records for your domain
- Use a verified sender email

### Port 587 blocked
**Solution:**
- Try port 465 with `secure: true`
- Check firewall settings
- Contact your hosting provider

## Features Implemented

### Admin Email
- ✅ All form data organized by sections
- ✅ Professional HTML formatting
- ✅ Sent to `care@wildcrunch.in`

### User Confirmation Email
- ✅ Thank you message
- ✅ Branded Wild Crunch styling
- ✅ Response timeline (2-3 business days)
- ✅ Contact information

### Success Modal
- ✅ Animated success icon
- ✅ Confirmation message
- ✅ Email notification indicator
- ✅ Close button
- ✅ "Got it!" action button

## Security Best Practices

1. ✅ Never commit `.env` file
2. ✅ Use environment variables for credentials
3. ✅ Use App Passwords for Gmail
4. ✅ Validate all form inputs on backend
5. ✅ Sanitize email content
6. ✅ Rate limiting (consider implementing)

## Support

For issues or questions:
- Check `backend/DEALERSHIP_EMAIL_SETUP.md`
- Review console logs
- Verify environment variables
- Test SMTP credentials independently

---

Made with ❤️ for Wild Crunch
