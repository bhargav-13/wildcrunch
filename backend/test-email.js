// Test SMTP Email Configuration
// Run this file to test if your email setup is working
// Usage: node test-email.js

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('\n🧪 Testing SMTP Email Configuration...\n');

// Check if credentials are set
if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
  console.error('❌ ERROR: SMTP credentials not found in .env file\n');
  console.log('Please add the following to your backend/.env file:');
  console.log('SMTP_HOST=smtp.gmail.com');
  console.log('SMTP_PORT=587');
  console.log('SMTP_EMAIL=your-email@gmail.com');
  console.log('SMTP_PASSWORD=your-app-password');
  console.log('ADMIN_EMAIL=wildcrunch@gmail.com\n');
  process.exit(1);
}

console.log('📋 Current Configuration:');
console.log(`   SMTP Host: ${process.env.SMTP_HOST || 'smtp.gmail.com'}`);
console.log(`   SMTP Port: ${process.env.SMTP_PORT || '587'}`);
console.log(`   SMTP Email: ${process.env.SMTP_EMAIL}`);
console.log(`   SMTP Pass: ${'*'.repeat(process.env.SMTP_PASSWORD?.length || 0)}`);
console.log(`   Admin Email: ${process.env.ADMIN_EMAIL || 'care@wildcrunch.in'}\n`);

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Test email
const testEmail = {
  from: `"Wild Crunch Test" <${process.env.SMTP_EMAIL}>`,
  to: process.env.SMTP_EMAIL, // Send to yourself
  subject: '✅ Wild Crunch SMTP Test - Success!',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #F1B213; padding: 20px; text-align: center; }
        .header h1 { color: white; margin: 0; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .success { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ SMTP Test Successful!</h1>
        </div>
        <div class="content">
          <div class="success">
            <h2>Congratulations! 🎉</h2>
            <p>Your SMTP email configuration is working correctly.</p>
          </div>
          <h3>Configuration Details:</h3>
          <ul>
            <li><strong>Host:</strong> ${process.env.SMTP_HOST || 'smtp.gmail.com'}</li>
            <li><strong>Port:</strong> ${process.env.SMTP_PORT || '587'}</li>
            <li><strong>Email:</strong> ${process.env.SMTP_EMAIL}</li>
            <li><strong>Admin Email:</strong> ${process.env.ADMIN_EMAIL || 'care@wildcrunch.in'}</li>
            <li><strong>Test Date:</strong> ${new Date().toLocaleString()}</li>
          </ul>
          <p><strong>✅ Your dealership form is now ready to send emails!</strong></p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            This is a test email from Wild Crunch Backend.<br>
            If you received this, your email configuration is working properly.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
};

console.log('📧 Sending test email...\n');

// Send test email
transporter.sendMail(testEmail)
  .then(info => {
    console.log('✅ SUCCESS! Test email sent successfully!\n');
    console.log('📬 Email Details:');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Recipient: ${testEmail.to}`);
    console.log(`   Subject: ${testEmail.subject}\n`);
    console.log('🎉 Your SMTP configuration is working correctly!');
    console.log('✅ The dealership form is ready to use.\n');
    console.log('💡 Next Steps:');
    console.log('   1. Check your inbox for the test email');
    console.log('   2. If not in inbox, check spam folder');
    console.log('   3. Test the dealership form on your website\n');
  })
  .catch(error => {
    console.error('❌ ERROR: Failed to send test email\n');
    console.error('Error Details:', error.message);
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('   1. Verify your SMTP credentials in .env file');
    console.log('   2. For Gmail: Make sure you are using an App Password');
    console.log('   3. Check if 2-Factor Authentication is enabled');
    console.log('   4. Remove all spaces from the App Password');
    console.log('   5. Try generating a new App Password\n');
    console.log('📚 For more help, see: backend/DEALERSHIP_EMAIL_SETUP.md\n');
    process.exit(1);
  });
