import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, ComponentThemes, Spacing, Typography } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, loading = false, variant = 'primary', disabled = false }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button, 
        variant === 'primary' ? styles.primary : styles.secondary, 
        disabled ? styles.disabled : null
      ]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator color={Colors.textOnPrimary} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    ...ComponentThemes.button.primary,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.sm,
    minHeight: 56, // Ensure minimum height for text
  },
  primary: {
    backgroundColor: Colors.buttonPrimary,
  },
  secondary: {
    backgroundColor: Colors.buttonSecondary,
  },
  disabled: {
    backgroundColor: Colors.buttonDisabled,
  },
  text: {
    color: Colors.textOnPrimary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.fontSize.base * 1.5, // Add line height for better text rendering
    textAlign: 'center',
  },
});

export default Button;
