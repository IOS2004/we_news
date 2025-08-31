import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

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
      style={[styles.button, styles[variant], disabled ? styles.disabled : null]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  primary: {
    backgroundColor: '#007bff',
    shadowColor: '#007bff',
  },
  secondary: {
    backgroundColor: '#6c757d',
    shadowColor: '#6c757d',
  },
  disabled: {
    backgroundColor: '#e0e0e0',
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default Button;
