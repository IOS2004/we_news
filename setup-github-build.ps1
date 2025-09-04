# GitHub Actions Setup Script
# This will help you push your code and trigger the first build

Write-Host "🚀 Setting up GitHub Actions APK Build..." -ForegroundColor Green

# Check if git is initialized
if (-not (Test-Path ".git")) {
  Write-Host "📝 Initializing Git repository..." -ForegroundColor Yellow
  git init
  git add .
  git commit -m "Initial commit with GitHub Actions APK build workflow"
}
else {
  Write-Host "📝 Git repository already exists" -ForegroundColor Green
}

# Check if remote origin exists
$remoteExists = git remote get-url origin 2>$null
if (-not $remoteExists) {
  Write-Host ""
  Write-Host "🌐 GitHub Repository Setup Required:" -ForegroundColor Cyan
  Write-Host "1. Go to https://github.com/new" -ForegroundColor White
  Write-Host "2. Create a new repository named 'we_news'" -ForegroundColor White
  Write-Host "3. Copy the repository URL (e.g., https://github.com/yourusername/we_news.git)" -ForegroundColor White
  Write-Host ""
    
  $repoUrl = Read-Host "Enter your GitHub repository URL"
    
  if ($repoUrl) {
    Write-Host "🔗 Adding remote origin..." -ForegroundColor Yellow
    git remote add origin $repoUrl
    git branch -M main
        
    Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
    git push -u origin main
        
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "🔨 APK build will start automatically" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📍 Check build progress at:" -ForegroundColor Yellow
    Write-Host "$repoUrl/actions" -ForegroundColor White
        
  }
  else {
    Write-Host "❌ No repository URL provided. Please set up manually." -ForegroundColor Red
  }
}
else {
  Write-Host "🔗 Remote origin already configured: $remoteExists" -ForegroundColor Green
    
  Write-Host "📤 Pushing latest changes..." -ForegroundColor Yellow
  git add .
  git commit -m "Add GitHub Actions build workflow"
  git push
    
  Write-Host "✅ Changes pushed! Build will start automatically." -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 What happens next:" -ForegroundColor Cyan
Write-Host "1. GitHub Actions will build your APK (15-20 min)" -ForegroundColor White
Write-Host "2. Go to your repo → Actions tab to monitor progress" -ForegroundColor White
Write-Host "3. Download APK from Artifacts when build completes" -ForegroundColor White
Write-Host "4. Install APK on your Android device" -ForegroundColor White

Write-Host ""
Write-Host "🎉 GitHub Actions APK build is now set up!" -ForegroundColor Green
