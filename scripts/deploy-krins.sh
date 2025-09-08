#!/bin/bash

# 🌊 Krins.dev Deployment Script
# Deploy Krins Code-koordinering to production

echo "🚀 Starting Krins.dev deployment..."

# Navigate to frontend directory
cd src/dev

# Build for production
echo "📦 Building for production..."
npm run build

# Check if build succeeded
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Stopping deployment."
    exit 1
fi

# Deploy to Vercel
echo "🌊 Deploying to Vercel..."
vercel --prod --yes

# Check if deployment succeeded  
if [ $? -eq 0 ]; then
    echo "🎉 Deployment successful!"
    echo ""
    echo "Next steps:"
    echo "1. Go to https://vercel.com/dashboard"
    echo "2. Add custom domain: krins.dev"  
    echo "3. Configure DNS records as described in DEPLOYMENT.md"
    echo ""
    echo "🌍 Your site will be live at: https://krins.dev"
else
    echo "❌ Deployment failed!"
    echo "Make sure you're logged in with: vercel login"
    exit 1
fi