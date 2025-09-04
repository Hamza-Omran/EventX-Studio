#!/bin/bash

echo "🚀 EventX Studio - Free Deployment Script"
echo "=========================================="

# Frontend (Vercel)
echo "📦 Step 1: Deploy Frontend to Vercel"
echo "1. Install Vercel CLI: npm install -g vercel"
echo "2. Navigate to frontend folder: cd frontend"
echo "3. Deploy: vercel --prod"
echo "4. Follow Vercel prompts"

# Backend (Railway)
echo "🔧 Step 2: Deploy Backend to Railway"
echo "1. Visit railway.app and sign up"
echo "2. Connect your GitHub repository"
echo "3. Deploy backend folder"
echo "4. Set environment variables in Railway dashboard"

# Database (MongoDB Atlas)
echo "💾 Step 3: Setup MongoDB Atlas"
echo "1. Visit mongodb.com/atlas"
echo "2. Create free cluster"
echo "3. Get connection string"
echo "4. Update environment variables"

echo "✅ Deployment complete! Check deployment-guide.md for detailed instructions."
