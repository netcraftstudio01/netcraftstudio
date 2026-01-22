# NetCraft Studio - Complete Website

A modern, high-performance portfolio and business website for NetCraft Studio, built with cutting-edge web technologies.

## Project Overview

NetCraft Studio is a full-featured website showcasing:
- 🎯 Services (9 service categories with detailed pages)
- 🎨 Portfolio (11 real projects with case studies)
- 👥 Team profiles and client testimonials
- 📧 Contact form with email integration
- 🎭 GTA-inspired cyberpunk design aesthetic
- ⚡ High-performance animations and interactions

---

## Technologies Used

This project is built with:

- **Vite** - Next-generation build tool
- **TypeScript** - Type-safe JavaScript
- **React 18.3.1** - UI framework
- **Tailwind CSS** - Utility-first CSS
- **shadcn-ui** - High-quality UI components
- **Framer Motion** - Advanced animations
- **React Router v6** - Client-side routing
- **Nodemailer** - Email service
- **Express.js** - Backend API

---

## Quick Start

### Prerequisites
- Node.js & npm (recommended: nvm)

### Installation

```bash
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to project directory
cd netcraft-city-lights

# Step 3: Install dependencies
npm install

# Step 4: Start development server
npm run dev
```

The application will be available at `http://localhost:8080/`

---

## Email Setup - Complete Guide

### Step 1: Get Gmail App Password

1. Go to your Gmail account: https://myaccount.google.com
2. Click on **Security** in the left menu
3. Enable **2-Step Verification** (if not already enabled)
4. After enabling 2-Step, look for **App passwords** option
5. Select **Mail** and **Windows Computer**
6. Google will generate a 16-character password
7. Copy this password (without spaces)

### Step 2: Configure .env File

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000
EMAIL_USER=Your Gmail I'd
EMAIL_PASSWORD=Your Gmail App Password
PORT=5000
```

**Replace `EMAIL_PASSWORD` with your actual Gmail app password**

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Run the Application

**Start the frontend dev server:**
```bash
npm run dev
```

The application will start at `http://localhost:8080/`

### Step 5: Test the Contact Form

1. Navigate to: `http://localhost:8080/contact`
2. Fill in all fields:
   - Name: Your name
   - Email: Your email
   - Phone: Your phone number
   - Subject: Test subject
   - Message: Test message
3. Click **Send Message**
4. You should receive confirmation emails

### Email Features

✅ **Contact form sends emails to admin** (Your Gmail ID)
✅ **Confirmation email sent to user**
✅ **Phone number field included**
✅ **Form validation on frontend**
✅ **Loading state during email sending**
✅ **Toast notifications for success/error**
✅ **Works locally with Vite middleware**
✅ **Compatible with Vercel deployment**

### How Email Works Locally

- **Frontend** sends POST request to `/api/send-email`
- **Vite middleware** intercepts the request
- **Nodemailer** sends emails via Gmail SMTP
- **Response** is returned to frontend
- **Toast notification** displays result to user

### Troubleshooting Email Issues

#### Issue: "Failed to send email"

**Check 1: Is .env file configured?**
```bash
# Verify .env file exists in root directory
# Should contain EMAIL_USER and EMAIL_PASSWORD
```

**Check 2: Is EMAIL_PASSWORD correct?**
- Must be Gmail **App Password** (16 characters)
- NOT your regular Gmail password
- Obtained from Google Account Settings

**Check 3: Check browser console for errors**
- Open DevTools (F12)
- Go to Console tab
- Look for error messages

**Check 4: Verify 2-Factor Authentication is enabled**
- Gmail App Passwords only work with 2FA enabled
- Go to https://myaccount.google.com/security

#### Issue: "Gmail connection error"

This means the EMAIL_PASSWORD is incorrect:
1. Re-generate the app password from Google
2. Copy without spaces
3. Update `.env` file
4. Restart dev server

#### Issue: Port already in use

Change PORT in `.env`:
```env
PORT=5001
```

Then update VITE_API_URL:
```env
VITE_API_URL=http://localhost:5001
```

### Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |
| `EMAIL_USER` | Gmail email address | Yes |
| `EMAIL_PASSWORD` | Gmail app password | Yes |
| `PORT` | Backend server port | No (default: 5000) |

### Files Related to Email

- `vite.config.ts` - Email middleware plugin
- `api/send-email.ts` - Vercel serverless function
- `src/pages/Contact.tsx` - Contact form component
- `.env` - Environment variables (create from above)

---

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

### Project Structure

```
netcraft-city-lights/
├── src/
│   ├── pages/
│   │   ├── Index.tsx           # Home page
│   │   ├── About.tsx           # About page
│   │   ├── Services.tsx        # Services listing (9 services)
│   │   ├── ServiceDetail.tsx   # Service detail pages
│   │   ├── Portfolio.tsx       # Portfolio showcase (11 projects)
│   │   ├── Contact.tsx         # Contact form
│   │   └── NotFound.tsx        # 404 page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navigation.tsx  # Header navigation
│   │   │   └── Footer.tsx      # Footer
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   └── PreviewSection.tsx
│   │   ├── NavLink.tsx
│   │   └── ui/                 # shadcn-ui components
│   ├── hooks/
│   ├── lib/
│   ├── assets/                 # Images and media
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # React entry point
│   └── index.css               # Global styles
├── public/
│   └── portfolio/              # Portfolio project images
├── api/
│   └── send-email.ts          # Vercel email function
├── vite.config.ts             # Vite configuration
├── tailwind.config.ts         # Tailwind CSS config
├── package.json               # Dependencies
├── .env                       # Environment variables
├── .env.example               # Example config
└── README.md                  # This file
```

