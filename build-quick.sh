#!/bin/bash

# WeNews Quick Local APK Build
# No EAS queue wait times!

echo "🚀 Building WeNews APK locally..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Prebuild Android files
echo "🔧 Preparing Android build..."
npx expo prebuild --platform android --clear

# Build APK
echo "🔨 Building APK (2-5 minutes)..."
cd android
./gradlew assembleRelease
cd ..

# Check result
if [ -f "android/app/build/outputs/apk/release/app-release.apk" ]; then
    echo "✅ APK built successfully!"
    echo "📱 Location: android/app/build/outputs/apk/release/app-release.apk"
    
    # Get file size
    size=$(du -h android/app/build/outputs/apk/release/app-release.apk | cut -f1)
    echo "📊 APK size: $size"
    
    echo "🎉 Build complete! Install the APK on your device."
else
    echo "❌ Build failed. Check logs above."
    exit 1
fi
