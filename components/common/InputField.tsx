import React, { forwardRef } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { Colors, ComponentThemes, Spacing, Typography, BorderRadius } from '../../constants/theme';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

const InputField = forwardRef<TextInput, InputFieldProps>(({ 
  label, 
  error, 
  leftIcon, 
  rightIcon, 
  onRightIconPress,
  style,
  ...props 
}, ref) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          ref={ref}
          style={[
            styles.input, 
            leftIcon ? styles.inputWithLeftIcon : null,
            rightIcon ? styles.inputWithRightIcon : null,
            style
          ]}
          placeholderTextColor={Colors.inputPlaceholder}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity 
            style={styles.rightIcon} 
            onPress={onRightIconPress}
            activeOpacity={0.7}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

InputField.displayName = 'InputField';

const styles = StyleSheet.create({
  container: {
    ...ComponentThemes.input.container,
    width: '100%',
  },
  label: {
    ...ComponentThemes.input.label,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    ...ComponentThemes.input.field,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: ComponentThemes.input.field.height,
    paddingHorizontal: Spacing.base,
    fontSize: Typography.fontSize.base,
    color: Colors.inputText,
  },
  inputWithLeftIcon: {
    paddingLeft: Spacing['5xl'],
  },
  inputWithRightIcon: {
    paddingRight: Spacing['5xl'],
  },
  leftIcon: {
    position: 'absolute',
    left: Spacing.base,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: Spacing.base,
    zIndex: 1,
    padding: Spacing.xs,
  },
  inputError: {
    ...ComponentThemes.input.error,
  },
  errorText: {
    color: Colors.error,
    marginTop: Spacing.xs,
    fontSize: Typography.fontSize.sm,
  },
});

export default InputField;
