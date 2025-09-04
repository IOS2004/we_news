# WeNews Fast APK Build - Alternative Methods
# Choose your preferred method to avoid EAS queue

Write-Host "🚀 WeNews Fast APK Build Options" -ForegroundColor Green
Write-Host "Choose your preferred method:" -ForegroundColor Yellow

Write-Host ""
Write-Host "1️⃣  LOCAL BUILD (Fastest - 2-5 minutes)" -ForegroundColor Cyan
Write-Host "2️⃣  EXPO TURTLE CLI (Medium - 10-15 minutes)" -ForegroundColor Cyan  
Write-Host "3️⃣  GITHUB ACTIONS (Free - 15-20 minutes)" -ForegroundColor Cyan
Write-Host "4️⃣  DOCKER BUILD (Advanced - 10-20 minutes)" -ForegroundColor Cyan

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        # LOCAL BUILD
        Write-Host "🔧 Starting Local Build..." -ForegroundColor Green
        
        # Install dependencies
        npm install
        
        # Prebuild
        npx expo prebuild --platform android --clear
        
        # Build APK
        Set-Location android
        .\gradlew.bat assembleRelease
        Set-Location ..
        
        $apkPath = "android\app\build\outputs\apk\release\app-release.apk"
        if (Test-Path $apkPath) {
            Write-Host "✅ Local build complete!" -ForegroundColor Green
            explorer "android\app\build\outputs\apk\release\"
        }
    }
    
    "2" {
        # TURTLE CLI BUILD
        Write-Host "🐢 Starting Turtle CLI Build..." -ForegroundColor Green
        
        # Install turtle-cli
        npm install -g turtle-cli
        
        # Setup turtle
        turtle setup:android
        
        # Build APK
        turtle build:android --platform android --type apk
        
        Write-Host "✅ Turtle build started!" -ForegroundColor Green
    }
    
    "3" {
        # GITHUB ACTIONS
        Write-Host "🐙 Setting up GitHub Actions..." -ForegroundColor Green
        
        # Create .github/workflows directory
        New-Item -ItemType Directory -Path ".github\workflows" -Force
        
        # Create workflow file
        @"
name: Build APK

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Setup Java
      uses: actions/setup-java@v3
      with:
        distribution: 'temurin'
        java-version: '17'
        
    - name: Install dependencies
      run: npm install
      
    - name: Prebuild
      run: npx expo prebuild --platform android
      
    - name: Build APK
      run: |
        cd android
        ./gradlew assembleRelease
        
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: app-release
        path: android/app/build/outputs/apk/release/app-release.apk
"@ | Out-File -FilePath ".github\workflows\build-apk.yml" -Encoding UTF8
        
        Write-Host "✅ GitHub Actions workflow created!" -ForegroundColor Green
        Write-Host "📤 Push to GitHub to trigger build" -ForegroundColor Yellow
    }
    
    "4" {
        # DOCKER BUILD
        Write-Host "🐳 Setting up Docker Build..." -ForegroundColor Green
        
        # Create Dockerfile
        @"
FROM node:18

# Install Java and Android SDK
RUN apt-get update && apt-get install -y openjdk-17-jdk wget unzip

# Setup Android SDK
ENV ANDROID_HOME=/opt/android-sdk
RUN mkdir -p `$ANDROID_HOME
RUN wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip
RUN unzip commandlinetools-linux-9477386_latest.zip -d `$ANDROID_HOME/cmdline-tools
RUN mv `$ANDROID_HOME/cmdline-tools/cmdline-tools `$ANDROID_HOME/cmdline-tools/latest

ENV PATH=`$PATH:`$ANDROID_HOME/cmdline-tools/latest/bin:`$ANDROID_HOME/platform-tools

# Install SDK packages
RUN yes | sdkmanager --install "platform-tools" "platforms;android-33" "build-tools;33.0.0"

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npx expo prebuild --platform android
RUN cd android && ./gradlew assembleRelease

CMD ["echo", "APK built successfully"]
"@ | Out-File -FilePath "Dockerfile" -Encoding UTF8

        Write-Host "✅ Dockerfile created!" -ForegroundColor Green
        Write-Host "🔨 Run: docker build -t wenews-apk ." -ForegroundColor Yellow
    }
    
    default {
        Write-Host "❌ Invalid choice. Please run the script again." -ForegroundColor Red
    }
}
