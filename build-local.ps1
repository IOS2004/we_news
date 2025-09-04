# WeNews Local APK Build Script
# This builds locally without EAS queue wait times!

Write-Host "🚀 Building WeNews APK locally (No queue wait!)..." -ForegroundColor Green

# Check if Android SDK is installed
$androidHome = $env:ANDROID_HOME
if (-not $androidHome) {
  Write-Host "❌ ANDROID_HOME not found. Installing Android SDK..." -ForegroundColor Red
    
  # Download and setup Android SDK
  Write-Host "📦 Setting up Android SDK..." -ForegroundColor Yellow
    
  # Create SDK directory
  $sdkPath = "$env:USERPROFILE\Android\Sdk"
  if (-not (Test-Path $sdkPath)) {
    New-Item -ItemType Directory -Path $sdkPath -Force
  }
    
  # Download command line tools
  $toolsUrl = "https://dl.google.com/android/repository/commandlinetools-win-9477386_latest.zip"
  $toolsZip = "$env:TEMP\android-tools.zip"
    
  Write-Host "📥 Downloading Android Command Line Tools..." -ForegroundColor Yellow
  Invoke-WebRequest -Uri $toolsUrl -OutFile $toolsZip
    
  # Extract tools
  Expand-Archive -Path $toolsZip -DestinationPath "$sdkPath\cmdline-tools" -Force
  Move-Item "$sdkPath\cmdline-tools\cmdline-tools" "$sdkPath\cmdline-tools\latest"
    
  # Set environment variables
  $env:ANDROID_HOME = $sdkPath
  $env:PATH += ";$sdkPath\cmdline-tools\latest\bin;$sdkPath\platform-tools"
    
  # Install required packages
  Write-Host "📦 Installing Android SDK packages..." -ForegroundColor Yellow
  & "$sdkPath\cmdline-tools\latest\bin\sdkmanager.bat" --install "platform-tools" "platforms;android-33" "build-tools;33.0.0"
    
  Write-Host "✅ Android SDK setup complete!" -ForegroundColor Green
}

# Step 1: Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Step 2: Prebuild native Android files
Write-Host "🔧 Generating native Android files..." -ForegroundColor Yellow
npx expo prebuild --platform android --clear

# Step 3: Build the APK locally
Write-Host "🔨 Building APK locally... This takes 2-5 minutes..." -ForegroundColor Yellow
cd android

# Build release APK
if (Test-Path ".\gradlew.bat") {
  .\gradlew.bat assembleRelease
}
else {
  Write-Host "❌ Gradle wrapper not found. Please run 'npx expo prebuild' first." -ForegroundColor Red
  exit 1
}

cd ..

# Check if APK was built successfully
$apkPath = "android\app\build\outputs\apk\release\app-release.apk"
if (Test-Path $apkPath) {
  Write-Host "✅ APK built successfully!" -ForegroundColor Green
  Write-Host "📱 APK location: $apkPath" -ForegroundColor Cyan
    
  # Get APK size
  $apkSize = [math]::Round((Get-Item $apkPath).Length / 1MB, 2)
  Write-Host "📊 APK size: $apkSize MB" -ForegroundColor Cyan
    
  # Open APK location in Explorer
  Write-Host "📂 Opening APK location..." -ForegroundColor Yellow
  explorer "android\app\build\outputs\apk\release\"
    
}
else {
  Write-Host "❌ APK build failed. Check the logs above for errors." -ForegroundColor Red
  exit 1
}

Write-Host "🎉 Build complete! You can install the APK on your device." -ForegroundColor Green
