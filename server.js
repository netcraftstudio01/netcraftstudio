import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'netcraftstudio01@gmail.com',
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.log('Gmail connection error:', error.message);
  } else {
    console.log('Gmail connection successful');
  }
});

// Email sending route
app.post('/api/send-email', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  console.log('Received email request:', { name, email, phone, subject });

  // Validate input
  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER || 'netcraftstudio01@gmail.com',
      to: 'netcraftstudio01@gmail.com',
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // Email to user (confirmation)
    const userMailOptions = {
      from: process.env.EMAIL_USER || 'netcraftstudio01@gmail.com',
      to: email,
      subject: 'We received your message - NetCraft Studio',
      html: `
        <h2>Thank you for contacting NetCraft Studio!</h2>
        <p>Hi ${name},</p>
        <p>We have received your message and will get back to you within 24 hours.</p>
        <p><strong>Your message details:</strong></p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <p>Best regards,<br>NetCraft Studio Team</p>
      `,
    };

    // Send both emails
    console.log('Sending admin email...');
    await transporter.sendMail(adminMailOptions);
    console.log('Admin email sent successfully');
    
    console.log('Sending user confirmation email...');
    await transporter.sendMail(userMailOptions);
    console.log('User confirmation email sent successfully');

    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email: ' + error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
  console.log(`Make sure .env file is configured with EMAIL_USER and EMAIL_PASSWORD`);
});

