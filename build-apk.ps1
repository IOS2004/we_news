# WeNews APK Build Script
# Run this script to build your APK using EAS

Write-Host "🚀 Building WeNews APK using EAS..." -ForegroundColor Green

# Step 1: Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Step 2: Login to Expo (you'll need to create an account)
Write-Host "🔐 Please login to your Expo account..." -ForegroundColor Yellow
Write-Host "If you don't have an account, create one at https://expo.dev" -ForegroundColor Cyan
npx eas login

# Step 3: Configure EAS build
Write-Host "⚙️ Configuring EAS build..." -ForegroundColor Yellow
npx eas build:configure

# Step 4: Build the APK
Write-Host "🔨 Building APK... This will take 10-20 minutes..." -ForegroundColor Yellow
npx eas build --platform android --profile preview

Write-Host "✅ Build started! Check your Expo dashboard for progress." -ForegroundColor Green
Write-Host "📧 You'll receive an email with the download link when ready." -ForegroundColor Green
Write-Host "🌐 Dashboard: https://expo.dev" -ForegroundColor Cyan
