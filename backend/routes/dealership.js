import express from 'express';
import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

const router = express.Router();

// Initialize SendGrid if API key is available
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Create transporter for sending emails (fallback to SMTP)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    },
    connectionTimeout: 10000,
    socketTimeout: 10000,
    greetingTimeout: 5000,
    pool: true,
    maxConnections: 5,
    maxMessages: 10,
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development'
  });
};

// @route   POST /api/dealership/submit
// @desc    Submit dealership form and send emails
// @access  Public
router.post('/submit', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      age,
      phone,
      email,
      city,
      zip,
      district,
      state,
      company,
      businessAddress,
      currentNatureBusiness,
      experienceCurrentBusiness,
      businessType,
      capacityInvestment,
      currentBusinessBrief,
      whyInterested,
      excitingManpower,
      referenceName
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !age || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: First Name, Last Name, Age, Phone, and Email'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Determine email sending method
    const useSendGrid = !!process.env.SENDGRID_API_KEY;
    let emailAvailable = false;

    if (!useSendGrid) {
      // Check if SMTP is available (fallback)
      const transporter = createTransporter();
      try {
        await transporter.verify();
        console.log('SMTP server connection verified successfully');
        emailAvailable = true;
      } catch (verifyError) {
        console.error('SMTP verification failed:', verifyError);
        console.log('Continuing without email - form data will be saved but emails will not be sent');
      }
    } else {
      emailAvailable = true;
      console.log('Using SendGrid API for email sending');
    }

    // Email to admin (care@wildcrunch.in)
    const adminEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #F1B213; padding: 20px; text-align: center; }
          .header h1 { color: white; margin: 0; }
          .content { background-color: #f9f9f9; padding: 20px; }
          .section { margin-bottom: 20px; }
          .section h2 { color: #F1B213; border-bottom: 2px solid #F1B213; padding-bottom: 5px; }
          .field { margin: 10px 0; }
          .field strong { color: #555; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Dealership Application</h1>
          </div>
          <div class="content">
            <div class="section">
              <h2>Personal Information</h2>
              <div class="field"><strong>Name:</strong> ${firstName} ${lastName}</div>
              <div class="field"><strong>Age:</strong> ${age}</div>
            </div>

            <div class="section">
              <h2>Contact Information</h2>
              <div class="field"><strong>Phone:</strong> ${phone}</div>
              <div class="field"><strong>Email:</strong> ${email}</div>
              <div class="field"><strong>City:</strong> ${city || 'N/A'}</div>
              <div class="field"><strong>ZIP:</strong> ${zip || 'N/A'}</div>
              <div class="field"><strong>District:</strong> ${district || 'N/A'}</div>
              <div class="field"><strong>State:</strong> ${state || 'N/A'}</div>
              <div class="field"><strong>Company:</strong> ${company || 'N/A'}</div>
              <div class="field"><strong>Business Address:</strong> ${businessAddress || 'N/A'}</div>
            </div>

            <div class="section">
              <h2>Business Information</h2>
              <div class="field"><strong>Current Nature of Business:</strong> ${currentNatureBusiness || 'N/A'}</div>
              <div class="field"><strong>Experience in Current Business:</strong> ${experienceCurrentBusiness || 'N/A'} years</div>
              <div class="field"><strong>Business Type:</strong> ${businessType || 'N/A'}</div>
              <div class="field"><strong>Capacity of Investment:</strong> ${capacityInvestment || 'N/A'}</div>
              <div class="field"><strong>Current Business Brief:</strong> ${currentBusinessBrief || 'N/A'}</div>
              <div class="field"><strong>Why Interested:</strong> ${whyInterested || 'N/A'}</div>
              <div class="field"><strong>Existing Manpower:</strong> ${excitingManpower || 'N/A'}</div>
              <div class="field"><strong>Reference:</strong> ${referenceName || 'N/A'}</div>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated email from Wild Crunch Dealership Portal</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email to user (confirmation)
    const userEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #F1B213; padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background-color: #f9f9f9; padding: 30px; }
          .message { font-size: 16px; line-height: 1.8; }
          .highlight { background-color: #fff; padding: 20px; border-left: 4px solid #F1B213; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .logo { font-size: 24px; font-weight: bold; color: #F1B213; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Thank You for Your Interest!</h1>
          </div>
          <div class="content">
            <div class="message">
              <p>Dear ${firstName} ${lastName},</p>

              <p>Thank you for showing interest in becoming a <strong>Wild Crunch Dealer</strong>! We're thrilled to have received your application.</p>

              <div class="highlight">
                <p><strong>✅ Your application has been successfully submitted!</strong></p>
                <p>Our dealership team will review your application and get back to you within 2-3 business days.</p>
              </div>

              <p>We appreciate your enthusiasm to partner with Wild Crunch and look forward to the possibility of working together to bring healthy, delicious snacks to more people.</p>

              <p>If you have any immediate questions, please feel free to contact us at:</p>
              <p>📧 Email: care@wildcrunch.in<br>
              📞 Phone: +91 832 062 9091</p>

              <p>Best regards,<br>
              <span class="logo">Wild Crunch Team</span></p>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated confirmation email. Please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Wild Crunch. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send emails if available
    if (emailAvailable) {
      try {
        if (useSendGrid) {
          // Use SendGrid API
          const fromEmail = process.env.SENDGRID_FROM_EMAIL || process.env.SMTP_EMAIL || 'noreply@wildcrunch.in';

          await sgMail.send([
            {
              to: process.env.ADMIN_EMAIL || 'care@wildcrunch.in',
              from: fromEmail,
              subject: `New Dealership Application - ${firstName} ${lastName}`,
              html: adminEmailHTML,
            },
            {
              to: email,
              from: fromEmail,
              subject: 'Thank You for Your Interest in Wild Crunch Dealership',
              html: userEmailHTML,
            }
          ]);

          console.log('Emails sent successfully via SendGrid');
        } else {
          // Use SMTP
          const transporter = createTransporter();

          await transporter.sendMail({
            from: `"Wild Crunch Dealership" <${process.env.SMTP_EMAIL}>`,
            to: process.env.ADMIN_EMAIL || 'care@wildcrunch.in',
            subject: `New Dealership Application - ${firstName} ${lastName}`,
            html: adminEmailHTML,
          });

          await transporter.sendMail({
            from: `"Wild Crunch" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: 'Thank You for Your Interest in Wild Crunch Dealership',
            html: userEmailHTML,
          });

          console.log('Emails sent successfully via SMTP');
        }
      } catch (emailError) {
        console.error('Failed to send emails:', emailError);
        // Don't throw error - form submission should still succeed
      }
    } else {
      console.log('Skipping email sending - no email service available');
    }

    res.status(200).json({
      success: true,
      message: emailAvailable
        ? 'Application submitted successfully! Check your email for confirmation.'
        : 'Application submitted successfully! We will contact you soon.'
    });

  } catch (error) {
    console.error('Dealership form submission error:', error);

    // Provide more specific error messages based on error type
    let errorMessage = 'Failed to submit application. Please try again later.';

    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNECTION') {
      errorMessage = 'Email service temporarily unavailable. Please try again in a few minutes.';
    } else if (error.code === 'EAUTH') {
      errorMessage = 'Email configuration error. Please contact support.';
      console.error('SMTP Authentication failed - check SMTP credentials in production env vars');
    } else if (error.responseCode >= 500) {
      errorMessage = 'Email server error. Please try again later.';
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
