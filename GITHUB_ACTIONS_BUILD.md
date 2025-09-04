# GitHub Actions APK Build Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Push to GitHub
```bash
# If you haven't initialized git yet
git init
git add .
git commit -m "Initial commit with GitHub Actions"

# Create repository on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/we_news.git
git branch -M main
git push -u origin main
```

### Step 2: Trigger Build
The build will start automatically when you push to `main` branch, or you can:

1. Go to your GitHub repository
2. Click **Actions** tab
3. Click **Build Android APK** workflow
4. Click **Run workflow** button

### Step 3: Download APK
1. Wait for build to complete (15-20 minutes)
2. Go to **Actions** tab
3. Click on the completed build
4. Scroll down to **Artifacts** section
5. Download `wenews-apk-XXX.zip`
6. Extract and install the APK

---

## 🔧 Advanced Options

### Manual Trigger
```bash
# Push any changes to trigger build
git add .
git commit -m "Update app"
git push
```

### Create Release
```bash
# Tag a release to create GitHub release with APK
git tag v1.0.0
git push origin v1.0.0
```

### Check Build Status
- Green ✅ = Build successful, APK ready
- Red ❌ = Build failed, check logs
- Yellow 🟡 = Build in progress

---

## 📱 Installation

1. Download APK from GitHub Actions artifacts
2. Enable **Unknown Sources** on your Android device
3. Install the APK file
4. Launch WeNews app

---

## 🛠 Troubleshooting

### Build Fails?
- Check **Actions** logs for specific errors
- Common issues: dependency conflicts, SDK versions

### APK Too Large?
- Enable Proguard/R8 in `android/app/build.gradle`
- Remove unused assets

### Can't Install APK?
- Enable "Install unknown apps" in Android settings
- Check if APK is corrupted during download

---

## 🎯 Benefits of GitHub Actions

✅ **No queue wait** - builds immediately  
✅ **Free** - 2000 minutes/month for public repos  
✅ **Automatic** - builds on every push  
✅ **Reliable** - consistent environment  
✅ **Shareable** - easy APK distribution  
✅ **Version control** - build history tracking  

---

## 📋 Build Information

- **Build time**: ~15-20 minutes
- **APK size**: ~20-50 MB
- **Retention**: 30 days
- **Triggers**: Push to main, manual trigger, tags
- **Artifacts**: Downloadable APK files

---

## 🔄 Next Steps

1. **First build**: Push your code to trigger first build
2. **Test APK**: Download and test on device
3. **Automate**: Every push will create new APK
4. **Release**: Tag versions for official releases
