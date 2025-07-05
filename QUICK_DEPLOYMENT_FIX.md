# 🚨 Quick Fix for Connection Error

## Current Issue
Your frontend is trying to connect to `localhost:8000` but the backend server is not running in production.

## Solution Options

### Option 1: Deploy Backend to Render (Recommended - Free)

1. **Go to Render**: https://render.com
2. **Sign up/Login** with GitHub
3. **New Web Service** → Connect your `tender_analizer` repository
4. **Configure Service**:
   - Name: `tenderbot-backend`
   - Root Directory: `server`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Environment Variables**:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `NODE_ENV`: `production`
6. **Deploy** and copy the URL (e.g., `https://your-app.onrender.com`)

### Option 2: Deploy Backend to Railway (Alternative - Free)

1. **Go to Railway**: https://railway.app
2. **Sign up/Login** with GitHub
3. **New Project** → Deploy from GitHub repo
4. **Configure Service**:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Environment Variables**:
   - `GEMINI_API_KEY`: Your Google Gemini API key
6. **Deploy** and copy the URL

### Option 3: Deploy Backend to Vercel (Alternative)

1. **Go to Vercel**: https://vercel.com
2. **New Project** → Import your repository
3. **Configure**:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Output Directory: `server`
4. **Environment Variables**:
   - `GEMINI_API_KEY`: Your Google Gemini API key
5. **Deploy** and copy the URL

## Update Frontend Configuration

After deploying the backend, update your frontend environment:

### For Vercel Frontend:

1. **Go to your Vercel project dashboard**
2. **Settings** → **Environment Variables**
3. **Add Variable**:
   - Name: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.com` (use the URL from step above)
4. **Redeploy** your frontend

### For Local Development:

Update `client/.env.development`:
```env
REACT_APP_API_URL=http://localhost:8000
```

### For Production:

Update `client/.env.production`:
```env
REACT_APP_API_URL=https://your-backend-url.com
```

## Test the Fix

1. **Check backend health**: Visit your backend URL to see "TenderBot API is running!"
2. **Test frontend**: Try uploading documents again
3. **Check console**: Look for the new API URL in browser console

## Common Issues

### CORS Error
If you get CORS errors, update `server/index.js`:
```javascript
app.use(cors({
  origin: ['https://your-frontend-url.vercel.app', 'http://localhost:3000']
}));
```

### Environment Variable Not Working
- Make sure to redeploy after adding environment variables
- Check that the variable name is exactly `REACT_APP_API_URL`
- Verify the backend URL is accessible

### Backend Not Starting
- Check that `GEMINI_API_KEY` is set correctly
- Verify all dependencies are installed
- Check the deployment logs for errors

## Quick Test Commands

```bash
# Test backend locally
cd server
npm install
npm start

# Test frontend locally
cd client
npm install
npm start
```

## Need Help?

1. Check the deployment platform's logs
2. Verify your Google Gemini API key is valid
3. Test the backend URL directly in browser
4. Check browser console for detailed error messages 