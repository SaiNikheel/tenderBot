# 🚀 TenderBot Deployment Guide

This guide will help you deploy TenderBot to various hosting platforms.

## 📋 Prerequisites

- GitHub account
- Google Gemini API key
- Node.js knowledge (basic)

## 🐙 Step 1: Create GitHub Repository

1. **Go to GitHub**: https://github.com/new
2. **Repository name**: `tenderbot`
3. **Description**: `AI-powered tender document analyzer`
4. **Visibility**: Public or Private (your choice)
5. **Don't initialize** with README (we already have one)
6. **Click "Create repository"**

## 🔗 Step 2: Connect Local Repository

After creating the GitHub repository, run these commands:

```bash
# Add the remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/tenderbot.git

# Set the main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

## 🌐 Step 3: Deploy to Hosting Platforms

### Option A: Vercel (Frontend) + Render (Backend) - Recommended

#### Frontend Deployment (Vercel)

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with GitHub
3. **Import Project** → Select your `tenderbot` repository
4. **Configure Project**:
   - Framework Preset: `Create React App`
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. **Environment Variables**:
   - `REACT_APP_API_URL`: Your backend URL (e.g., `https://your-app.onrender.com`)
6. **Deploy**

#### Backend Deployment (Render)

1. **Go to Render**: https://render.com
2. **Sign up/Login** with GitHub
3. **New Web Service** → Connect your `tenderbot` repository
4. **Configure Service**:
   - Name: `tenderbot-backend`
   - Root Directory: `server`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Environment Variables**:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `NODE_ENV`: `production`
6. **Deploy**

### Option B: Netlify (Frontend) + Railway (Backend)

#### Frontend Deployment (Netlify)

1. **Go to Netlify**: https://netlify.com
2. **Sign up/Login** with GitHub
3. **New site from Git** → Select your repository
4. **Configure Build**:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `build`
5. **Environment Variables**:
   - `REACT_APP_API_URL`: Your backend URL
6. **Deploy**

#### Backend Deployment (Railway)

1. **Go to Railway**: https://railway.app
2. **Sign up/Login** with GitHub
3. **New Project** → Deploy from GitHub repo
4. **Configure Service**:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Environment Variables**:
   - `GEMINI_API_KEY`: Your Google Gemini API key
6. **Deploy**

### Option C: Full Stack Deployment (Render)

1. **Go to Render**: https://render.com
2. **New Web Service** → Connect your repository
3. **Configure Service**:
   - Name: `tenderbot-fullstack`
   - Root Directory: `server`
   - Runtime: `Node`
   - Build Command: `npm install && cd ../client && npm install && npm run build`
   - Start Command: `npm start`
4. **Environment Variables**:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `NODE_ENV`: `production`
5. **Deploy**

## 🔧 Environment Variables

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-url.com
```

### Backend (.env)
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8000
NODE_ENV=production
```

## 📱 Domain Configuration

### Custom Domain (Optional)

1. **Frontend**: Configure custom domain in your hosting platform
2. **Backend**: Update CORS settings in `server/index.js`
3. **Update API URL**: Change `REACT_APP_API_URL` to your custom domain

## 🔒 Security Considerations

1. **API Key Protection**: Never commit `.env` files
2. **CORS Configuration**: Update CORS settings for production
3. **File Upload Limits**: Configure appropriate limits for your hosting
4. **HTTPS**: Ensure all connections use HTTPS

## 🧪 Testing Deployment

1. **Health Check**: Visit your backend URL to see "TenderBot API is running!"
2. **Frontend Test**: Upload test documents and run analysis
3. **API Test**: Test the `/api/analyze` endpoint
4. **Error Handling**: Verify error messages work correctly

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Update CORS configuration in backend
2. **API Key Issues**: Verify environment variables are set correctly
3. **Build Failures**: Check Node.js version compatibility
4. **File Upload Issues**: Verify file size limits and storage

### Debug Commands

```bash
# Check backend logs
# (Use your hosting platform's log viewer)

# Test API locally
curl http://localhost:8000

# Check environment variables
echo $GEMINI_API_KEY
```

## 📊 Monitoring

1. **Uptime Monitoring**: Set up monitoring for your endpoints
2. **Error Tracking**: Configure error tracking (Sentry, etc.)
3. **Performance Monitoring**: Monitor API response times
4. **Usage Analytics**: Track application usage

## 🔄 Continuous Deployment

1. **Automatic Deployments**: Configure your hosting platform for auto-deploy
2. **Branch Deployments**: Set up staging environments
3. **Rollback Strategy**: Plan for quick rollbacks if needed

## 📞 Support

If you encounter issues:

1. Check the hosting platform's documentation
2. Review the application logs
3. Test locally first
4. Create an issue in the GitHub repository

---

**Happy Deploying! 🚀** 