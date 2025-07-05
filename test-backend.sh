#!/bin/bash

echo "🧪 TenderBot Backend Test Script"
echo "================================"

# Check if backend URL is provided
if [ -z "$1" ]; then
    echo "❌ Please provide your backend URL"
    echo "Usage: ./test-backend.sh https://your-backend-url.com"
    echo ""
    echo "Example: ./test-backend.sh https://tenderbot-backend.onrender.com"
    exit 1
fi

BACKEND_URL=$1

echo "🔗 Testing backend at: $BACKEND_URL"
echo ""

# Test health endpoint
echo "📊 Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s "$BACKEND_URL/health")
if [ $? -eq 0 ]; then
    echo "✅ Health check passed"
    echo "Response: $HEALTH_RESPONSE"
else
    echo "❌ Health check failed"
    echo "Make sure your backend is running and accessible"
fi

echo ""

# Test main endpoint
echo "🏠 Testing main endpoint..."
MAIN_RESPONSE=$(curl -s "$BACKEND_URL/")
if [ $? -eq 0 ]; then
    echo "✅ Main endpoint working"
    echo "Response: $MAIN_RESPONSE"
else
    echo "❌ Main endpoint failed"
fi

echo ""

# Test CORS
echo "🌐 Testing CORS..."
CORS_RESPONSE=$(curl -s -H "Origin: https://tenderbot.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS "$BACKEND_URL/api/analyze")
if [ $? -eq 0 ]; then
    echo "✅ CORS test passed"
else
    echo "❌ CORS test failed"
    echo "You may need to update CORS configuration"
fi

echo ""
echo "🎯 Next steps:"
echo "1. If all tests pass, your backend is ready"
echo "2. Update your frontend with: REACT_APP_API_URL=$BACKEND_URL"
echo "3. Redeploy your frontend"
echo ""
echo "🔧 If tests fail:"
echo "- Check your backend deployment logs"
echo "- Verify environment variables are set"
echo "- Ensure the URL is correct and accessible" 