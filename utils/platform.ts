import { Platform } from "react-native";

/**
 * Check if the current platform is web
 */
export const isWeb = Platform.OS === "web";

/**
 * Check if the current platform is mobile (iOS or Android)
 */
export const isMobile = Platform.OS === "ios" || Platform.OS === "android";

/**
 * Get responsive styles based on screen size
 */
export const getResponsiveStyle = (mobileStyle: any, webStyle: any) => {
  return isWeb ? webStyle : mobileStyle;
};

/**
 * Web-specific configuration
 */
export const webConfig = {
  maxWidth: 1200,
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    wide: 1440,
  },
};
