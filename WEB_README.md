# WeNews Web Version

## Overview

The WeNews app now has full web support! When you run the Expo development server, you can press `w` to open the web version in your browser.

## Features

### ✨ Fully Responsive Design

- **Mobile View** (< 768px): Full mobile experience
- **Tablet View** (768px - 1023px): Optimized tablet layout
- **Desktop View** (≥ 1024px): Website-style layout with max-width container and shadow effects

### 🎨 Web-Optimized UI

- Custom HTML template with proper meta tags
- Responsive viewport settings
- Custom scrollbar styling for desktop
- Loading screen with spinner animation
- SEO-friendly meta tags (Open Graph, Twitter Cards)
- Theme color support

### 🚀 Performance

- Metro bundler for fast development
- Static export capability for production builds
- Code splitting and lazy loading support

## Getting Started

### Development

1. **Start the Expo server:**

   ```bash
   npm start
   ```

2. **Open web version:**
   - Press `w` in the terminal
   - Or visit: http://localhost:8081

### Production Build

To create a production-ready web build:

```bash
npm run web:build
```

This will generate static files in the `dist` folder that can be deployed to any web hosting service.

## Web-Specific Configuration

### Files Added/Modified

1. **`public/index.html`** - Custom HTML template with:

   - SEO meta tags
   - Responsive styling
   - Loading screen
   - Web optimizations

2. **`app.json`** - Updated web configuration:

   - Metro bundler setup
   - Static output configuration
   - Favicon setup

3. **`metro.config.js`** - Metro bundler configuration for web support

4. **`components/common/WebContainer.tsx`** - Web-specific container component

5. **`utils/platform.ts`** - Platform detection utilities

### Responsive Breakpoints

```typescript
{
  mobile: 640px,
  tablet: 768px,
  desktop: 1024px,
  wide: 1440px
}
```

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## Deployment Options

### Static Hosting

After building (`npm run web:build`), deploy the `dist` folder to:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting
- Any static hosting service

### Example: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Build the web app
npm run web:build

# Deploy
vercel dist
```

## Tips for Web Development

### Platform-Specific Code

Use the `Platform` API to write platform-specific code:

```typescript
import { Platform } from "react-native";

if (Platform.OS === "web") {
  // Web-specific code
}
```

### Responsive Styles

Use the provided utility:

```typescript
import { getResponsiveStyle, isWeb } from "@/utils/platform";

const style = getResponsiveStyle(
  { padding: 10 }, // mobile
  { padding: 20 } // web
);
```

### Web Container

Wrap your screens with `WebContainer` for automatic responsive layout:

```tsx
import { WebContainer } from "@/components/common/WebContainer";

export default function MyScreen() {
  return <WebContainer>{/* Your content */}</WebContainer>;
}
```

## Troubleshooting

### Web version won't start

- Make sure you're in the `frontend` directory
- Clear Metro cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Styles look wrong on web

- Check if you're using web-compatible style properties
- Avoid using native-only properties like `elevation`
- Use Platform-specific styles when needed

### Performance issues

- Use React DevTools Profiler
- Implement code splitting for large components
- Optimize images (use web-optimized formats)

## Environment Variables

Make sure your `.env` file includes web-compatible API URLs:

```env
EXPO_PUBLIC_API_BASE_URL=https://your-api-url.com
EXPO_PUBLIC_NEWS_API_BASE_URL=https://news-api-url.com
EXPO_PUBLIC_NEWS_API_KEY=your-api-key
```

## Keyboard Shortcuts

When the web app is running:

- `Ctrl/Cmd + R` - Reload the page
- `F12` - Open browser DevTools
- `Ctrl/Cmd + Shift + M` - Toggle device toolbar (Chrome)

## Future Enhancements

- [ ] PWA (Progressive Web App) support
- [ ] Service Worker for offline functionality
- [ ] Web Push Notifications
- [ ] Advanced SEO optimization
- [ ] Server-Side Rendering (SSR) option

## Support

For issues or questions about the web version:

1. Check the console for errors
2. Review the metro bundler output
3. Ensure all dependencies are installed correctly

Happy web development! 🚀
