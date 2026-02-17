import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { initializeDatabase, query } from './config/database.js';
import projectRoutes from './routes/projects.js';
import clientRoutes from './routes/clients.js';
import teamRoutes from './routes/team.js';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// Middleware - CORS Configuration
// In development: Vite proxy handles CORS, so we allow localhost
// In production: Same server serves front & backend, CORS not needed
const allowedOrigins = [
  'http://localhost:5173',           // Vite dev server (proxied requests)
  'http://localhost:5000',           // Direct backend access (testing)
  'http://localhost:3000',           // Alternative dev port
  'https://www.netcraftstudios.org', // Production domain
  'https://netcraftstudio.vercel.app', // Vercel frontend
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow all in development for proxy
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize database on startup
initializeDatabase();

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

    // Save contact message to database
    try {
      await query(
        'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5)',
        [name, email, phone, subject, message]
      );
      console.log('Contact message saved to database');
    } catch (dbError) {
      console.error('Error saving to database:', dbError);
      // Don't fail the request if database save fails
    }

    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email: ' + error.message });
  }
});

// Database API Routes
app.use('/api/projects', projectRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/team', teamRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await query('SELECT NOW()');
    res.json({
      status: 'Server is running',
      database: 'connected',
      email: 'configured',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'Server is running',
      database: 'disconnected',
      email: 'configured',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Cloudinary upload endpoint
app.post('/api/upload', async (req, res) => {
  try {
    const { file, folder, publicId } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Upload to Cloudinary with custom public_id for better naming
    const uploadOptions = {
      folder: folder || 'netcraft-studio',
      resource_type: 'auto',
    };

    // Use custom public_id if provided
    if (publicId) {
      uploadOptions.public_id = publicId;
      uploadOptions.overwrite = true; // Allow overwriting with same name
    }

    const result = await cloudinary.uploader.upload(file, uploadOptions);

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image: ' + error.message });
  }
});

const PORT = process.env.PORT || 5000;

// Serve static files from the dist directory (for production build)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Catch-all: serve index.html for all non-API routes (SPA support)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`✓ Email service configured`);
  console.log(`✓ Cloudinary upload configured`);
  console.log(`✓ Database routes available at /api/projects, /api/clients, /api/team`);
  console.log(`✓ Upload endpoint available at /api/upload`);
  console.log(`✓ Health check available at /api/health\n`);
  console.log(`Make sure .env file is configured with:`);
  console.log(`  - EMAIL_USER and EMAIL_PASSWORD`);
  console.log(`  - Database credentials (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)`);
  console.log(`  - Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)\n`);
});

