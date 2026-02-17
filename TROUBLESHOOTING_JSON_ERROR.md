# JSON Data Fetching Errors - Troubleshooting Guide

## Problem
```
Error fetching data: SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON
```

This error means the API is returning **HTML** (an error page) instead of JSON data.

## Root Causes (in order of likelihood)

### 1. ⚠️ Backend is NOT Deployed (Most Common)
Your backend (`server.js`) is only running locally but your frontend is on Vercel.

**Check:** Visit the following URLs directly in your browser:
- ✅ **Working:** `https://your-backend-domain.com/api/health` returns `{"status":"ok",...}`
- ❌ **Not working:** Shows error page or "connection refused"

**Solution:** Deploy your backend to Render/Railway/Repl.it

---

### 2. ❌ Wrong VITE_API_URL on Vercel

**Check what URL is set on Vercel:**
1. Dashboard → Your Project → Settings → Environment Variables
2. Look for `VITE_API_URL`

**Common mistakes:**
```
❌ WRONG:   https://localhost:5000        (can't reach your computer from Vercel)
❌ WRONG:   https://example.com/          (has trailing slash)
✅ CORRECT: https://api.example.com       (points to deployed backend, no trailing slash)
```

**Solution:** Set to your actual backend URL without trailing slash

---

### 3. 🔒 Frontend and Backend Origins Don't Match CORS

**Check browser console for CORS error:**
```
Access to fetch at 'https://backend.com/api/projects' from origin 'https://www.example.com' 
has been blocked by CORS policy
```

**Solution:** The backend's `allowedOrigins` in `server.js` must include your frontend URL:

```javascript
const allowedOrigins = [
  'https://www.netcraftstudios.org',      // Your domain
  'https://netcraftstudio.vercel.app',    // Vercel URL
];
```

---

### 4. 🌐 Backend is Offline or Crashed

**Test if backend is responding:**
```bash
# From your terminal
curl https://your-backend-domain.com/api/health

# Should return:
# {"status":"ok","timestamp":"2026-02-17T..."}
```

If it doesn't respond:
- Backend crashed - restart it
- Backend host is down - check Render/Railway dashboard
- Firewall is blocking - check hosting provider settings

---

## Step-by-Step Fix

### Step 1: Verify Backend is Deployed
```bash
# Get your backend URL from Render/Railway/wherever it's deployed
# Then test it

curl https://YOUR-BACKEND-URL.com/api/health
# Should return JSON, not HTML
```

### Step 2: Update Vercel Environment Variable
1. Go to Vercel Dashboard
2. Your Project → Settings → Environment Variables
3. **VITE_API_URL** = `https://YOUR-BACKEND-URL.com` (NO trailing slash!)
4. Example: `https://netcraft-backend.onrender.com`

### Step 3: Redeploy Frontend on Vercel
```bash
# Either:
# A) Commit & push code (auto-triggers deploy), or
# B) Go to Vercel Dashboard and click "Redeploy"
```

### Step 4: Verify It Works
Open browser console on your website and run:
```javascript
fetch('https://YOUR-BACKEND-URL.com/api/health')
  .then(r => r.json())
  .then(data => console.log('✅ Backend working!', data))
  .catch(e => console.error('❌ Backend error:', e))
```

Should print: `✅ Backend working!`

---

## Backend Deployment Options

### Option A: Render (Recommended)
1. Go to https://render.com
2. Create New → Web Service
3. Connect GitHub repo
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. Add Environment Variables (copy from `.env`)
7. Deploy
8. Copy Render URL → Set as `VITE_API_URL` on Vercel

### Option B: Railway
1. Go to https://railway.app
2. Create New Project → Deploy from GitHub
3. Select your repository
4. Add Environment Variables
5. Deploy
6. Copy Railway URL → Set as `VITE_API_URL`

### Option C: Replit
1. Go to https://replit.com
2. Create New → Import from GitHub
3. Select your repository
4. Run
5. Replit gives you a URL → Set as `VITE_API_URL`

---

## Complete Checklist

- [ ] Backend is deployed and returns `{"status":"ok"}` at `/api/health`
- [ ] `VITE_API_URL` on Vercel is set to backend URL WITHOUT trailing slash
- [ ] Frontend has been redeployed on Vercel after setting `VITE_API_URL`
- [ ] Backend's `allowedOrigins` includes your frontend URLs
- [ ] Database (Supabase) connection is working on backend
- [ ] Portfolio page no longer shows "Error fetching data"

---

## Debug Logs

Check these files for more details:

**Frontend (in browser console):**
- Open DevTools → Console tab
- Should see: `Fetching from API: https://your-backend-url.com`
- Look for JSON responses or HTML error pages

**Backend (if running locally):**
```bash
npm start
# Should show:
# > Server running on port 5000
# > Gmail connection successful
# > Database initialized
```

---

## Still Having Issues?

### 1. Check if page is loading HTML error
In browser, right-click → View Page Source
- Look for `<!doctype html>` - if it's there, API is broken
- Look for JSON - if it's there, it's working

### 2. Check Vercel deployment logs
1. Vercel Dashboard → Your Project → Deployments
2. Click latest deployment → View Build Logs
3. Look for errors

### 3. Check Render/Railway logs
1. Go to your backend hosting provider dashboard
2. Look for runtime/build errors
3. Check environment variables are set

### 4. Test locally first
```bash
# In project folder:
npm start                    # Terminal 1 - backend on port 5000
npm run dev                  # Terminal 2 - frontend on port 5173

# Frontend should connect to http://localhost:5000
# Open http://localhost:5173 in browser
```

If it works locally but not on Vercel, problem is definitely the deployment strategy.
