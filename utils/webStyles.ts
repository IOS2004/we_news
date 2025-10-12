import { Platform, ViewStyle, TextStyle, ImageStyle } from "react-native";

type Style = ViewStyle | TextStyle | ImageStyle;

/**
 * Apply web-specific styles only when running on web platform
 * @param baseStyle - Base styles for all platforms
 * @param webStyle - Additional styles for web only
 */
export function webStyle<T extends Style>(
  baseStyle: T,
  webStyle: Partial<T>
): T {
  if (Platform.OS === "web") {
    return { ...baseStyle, ...webStyle };
  }
  return baseStyle;
}

/**
 * Conditional web styling
 * @param condition - Condition to check
 * @param webStyle - Style to apply if condition is true on web
 */
export function webIf(condition: boolean, webStyle: Style): Style | undefined {
  if (Platform.OS === "web" && condition) {
    return webStyle;
  }
  return undefined;
}

/**
 * Box shadow helper for web (since React Native doesn't support boxShadow on all platforms)
 * @param x - Horizontal offset
 * @param y - Vertical offset
 * @param blur - Blur radius
 * @param color - Shadow color
 */
export function webBoxShadow(
  x: number = 0,
  y: number = 2,
  blur: number = 8,
  color: string = "rgba(0,0,0,0.1)"
): ViewStyle {
  if (Platform.OS === "web") {
    return {
      boxShadow: `${x}px ${y}px ${blur}px ${color}`,
    } as ViewStyle;
  }
  return {};
}

/**
 * Cursor pointer for clickable elements on web
 */
export const webCursor = (
  type: "pointer" | "default" | "text" = "pointer"
): ViewStyle => {
  if (Platform.OS === "web") {
    return { cursor: type } as ViewStyle;
  }
  return {};
};

/**
 * Hover styles for web (use with @media queries or JS state)
 */
export function webHover(hoverStyle: Style): any {
  if (Platform.OS === "web") {
    return {
      ...hoverStyle,
      transition: "all 0.2s ease-in-out",
    };
  }
  return {};
}

/**
 * Media query helpers
 */
export const mediaQueries = {
  mobile: "@media (max-width: 640px)",
  tablet: "@media (min-width: 641px) and (max-width: 1023px)",
  desktop: "@media (min-width: 1024px)",
  wide: "@media (min-width: 1440px)",
};

/**
 * Check current viewport width (web only)
 */
export function getViewportWidth(): number {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return window.innerWidth;
  }
  return 0;
}

/**
 * Check if current viewport is mobile size
 */
export function isMobileViewport(): boolean {
  return getViewportWidth() < 768;
}

/**
 * Check if current viewport is desktop size
 */
export function isDesktopViewport(): boolean {
  return getViewportWidth() >= 1024;
}

/**
 * Example usage:
 *
 * const styles = StyleSheet.create({
 *   container: webStyle(
 *     { padding: 10 },
 *     { maxWidth: 1200, margin: '0 auto' }
 *   ),
 *   card: {
 *     ...webBoxShadow(0, 4, 12, 'rgba(0,0,0,0.15)'),
 *     padding: 20,
 *   },
 *   button: {
 *     ...webCursor('pointer'),
 *   }
 * });
 */
