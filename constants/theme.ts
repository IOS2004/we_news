// Theme configuration for consistent UI across the app

export const Colors = {
  // Primary colors
  primary: "#667eea",
  primaryDark: "#5a67d8",
  primaryLight: "#7c8ff4",

  // Secondary colors
  secondary: "#764ba2",
  secondaryDark: "#6a4190",
  secondaryLight: "#8a5bb8",

  // Gradient colors
  gradientStart: "#667eea",
  gradientEnd: "#764ba2",

  // Background colors
  background: "#f4f4f8",
  surface: "#ffffff",
  surfaceSecondary: "#f8f9fa",
  overlay: "rgba(0, 0, 0, 0.1)",

  // Text colors
  text: "#2c3e50",
  textSecondary: "#7f8c8d",
  textLight: "#bdc3c7",
  textOnPrimary: "#ffffff",
  textOnDark: "#ffffff",

  // Border colors
  border: "#e9ecef",
  borderLight: "#f1f3f4",
  borderDark: "#dee2e6",

  // Status colors
  success: "#27ae60",
  warning: "#f39c12",
  error: "#e74c3c",
  info: "#3498db",

  // Input colors
  inputBackground: "#f8f9fa",
  inputBorder: "#e9ecef",
  inputBorderFocused: "#667eea",
  inputText: "#333333",
  inputPlaceholder: "#999999",

  // Button colors
  buttonPrimary: "#667eea",
  buttonSecondary: "#6c757d",
  buttonDisabled: "#cccccc",

  // Transparent colors
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",
  whiteTransparent: "rgba(255, 255, 255, 0.1)",
  blackTransparent: "rgba(0, 0, 0, 0.1)",

  // tagline
  tagline: "#ffffff75",
};

export const Typography = {
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 28,
    "4xl": 32,
    "5xl": 36,
    "6xl": 48,
  },

  // Font weights
  fontWeight: {
    light: "300" as const,
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
  },
};

export const Spacing = {
  // Base spacing unit (4px)
  unit: 4,

  // Spacing scale
  xs: 4, // 4px
  sm: 8, // 8px
  md: 12, // 12px
  base: 16, // 16px
  lg: 20, // 20px
  xl: 24, // 24px
  "2xl": 32, // 32px
  "3xl": 40, // 40px
  "4xl": 48, // 48px
  "5xl": 64, // 64px
  "6xl": 80, // 80px
};

export const BorderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  full: 9999,
};

export const Shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
};

export const Layout = {
  // Screen padding
  screenPadding: Spacing.base,
  screenPaddingHorizontal: Spacing.base,
  screenPaddingVertical: Spacing.lg,

  // Container widths
  container: {
    sm: 400,
    md: 600,
    lg: 800,
    xl: 1200,
  },

  // Common heights
  buttonHeight: 50,
  inputHeight: 50,
  headerHeight: 60,
  tabBarHeight: 80,

  // Icon sizes
  iconSize: {
    xs: 12,
    sm: 16,
    base: 20,
    lg: 24,
    xl: 32,
    "2xl": 48,
    "3xl": 64,
  },
};

export const Animation = {
  // Duration
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
  },

  // Easing curves
  easing: {
    linear: "linear",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
  },
};

// Component-specific themes
export const ComponentThemes = {
  button: {
    primary: {
      backgroundColor: Colors.buttonPrimary,
      color: Colors.textOnPrimary,
      borderRadius: BorderRadius.md,
      height: Layout.buttonHeight,
      ...Shadows.base,
    },
    secondary: {
      backgroundColor: Colors.buttonSecondary,
      color: Colors.textOnPrimary,
      borderRadius: BorderRadius.md,
      height: Layout.buttonHeight,
      ...Shadows.base,
    },
    disabled: {
      backgroundColor: Colors.buttonDisabled,
      color: Colors.textLight,
      borderRadius: BorderRadius.md,
      height: Layout.buttonHeight,
    },
  },

  input: {
    container: {
      marginVertical: Spacing.sm,
    },
    field: {
      backgroundColor: Colors.inputBackground,
      borderColor: Colors.inputBorder,
      borderRadius: BorderRadius.md,
      height: Layout.inputHeight,
      paddingHorizontal: Spacing.base,
      ...Shadows.sm,
    },
    label: {
      color: Colors.text,
      fontSize: Typography.fontSize.base,
      fontWeight: Typography.fontWeight.medium,
      marginBottom: Spacing.sm,
    },
    error: {
      borderColor: Colors.error,
      backgroundColor: "#fdf2f2",
    },
  },

  card: {
    container: {
      backgroundColor: Colors.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.base,
      ...Shadows.base,
    },
    elevated: {
      backgroundColor: Colors.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.xl,
      ...Shadows.md,
    },
  },

  header: {
    container: {
      height: Layout.headerHeight,
      backgroundColor: Colors.surface,
      ...Shadows.sm,
    },
    title: {
      fontSize: Typography.fontSize.lg,
      fontWeight: Typography.fontWeight.semibold,
      color: Colors.text,
    },
  },
};

// Gradient presets
export const Gradients = {
  primary: [Colors.gradientStart, Colors.gradientEnd] as const,
  secondary: [Colors.secondary, Colors.primaryDark] as const,
  success: ["#56ab2f", "#a8e6cf"] as const,
  warning: ["#f7971e", "#ffd200"] as const,
  error: ["#ff512f", "#f09819"] as const,
  info: ["#4facfe", "#00f2fe"] as const,
  dark: ["#232526", "#414345"] as const,
  light: ["#ffecd2", "#fcb69f"] as const,
};

export default {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Layout,
  Animation,
  ComponentThemes,
  Gradients,
};
