import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
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

    // Create transporter
    const transporter = createTransporter();

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

    // Send email to admin
    await transporter.sendMail({
      from: `"Wild Crunch Dealership" <${process.env.SMTP_EMAIL}>`,
      to: process.env.ADMIN_EMAIL || 'care@wildcrunch.in',
      subject: `New Dealership Application - ${firstName} ${lastName}`,
      html: adminEmailHTML,
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: `"Wild Crunch" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Thank You for Your Interest in Wild Crunch Dealership',
      html: userEmailHTML,
    });

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully! Check your email for confirmation.'
    });

  } catch (error) {
    console.error('Dealership form submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application. Please try again later.',
      error: error.message
    });
  }
});

export default router;
