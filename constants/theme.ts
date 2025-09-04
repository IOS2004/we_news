// Theme configuration for consistent UI across the app

export const Colors = {
  // Primary colors - Using medium blue as main accent
  primary: "#3F72AF",
  primaryDark: "#2E5A8A",
  primaryLight: "#5A8BC7",

  // Secondary colors - Using dark navy blue
  secondary: "#112D4E",
  secondaryDark: "#0B1F35",
  secondaryLight: "#1A3B5C",

  // Gradient colors
  gradientStart: "#3F72AF",
  gradientEnd: "#112D4E",

  // Background colors
  background: "#F9F7F7",
  surface: "#ffffff",
  surfaceSecondary: "#DBE2EF",
  overlay: "rgba(17, 45, 78, 0.5)",

  // Text colors
  text: "#112D4E",
  textSecondary: "#3F72AF",
  textLight: "#6B7280",
  textOnPrimary: "#ffffff",
  textOnDark: "#F9F7F7",

  // Border colors
  border: "#DBE2EF",
  borderLight: "#E5E7EB",
  borderDark: "#3F72AF",

  // Status colors
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3F72AF",

  // Input colors
  inputBackground: "#ffffff",
  inputBorder: "#DBE2EF",
  inputBorderFocused: "#3F72AF",
  inputText: "#112D4E",
  inputPlaceholder: "#6B7280",

  // Button colors
  buttonPrimary: "#3F72AF",
  buttonSecondary: "#DBE2EF",
  buttonDisabled: "#9CA3AF",

  // Transparent colors
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",
  whiteTransparent: "rgba(255, 255, 255, 0.1)",
  blackTransparent: "rgba(17, 45, 78, 0.3)",

  // tagline
  tagline: "#F9F7F7",
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
      backgroundColor: "#FFE5E5",
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
  success: ["#10B981", "#34D399"] as const,
  warning: ["#F59E0B", "#FCD34D"] as const,
  error: ["#EF4444", "#F87171"] as const,
  info: ["#3F72AF", "#5A8BC7"] as const,
  dark: ["#112D4E", "#1A3B5C"] as const,
  light: ["#F9F7F7", "#DBE2EF"] as const,
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
