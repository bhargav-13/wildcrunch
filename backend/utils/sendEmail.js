import nodemailer from 'nodemailer';

// Create reusable transporter
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

// Send order notification email to admin
export const sendOrderNotification = async (order, user) => {
  try {
    // Validate email configuration
    if (!process.env.ADMIN_EMAIL || !process.env.SMTP_EMAIL) {
      console.log('⚠️ Email not configured. Skipping email notification.');
      return { success: false, message: 'Email not configured' };
    }

    const transporter = createTransporter();

    // Get order items summary
    const itemsSummary = order.items.map(item => {
      const packLabel = item.pack === '2' ? ' (Pack of 2)' : item.pack === '4' ? ' (Pack of 4)' : '';
      const itemTotal = (item.packPrice || item.priceNumeric) * item.quantity;
      return `
        • ${item.name}${packLabel}
          Quantity: ${item.quantity}
          Price: ₹${item.packPrice || item.priceNumeric} each
          Subtotal: ₹${itemTotal}`;
    }).join('\n');

    // Format address
    const address = order.shippingAddress ? `
      ${order.shippingAddress.fullName}
      ${order.shippingAddress.address}
      ${order.shippingAddress.area || ''}
      ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}
      Phone: ${order.shippingAddress.phone}
      Email: ${order.shippingAddress.email || user.email}
    ` : 'Not provided';

    // Email options
    const mailOptions = {
      from: `"Wild Crunch Orders" <${process.env.SMTP_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🎉 New Order Received - ${order.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8f8f8;
            }
            .container {
              background-color: #ffffff;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #F1B213 0%, #E5A612 100%);
              color: white;
              padding: 20px;
              border-radius: 10px 10px 0 0;
              margin: -30px -30px 30px -30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .order-number {
              background-color: #F1B213;
              color: #000;
              padding: 5px 15px;
              border-radius: 5px;
              font-weight: bold;
              display: inline-block;
              margin: 10px 0;
            }
            .info-box {
              background-color: #f9f9f9;
              border-left: 4px solid #F1B213;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .info-box h3 {
              margin-top: 0;
              color: #F1B213;
            }
            .items-box {
              background-color: #f9f9f9;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .item {
              padding: 10px 0;
              border-bottom: 1px solid #ddd;
            }
            .item:last-child {
              border-bottom: none;
            }
            .total-box {
              background-color: #F1B213;
              color: #000;
              padding: 15px;
              border-radius: 5px;
              text-align: center;
              margin: 20px 0;
            }
            .total-box h2 {
              margin: 0;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 12px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
            }
            table td {
              padding: 8px;
              border-bottom: 1px solid #eee;
            }
            table td:first-child {
              font-weight: bold;
              width: 40%;
            }
            .status-badge {
              display: inline-block;
              padding: 5px 10px;
              border-radius: 5px;
              font-weight: bold;
              background-color: #28a745;
              color: white;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 New Order Received!</h1>
              <div class="order-number">Order #${order.orderNumber}</div>
            </div>

            <div class="info-box">
              <h3>📋 Order Details</h3>
              <table>
                <tr>
                  <td>Order Number:</td>
                  <td><strong>${order.orderNumber}</strong></td>
                </tr>
                <tr>
                  <td>Payment Status:</td>
                  <td><span class="status-badge">${order.paymentStatus}</span></td>
                </tr>
                <tr>
                  <td>Payment Method:</td>
                  <td>${order.paymentMethod}</td>
                </tr>
                <tr>
                  <td>Order Date:</td>
                  <td>${new Date(order.createdAt).toLocaleString('en-IN')}</td>
                </tr>
                ${order.paymentDetails?.razorpayPaymentId ? `
                <tr>
                  <td>Transaction ID:</td>
                  <td>${order.paymentDetails.razorpayPaymentId}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <div class="info-box">
              <h3>👤 Customer Information</h3>
              <p><strong>Name:</strong> ${user.name}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              ${user.phone ? `<p><strong>Phone:</strong> ${user.phone}</p>` : ''}
            </div>

            <div class="info-box">
              <h3>📍 Shipping Address</h3>
              <pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">${address}</pre>
            </div>

            <div class="items-box">
              <h3 style="margin-top: 0;">📦 Order Items</h3>
              <pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">${itemsSummary}</pre>
            </div>

            <div class="total-box">
              <table style="background: transparent; color: #000;">
                <tr>
                  <td>Subtotal:</td>
                  <td style="text-align: right;">₹${order.itemsPrice}</td>
                </tr>
                <tr>
                  <td>Shipping:</td>
                  <td style="text-align: right;">₹${order.shippingPrice}</td>
                </tr>
                <tr style="border-top: 2px solid #000; font-size: 18px;">
                  <td><strong>Total:</strong></td>
                  <td style="text-align: right;"><strong>₹${order.totalPrice}</strong></td>
                </tr>
              </table>
            </div>

            <div class="footer">
              <p>This is an automated notification from Wild Crunch E-commerce System.</p>
              <p>Please process this order and update the order status.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
🎉 NEW ORDER RECEIVED - ${order.orderNumber}

Order Details:
- Order Number: ${order.orderNumber}
- Payment Status: ${order.paymentStatus}
- Payment Method: ${order.paymentMethod}
- Date: ${new Date(order.createdAt).toLocaleString('en-IN')}

Customer Information:
- Name: ${user.name}
- Email: ${user.email}
${user.phone ? `- Phone: ${user.phone}` : ''}

Shipping Address:
${address}

Order Items:
${itemsSummary}

Price Summary:
- Subtotal: ₹${order.itemsPrice}
- Shipping: ₹${order.shippingPrice}
- Total: ₹${order.totalPrice}

Please process this order and update the order status.
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Admin notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

export default {
  sendOrderNotification
};
