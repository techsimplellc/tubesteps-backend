# Backend Proxy - Quick Start Guide

## What Changed?

The extension now uses a **backend proxy server** to communicate with Abacus AI. This solves the CORS issue and provides better security.

**Architecture:**
```
Chrome Extension → Your Backend Server → Abacus AI API
```

---

## Quick Setup (5 Minutes)

### Step 1: Create Backend Folder

```bash
mkdir tubesteps-backend
cd tubesteps-backend
```

### Step 2: Create Files

Create these 3 files:

**1. server.js** - Copy from artifact above

**2. package.json** - Copy from artifact above

**3. .env** - Create with:
```bash
PORT=3000
NODE_ENV=development
```

### Step 3: Install & Run

```bash
# Install dependencies
npm install

# Run locally
npm start
```

Server will start at `http://localhost:3000`

### Step 4: Test Backend

```bash
# Health check
curl http://localhost:3000/health
```

Should return: `{"status":"ok","timestamp":"..."}`

---

## Configure Extension

### Step 1: Update Extension Settings

1. Reload extension at `chrome://extensions/`
2. Click TubeSteps extension icon
3. Click "⚙️ Configure API Key"
4. Enter your settings:
   - **Abacus AI API Key:** Your key from abacus.ai
   - **Backend Server URL:** `http://localhost:3000`
5. Click "Test Connection"
6. Click "Save Settings"

### Step 2: Test Full Flow

1. Go to any YouTube video with captions
2. Click extension icon
3. Click "Extract Instructions"
4. Should work! 🎉

---

## Deploy to Production (Railway - Easiest)

### Why Railway?
- ✅ Free $5/month credit
- ✅ Auto-deploys from GitHub
- ✅ Easy setup
- ✅ Built-in monitoring

### Steps:

**1. Push to GitHub**

```bash
cd tubesteps-backend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

**2. Deploy to Railway**

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `tubesteps-backend` repo
6. Railway auto-detects Node.js and deploys!

**3. Get Your URL**

- Railway provides a URL like: `https://tubesteps-backend-production.up.railway.app`
- Copy this URL

**4. Update Extension**

1. Open extension options
2. Update **Backend Server URL** to your Railway URL
3. Click "Test Connection"
4. Click "Save Settings"

**5. Done!** Your extension now works with the deployed backend! 🚀

---

## Local Development Workflow

### Terminal 1: Run Backend
```bash
cd tubesteps-backend
npm start
```

### Terminal 2: Test Extension
```bash
# Reload extension at chrome://extensions/
# Then test on YouTube videos
```

### Making Changes

**Backend Changes:**
1. Edit `server.js`
2. Restart server (Ctrl+C, then `npm start`)
3. Test extension

**Extension Changes:**
1. Edit extension files
2. Reload at `chrome://extensions/`
3. Test

---

## Troubleshooting

### "Cannot connect to backend"

**Check:**
- Is backend running? (`curl http://localhost:3000/health`)
- Is URL correct in extension settings?
- Check browser console for errors

**Fix:**
```bash
# Restart backend
cd tubesteps-backend
npm start
```

### "API key is invalid"

**Check:**
- Is your Abacus AI key correct?
- Does your Abacus AI account have credits?
- Check backend logs for errors

**Fix:**
- Get new API key from abacus.ai
- Update in extension settings

### "Too many requests"

**Cause:** Rate limit hit (20 requests per 5 minutes)

**Fix:**
- Wait 5 minutes
- Or adjust rate limit in `server.js`

### Backend crashes on Railway

**Check Railway logs:**
1. Go to Railway dashboard
2. Click your project
3. Click "Deployments"
4. View logs

**Common issues:**
- Missing `package.json`
- Wrong Node.js version
- Environment variables not set

---

## Security Notes

### Current Setup:
- ✅ API keys sent from extension to backend (over HTTPS in production)
- ✅ Backend validates and sanitizes inputs
- ✅ Rate limiting prevents abuse
- ✅ CORS configured for chrome-extension:// origins

### For Production:
- Deploy backend with HTTPS (Railway does this automatically)
- Keep backend URL private (don't share publicly)
- Monitor backend logs for unusual activity
- Set rate limits appropriate for your usage

---

## Cost Breakdown

### Development (Free)
- Local backend: Free
- Extension: Free
- Testing: Free

### Production

**Backend Hosting:**
- Railway: $5/month credit (free tier)
- Vercel: Free (serverless)
- Heroku: $7/month
- DigitalOcean: $5/month

**Abacus AI:**
- ChatLLM subscription: $10/month
- Includes API access + 20K credits
- Each video ~50-200 credits
- ~100-400 videos per month

**Total:** ~$10-15/month for moderate use

---

## Next Steps

1. ✅ Backend running locally
2. ✅ Extension working with local backend
3. ⬜ Deploy backend to Railway
4. ⬜ Update extension with production URL
5. ⬜ Test thoroughly
6. ⬜ Publish to Chrome Web Store

---

## Support

**Backend Issues:**
- Check `server.js` logs
- Test with curl
- Check Railway deployment logs

**Extension Issues:**
- Check browser console
- Reload extension
- Check Chrome DevTools

**Need Help?**
- Backend logs show detailed error messages
- Browser console shows network errors
- Railway dashboard shows deployment status

---

## Summary

✅ **Backend proxy solves CORS issue**  
✅ **Easy local development**  
✅ **Simple Railway deployment**  
✅ **Better security**  
✅ **Production ready**

Your extension is now production-ready with a proper backend architecture!
