#!/bin/bash

echo "🚀 Starting TenderBot build process..."

# Navigate to client directory
cd client

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building React application..."
npm run build

echo "✅ Build completed successfully!" 