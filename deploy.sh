#!/bin/bash

echo "🚀 TenderBot Deployment Script"
echo "=============================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Please run 'git init' first."
    exit 1
fi

# Check if we have commits
if ! git rev-parse HEAD >/dev/null 2>&1; then
    echo "❌ No commits found. Please commit your changes first."
    exit 1
fi

echo "✅ Git repository is ready"

# Check if remote is set
if ! git remote get-url origin >/dev/null 2>&1; then
    echo ""
    echo "📝 To create a new GitHub repository:"
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: tenderbot"
    echo "3. Make it Public or Private (your choice)"
    echo "4. Don't initialize with README (we already have one)"
    echo "5. Click 'Create repository'"
    echo ""
    echo "After creating the repository, run:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/tenderbot.git"
    echo "git branch -M main"
    echo "git push -u origin main"
    echo ""
    echo "Replace YOUR_USERNAME with your actual GitHub username"
else
    echo "✅ Remote origin is already configured"
    echo "Current remote URL: $(git remote get-url origin)"
    echo ""
    echo "To push to GitHub, run:"
    echo "git push -u origin main"
fi

echo ""
echo "🎉 TenderBot is ready for deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Create GitHub repository (if not done)"
echo "2. Add remote origin"
echo "3. Push to GitHub"
echo "4. Deploy to your preferred hosting platform"
echo ""
echo "🌐 Deployment options:"
echo "- Frontend: Vercel, Netlify, or GitHub Pages"
echo "- Backend: Render, Railway, or Heroku"
echo ""
echo "🔧 Environment variables needed for deployment:"
echo "- GEMINI_API_KEY: Your Google Gemini API key"
echo "- PORT: Server port (optional, defaults to 8000)" 