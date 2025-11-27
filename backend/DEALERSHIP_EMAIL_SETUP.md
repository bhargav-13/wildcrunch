# Dealership Form Email Configuration

This document explains how to configure email functionality for the dealership form.

## Prerequisites

You need to install the `nodemailer` package:

```bash
npm install nodemailer
```

## Environment Variables

Add the following environment variables to your `.env` file in the `backend` directory:

```env
# SMTP Configuration for Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Gmail Configuration (Recommended)

If you're using Gmail, follow these steps:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to your Google Account settings
   - Navigate to Security → 2-Step Verification → App passwords
   - Select "Mail" and your device
   - Copy the generated 16-character password
   - Use this password as `SMTP_PASS` in your `.env` file

## Example .env Configuration

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@wildcrunch.in
SMTP_PASS=abcd efgh ijkl mnop
```

## Alternative SMTP Providers

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

### Amazon SES
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
```

## Email Recipients

The dealership form sends emails to:
1. **Admin**: `care@wildcrunch.in` (receives all form submissions)
2. **User**: The email address provided in the form (receives confirmation)

## Testing

To test the email functionality:

1. Fill out the dealership form completely
2. Click Submit
3. Check both:
   - Admin email (`care@wildcrunch.in`)
   - User's provided email address

## Troubleshooting

### Common Issues

1. **Authentication Error**
   - Make sure you're using an App Password (not your regular Gmail password)
   - Verify 2FA is enabled on your Google account

2. **Connection Timeout**
   - Check if your firewall is blocking port 587
   - Try using port 465 with `secure: true`

3. **Emails Going to Spam**
   - Configure SPF and DKIM records for your domain
   - Use a professional email service (SendGrid, Mailgun, etc.)

## Security Best Practices

1. **Never commit `.env` file** to version control
2. Use environment variables for all sensitive information
3. Regularly rotate SMTP passwords
4. Use dedicated email accounts for sending automated emails
5. Monitor email sending limits to avoid being flagged as spam

## Features

### Admin Email
- Contains all form details
- Formatted HTML email
- Easy to read and process

### User Confirmation Email
- Professional design
- Thanks the user for their interest
- Sets expectations (2-3 business days response time)
- Includes contact information

## Support

For issues or questions, contact the development team or check the main documentation.
