#!/bin/bash

# WeNews APK Build Script
# Run this script to build your APK using EAS

echo "🚀 Building WeNews APK using EAS..."

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Login to Expo (you'll need to create an account)
echo "🔐 Please login to your Expo account..."
echo "If you don't have an account, create one at https://expo.dev"
npx eas login

# Step 3: Configure EAS build
echo "⚙️ Configuring EAS build..."
npx eas build:configure

# Step 4: Build the APK
echo "🔨 Building APK... This will take 10-20 minutes..."
npx eas build --platform android --profile preview

echo "✅ Build started! Check your Expo dashboard for progress."
echo "📧 You'll receive an email with the download link when ready."
echo "🌐 Dashboard: https://expo.dev"
