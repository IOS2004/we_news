# WeNews APK Build Instructions

## Option 1: EAS Build (Recommended)

### Prerequisites:

1. Create an Expo account at https://expo.dev
2. Install EAS CLI: `npm install -g @expo/cli eas-cli`

### Steps:

1. **Login to Expo:**

   ```bash
   eas login
   ```

2. **Configure the project:**

   ```bash
   eas build:configure
   ```

3. **Build APK:**

   ```bash
   eas build --platform android --profile preview
   ```

4. **Download the APK:**
   - The build will be available in your Expo dashboard
   - You'll receive a download link via email

---

## Option 2: Local Build

### Prerequisites:

1. Install Android Studio
2. Install JDK 17+
3. Set environment variables:
   - ANDROID_HOME (path to Android SDK)
   - JAVA_HOME (path to JDK)

### Steps:

1. **Prebuild native files:**

   ```bash
   npx expo prebuild
   ```

2. **Build the APK:**

   ```bash
   cd android
   ./gradlew assembleRelease
   ```

3. **Find your APK:**
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

---

## Option 3: Expo Build Service (Legacy)

### Steps:

1. **Build using Expo:**

   ```bash
   expo build:android -t apk
   ```

2. **Download from Expo dashboard:**
   - Check your build status at https://expo.dev

---

## Troubleshooting:

### Common Issues:

1. **Missing Android SDK:** Install via Android Studio
2. **Environment variables:** Add to PATH and system variables
3. **Build failures:** Check logs for specific errors
4. **Sign-in issues:** Use `expo logout` then `expo login`

### Build Configurations:

- **Development:** For testing with debugging
- **Preview:** For testing without debugging (APK)
- **Production:** For app store release

### File Locations:

- **EAS builds:** Downloaded from Expo dashboard
- **Local builds:** `android/app/build/outputs/apk/release/`
- **Logs:** Check terminal output or Expo dashboard

---

## Notes:

- First build may take 15-30 minutes
- Subsequent builds are faster (5-10 minutes)
- APK size will be approximately 20-50 MB
- Test on multiple devices before distribution
