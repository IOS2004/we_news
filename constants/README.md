# Theme System Documentation

## Overview

This theme system provides a centralized configuration for consistent UI design across the WE NEWS app. It includes colors, typography, spacing, shadows, and component-specific themes.

## Structure

### 1. Colors

```typescript
import { Colors } from "../constants/theme";

// Primary colors
Colors.primary; // #667eea
Colors.primaryDark; // #5a67d8
Colors.primaryLight; // #7c8ff4

// Background colors
Colors.background; // #f4f4f8
Colors.surface; // #ffffff

// Text colors
Colors.text; // #2c3e50
Colors.textSecondary; // #7f8c8d
```

### 2. Typography

```typescript
import { Typography } from "../constants/theme";

// Font sizes
Typography.fontSize.xs; // 12
Typography.fontSize.base; // 16
Typography.fontSize["2xl"]; // 24

// Font weights
Typography.fontWeight.normal; // '400'
Typography.fontWeight.semibold; // '600'
Typography.fontWeight.bold; // '700'
```

### 3. Spacing

```typescript
import { Spacing } from "../constants/theme";

// Standard spacing scale
Spacing.xs; // 4px
Spacing.base; // 16px
Spacing.xl; // 24px
Spacing["2xl"]; // 32px
```

### 4. Shadows

```typescript
import { Shadows } from "../constants/theme";

// Pre-defined shadow styles
Shadows.sm; // Small shadow
Shadows.base; // Base shadow
Shadows.lg; // Large shadow
```

### 5. Component Themes

```typescript
import { ComponentThemes } from "../constants/theme";

// Button styles
ComponentThemes.button.primary;
ComponentThemes.button.secondary;

// Input field styles
ComponentThemes.input.field;
ComponentThemes.input.label;
```

### 6. Gradients

```typescript
import { Gradients } from "../constants/theme";

// Pre-defined gradient combinations
Gradients.primary; // [#667eea, #764ba2]
Gradients.success; // [#56ab2f, #a8e6cf]
```

## Usage Examples

### Using Colors in Styles

```typescript
import { Colors, Spacing, Typography } from "../constants/theme";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    padding: Spacing.base,
  },
  title: {
    color: Colors.text,
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
  },
});
```

### Using Component Themes

```typescript
import { ComponentThemes, Colors } from "../constants/theme";

const styles = StyleSheet.create({
  input: {
    ...ComponentThemes.input.field,
    borderColor: Colors.inputBorder,
  },
  button: {
    ...ComponentThemes.button.primary,
  },
});
```

### Using Gradients

```typescript
import { LinearGradient } from "expo-linear-gradient";
import { Gradients } from "../constants/theme";

<LinearGradient colors={Gradients.primary} style={styles.gradient}>
  {/* Content */}
</LinearGradient>;
```

## Benefits

1. **Consistency**: All UI elements use the same color palette and spacing
2. **Maintainability**: Easy to update colors/spacing across the entire app
3. **Scalability**: Easy to add new themes or dark mode support
4. **Developer Experience**: IntelliSense support for all theme values
5. **Design System**: Follows design system principles for professional apps

## Best Practices

1. **Always use theme values**: Instead of hardcoded colors like `#ffffff`, use `Colors.surface`
2. **Use semantic naming**: Colors like `Colors.primary` instead of `Colors.blue`
3. **Consistent spacing**: Use the spacing scale instead of arbitrary pixel values
4. **Component themes**: Leverage pre-defined component themes for consistency
5. **Typography scale**: Use the typography scale for consistent text sizing

## Future Enhancements

1. **Dark Mode**: Add dark theme variants
2. **Brand Themes**: Support for multiple brand color schemes
3. **Responsive**: Add responsive breakpoints and sizing
4. **Animation**: Expand animation presets
5. **Accessibility**: Add accessibility-focused color combinations

## Migration Guide

When updating existing components to use the theme:

1. Import theme constants
2. Replace hardcoded values with theme values
3. Use component themes where applicable
4. Test on different screen sizes
5. Verify color contrast and accessibility

Example migration:

```typescript
// Before
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#667eea",
    padding: 16,
    borderRadius: 12,
  },
});

// After
import { Colors, Spacing, BorderRadius } from "../constants/theme";

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    padding: Spacing.base,
    borderRadius: BorderRadius.md,
  },
});
```
