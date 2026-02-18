import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { ViteDevServer } from "vite";
import { IncomingMessage, ServerResponse } from "http";

// Load environment variables from .env file
dotenv.config();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Custom Vite plugin for email API
const emailPlugin = {
  name: 'email-api',
  configureServer(server: ViteDevServer) {
    return () => {
      server.middlewares.use('/api/send-email', async (req: IncomingMessage, res: ServerResponse, _next: (err?: Error) => void) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: Buffer) => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            const { name, email, phone, subject, message } = data;

            // Validate input
            if (!name || !email || !phone || !subject || !message) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'All fields are required' }));
              return;
            }

            // Email to admin
            const adminMailOptions = {
              from: process.env.EMAIL_USER,
              to: 'netcraftstudio01@gmail.com',
              subject: `New Contact Form Submission: ${subject}`,
              html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
              `,
            };

            // Email to user
            const userMailOptions = {
              from: process.env.EMAIL_USER,
              to: email,
              subject: 'We received your message - NetCraft Studio',
              html: `
                <h2>Thank you for contacting us!</h2>
                <p>Hi ${name},</p>
                <p>We have received your message and will get back to you within 24 hours.</p>
                <p><strong>Your message:</strong></p>
                <p>${message}</p>
                <hr>
                <p>Best regards,<br>NetCraft Studio Team</p>
              `,
            };

            // Send both emails
            await transporter.sendMail(adminMailOptions);
            await transporter.sendMail(userMailOptions);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, message: 'Email sent successfully' }));
          } catch (error) {
            console.error('Email error:', error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' }));
          }
        });
      });
    };
  }
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    hmr: {
      overlay: false,
    },
    // DEVELOPMENT: Proxy all /api requests to Express backend on port 5000
    // PRODUCTION (Vercel): API routes use serverless functions in /api directory
    // Vercel automatically routes /api/* requests to the serverless functions
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        // Log proxy requests in development
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (_proxyReq, req, _res) => {
            console.log(`[Proxy] ${req.method} ${req.url} -> http://localhost:5000${req.url}`);
          });
        },
      },
    },
  },
  plugins: [emailPlugin, react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit to 1000 KB
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-avatar'],
        },
      },
    },
  },
}));
