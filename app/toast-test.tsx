import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../components/common';
import { showToast } from '../utils/toast';
import { Colors, Spacing } from '../constants/theme';

export default function ToastTestScreen() {
  const testSuccess = () => {
    showToast.success({
      title: 'Success!',
      message: 'This is a success message with a longer text to test wrapping',
    });
  };

  const testError = () => {
    showToast.error({
      title: 'Error!',
      message: 'This is an error message to show how errors are displayed',
    });
  };

  const testWarning = () => {
    showToast.warning({
      title: 'Warning!',
      message: 'This is a warning message for user attention',
    });
  };

  const testInfo = () => {
    showToast.info({
      title: 'Information',
      message: 'This is an informational message for the user',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <Button title="Test Success Toast" onPress={testSuccess} />
      </View>
      <View style={styles.button}>
        <Button title="Test Error Toast" onPress={testError} />
      </View>
      <View style={styles.button}>
        <Button title="Test Warning Toast" onPress={testWarning} />
      </View>
      <View style={styles.button}>
        <Button title="Test Info Toast" onPress={testInfo} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  button: {
    marginBottom: Spacing.md,
    width: '100%',
  },
});