---

## Services (9 Total)

1. **Web Development** - Full-stack web applications
2. **App Development** - iOS & Android mobile applications
3. **UI/UX Design** - User interface & experience design
4. **Website Restructuring** - Legacy site modernization
5. **Product Development** - End-to-end product creation
6. **Automation Solutions** - Business process automation
7. **Internet of Things** - IoT device integration
8. **Data Digitalization** - Digital transformation
9. **Desktop Application** - Cross-platform desktop apps

Each service has:
- Detailed description and features
- Real use cases
- Key benefits
- Technology stack
- Feature highlights

---

## Portfolio Projects (11 Total)

The portfolio showcases 11 real projects across multiple categories:

### Web Projects
- Fine Management System
- Employee Attendance System
- Event Registration Platform
- Campus Navigation Map

### Mobile Projects
- Student QR Attendance System

### E-commerce Projects
- E-Commerce Platform
- Uzhavar Connect (Agricultural)
- Amirdha Stickers (Creative)

### Travel
- Sastha Travels

### Management & Desktop
- Billing System (Desktop)
- Accounting System

Each project includes:
- Live preview images
- Full project description
- Key features list
- Technologies used
- Real client information
- Year completed
- Links to live project (when available)

---

## Deployment

### Deploy to Vercel

1. **Push code to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository

3. **Set Environment Variables**
   - `EMAIL_USER` = your Gmail ID
   - `EMAIL_PASSWORD` = your Gmail app password

4. **Deploy**
   - Click Deploy button
   - Vercel will build and deploy automatically

Your site will be live at: `https://your-project.vercel.app`

### Production Build

```bash
npm run build
npm run preview
```

---

## Design System

### Colors (GTA Cyberpunk Theme)
- **Primary (Purple)**: Interactive elements, highlights
- **Secondary (Cyan)**: Accents, secondary elements
- **Accent (Pink)**: Highlights, CTAs
- **Dark Background**: Noir aesthetic

### Typography
- **Display Font**: Bold, uppercase for headings
- **Body Font**: Clean, readable for content
- **Neon Effects**: Glowing text on dark background

### Components
- **GTA Cards**: Glassmorphic cards with neon borders
- **Neon Buttons**: High-contrast, animated buttons
- **Scanlines**: Retro screen effect overlay
- **Animations**: Smooth Framer Motion transitions

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Performance Optimizations

✅ **Lazy Loading** - Components load on demand
✅ **Code Splitting** - Smaller bundle sizes
✅ **Image Optimization** - Compressed assets
✅ **CSS Minification** - Optimized styles
✅ **Tree Shaking** - Unused code removed
✅ **Caching** - Service worker integration ready

---

## How to Edit This Code

### Use Your IDE Locally

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project
cd netcraft-city-lights

# Install dependencies
npm install

# Start development server
npm run dev
```

### Use GitHub Web Editor
1. Navigate to the file in GitHub
2. Click the pencil icon (Edit)
3. Make changes and commit

### Use GitHub Codespaces
1. Click "Code" button on GitHub
2. Select "Codespaces" tab
3. Click "New codespace"
4. Edit files and commit changes

---

## Common Tasks

### Add a New Service

Edit `src/pages/ServiceDetail.tsx` and add to the services array:

```typescript
{
  id: 10,
  title: "New Service",
  // ... other fields
}
```

Then update `src/pages/Services.tsx` to include the new service card.

### Add a Portfolio Project

Edit `src/pages/Portfolio.tsx` and add to the projects array:

```typescript
{
  id: 12,
  title: "Project Name",
  category: "Category",
  // ... other fields
}
```

### Customize Colors

Edit `src/index.css` CSS variables section:

```css
:root {
  --primary: 280 100% 60%;
  --secondary: 180 100% 50%;
  /* ... */
}
```

### Update Contact Email

Edit `.env`:
```env
EMAIL_USER=new-email@gmail.com
```

---

## Support & Troubleshooting

### Check Logs
```bash
# Frontend errors appear in browser console
# Backend errors appear in terminal

# Check for build errors
npm run build
```

### Clear Cache
```bash
# Clear node modules and reinstall
rm -r node_modules
npm install
```

### Update Dependencies
```bash
npm update
```

---

## License

All rights reserved © 2024 NetCraft Studio

---

## Contact

**Email**: Your Email Address
**Phone**: Your Contact Number
**Location**: Your Address

---

## Credits

Built with:
- Vite team for the build tool
- React team for the framework
- shadcn/ui for components
- Tailwind Labs for CSS framework
- Framer Motion for animations

---

**Last Updated**: January 23, 2026
**Version**: 1.0.0
