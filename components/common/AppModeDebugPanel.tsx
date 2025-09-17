import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppMode } from '../contexts/AppModeContext';
import { Colors } from '../constants/theme';

const AppModeDebugPanel: React.FC = () => {
  const { currentMode, availableModes, switchToNextMode, switchToMode } = useAppMode();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Mode Debug Panel</Text>
      <Text style={styles.info}>Current Mode: {currentMode}</Text>
      <Text style={styles.info}>Available Modes: {availableModes.join(', ')}</Text>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={switchToNextMode}>
          <Text style={styles.buttonText}>Switch to Next Mode</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.buttonRow}>
        {availableModes.map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[
              styles.modeButton,
              { backgroundColor: mode === currentMode ? Colors.primary : '#f0f0f0' }
            ]}
            onPress={() => switchToMode(mode)}
          >
            <Text
              style={[
                styles.modeButtonText,
                { color: mode === currentMode ? 'white' : Colors.text }
              ]}
            >
              {mode.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.text,
  },
  info: {
    fontSize: 14,
    marginBottom: 8,
    color: Colors.textSecondary,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  modeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modeButtonText: {
    fontSize: 10,
    fontWeight: '600',
  },
});

export default AppModeDebugPanel;