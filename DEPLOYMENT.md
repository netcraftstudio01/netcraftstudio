# NetCraft Website - Production Deployment Guide

## CORS Error Fix

**Error:** `Access to fetch at 'https://netcraftstudio.vercel.app//api/projects' from origin 'https://www.netcraftstudios.org' has been blocked by CORS policy`

### Root Causes:
1. Backend CORS headers not allowing your production domain
2. Double slash in API URL (`//api/` instead of `/api/`)
3. Backend not deployed or not accessible from production

### Solution:

#### Step 1: Update Backend CORS Configuration
The `server.js` has been updated with explicit CORS allowlist:

```javascript
const allowedOrigins = [
  'http://localhost:5173',           // Dev
  'http://localhost:3000',           // Alt dev
  'https://www.netcraftstudios.org', // Your domain
  'https://netcraftstudio.vercel.app', // Vercel frontend
];
```

**To add more origins**, edit `server.js` lines 28-33 and redeploy.

#### Step 2: Fix API URL (Remove Trailing Slash)
**IMPORTANT:** API URLs must NOT have trailing slashes

- ✅ CORRECT: `https://backend-url.com`
- ❌ WRONG: `https://backend-url.com/` (causes `//api/` double slash)

**Set on Vercel:**
```
VITE_API_URL=https://netcraftstudio.vercel.app
```

NOT:
```
VITE_API_URL=https://netcraftstudio.vercel.app/
```

#### Step 3: Deploy Backend

If your backend is NOT deployed yet, it needs to be hosted somewhere:

**Option A: Deploy to Vercel (Recommended)**
```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

**Option B: Deploy to Render**
1. Push code to GitHub
2. Go to https://render.com
3. Create New > Web Service
4. Connect GitHub repository
5. Set Start Command: `npm start`
6. Add Environment Variables (all from `.env`)
7. Deploy

**Option C: Deploy to Railway**
1. Go to https://railway.app
2. Create New Project > Deploy from GitHub
3. Connect repository
4. Add Environment Variables
5. Deploy

### Complete Step-by-Step Deployment

#### 1. Prepare Code
```bash
# Ensure all changes are committed
git add .
git commit -m "fix: Update CORS configuration for production"
git push origin main
```

#### 2. Update Production Environment Variables

**On Vercel (Frontend):**
1. Dashboard → Your Project → Settings → Environment Variables
2. Add/Update:
   ```
   VITE_API_URL=https://YOUR-BACKEND-URL.COM
   EMAIL_USER=netcraftstudio01@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   DB_HOST=your-project.pooler.supabase.com
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres.xxxxx
   DB_PASSWORD=your-password
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   CLOUDINARY_CLOUD_NAME=netcraft-studio
   CLOUDINARY_API_KEY=your-key
   CLOUDINARY_API_SECRET=your-secret
   ```

**On Backend Host (Render/Railway):**
- Add same environment variables

#### 3. Redeploy
- **Vercel**: Automatic redeploy on push, or manual from Dashboard
- **Render/Railway**: Automatic redeploy on GitHub push

#### 4. Test CORS
After deployment, test that CORS is working:

```bash
# From browser console on https://www.netcraftstudios.org
fetch('https://YOUR-BACKEND-URL.COM/api/health')
  .then(r => r.json())
  .then(data => console.log('✅ CORS works!', data))
  .catch(e => console.error('❌ CORS failed:', e))
```

Expected response: `{"status": "ok"}`

## Architecture Clarification

**Your Current Setup:**
```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT SIDE                              │
│  https://www.netcraftstudios.org (custom domain)            │
│  OR https://netcraftstudio.vercel.app (Vercel URL)         │
│                    (React App)                              │
│     Built with Vite, deployed on Vercel                     │
└──────────────────────┬──────────────────────────────────────┘
                       │ CORS requests
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    SERVER SIDE                              │
│  Backend API Server (NOT YET DEPLOYED?)                     │
│     Express.js with routes:                                 │
│       - /api/projects (GET, POST, PUT, DELETE)             │
│       - /api/clients (GET, POST, PUT, DELETE)              │
│       - /api/team (GET, POST, PUT, DELETE)                 │
│       - /api/upload (image upload to Cloudinary)           │
│       - /api/send-email (contact form emails)              │
│                                                             │
│  Connected to:                                              │
│    - Supabase PostgreSQL (database)                         │
│    - Cloudinary (image storage)                             │
│    - Gmail (email service)                                  │
└─────────────────────────────────────────────────────────────┘
```

## Checklist

- [ ] Backend is deployed to production URL
- [ ] Frontend environment variable `VITE_API_URL` does NOT have trailing slash
- [ ] Backend CORS allows your production domain
- [ ] Environment variables are set on all servers
- [ ] Test CORS works: `fetch('https://backend/api/health')`
- [ ] Portfolio page loads data from database
- [ ] Admin panel can upload images
- [ ] Contact form sends emails

## Troubleshooting

### Still getting CORS error?

1. **Check if backend is running:**
   ```bash
   curl https://YOUR-BACKEND-URL/api/health
   ```
   Should return `{"status":"ok"}`

2. **Check API URL format:**
   ```bash
   # Wrong (has trailing slash):
   VITE_API_URL=https://example.com/
   
   # Correct (no trailing slash):
   VITE_API_URL=https://example.com
   ```

3. **Check allowed origins in server.js:**
   Edit `server.js` lines 28-33 to include your exact domain

4. **Check browser console:**
   Note the exact URL being requested - should NOT have `//` double slashes

### Database not connecting?

Set these environment variables on backend server:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- Or Supabase connection string in DATABASE_URL

### Images not uploading?

Check Cloudinary credentials:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Emails not sending?

1. Enable 2-Step Verification on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character password in `EMAIL_PASSWORD`
4. Set `EMAIL_USER` to your Gmail address

## Support

For more details, see:
- [GIT_SETUP.md](./GIT_SETUP.md) - Git and team collaboration
- [BACKEND_SETUP.md](./BACKEND_SETUP.md) - Backend configuration
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Database setup
- [JWT_SETUP.md](./JWT_SETUP.md) - Authentication setup
