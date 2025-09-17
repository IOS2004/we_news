import React, { useRef, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { useAppMode, AppMode } from '../../contexts/AppModeContext';

interface DoubleTapAppSwitcherProps {
  style?: any;
}

const DoubleTapAppSwitcher: React.FC<DoubleTapAppSwitcherProps> = ({ style }) => {
  const { currentMode, switchToNextMode } = useAppMode();
  const [tapCount, setTapCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const tapTimeout = useRef<NodeJS.Timeout | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  const handleTap = () => {
    setTapCount(prev => prev + 1);

    // Clear any existing timeout
    if (tapTimeout.current) {
      clearTimeout(tapTimeout.current);
    }

    // Start scale animation for immediate feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Set timeout for double-tap detection
    tapTimeout.current = setTimeout(() => {
      if (tapCount + 1 >= 2) {
        // Double tap detected - switch mode
        handleModeSwitch();
      }
      setTapCount(0);
    }, 300);
  };

  const handleModeSwitch = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Show pulse animation
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsAnimating(false);
    });

    // Switch to next mode
    switchToNextMode();
  };

  const getModeIcon = (mode: AppMode): string => {
    switch (mode) {
      case 'home':
        return 'home';
      case 'news':
        return 'newspaper';
      case 'trades':
        return 'trending-up';
      default:
        return 'apps';
    }
  };

  const getModeLabel = (mode: AppMode): string => {
    switch (mode) {
      case 'home':
        return 'HOME';
      case 'news':
        return 'NEWS';
      case 'trades':
        return 'TRADES';
      default:
        return 'APP';
    }
  };

  const getModeColor = (mode: AppMode): string => {
    switch (mode) {
      case 'home':
        return Colors.primary;
      case 'news':
        return '#007AFF';
      case 'trades':
        return '#FF9500';
      default:
        return Colors.primary;
    }
  };

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0],
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handleTap}
      activeOpacity={0.8}
    >
      <Animated.View 
        style={[
          styles.button,
          { 
            backgroundColor: getModeColor(currentMode),
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Pulse effect overlay */}
        <Animated.View
          style={[
            styles.pulseOverlay,
            {
              backgroundColor: getModeColor(currentMode),
              transform: [{ scale: pulseScale }],
              opacity: pulseOpacity,
            }
          ]}
        />
        
        {/* Mode icon */}
        <Ionicons 
          name={getModeIcon(currentMode) as any} 
          size={16} 
          color="white" 
        />
        
        {/* Mode label */}
        <Text style={styles.label}>
          {getModeLabel(currentMode)}
        </Text>
        
        {/* Tap indicator */}
        {tapCount > 0 && (
          <View style={styles.tapIndicator}>
            <Text style={styles.tapCount}>{tapCount}</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    minWidth: 70,
    justifyContent: 'center',
    position: 'relative',
  },
  pulseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    zIndex: 0,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
    zIndex: 1,
  },
  tapIndicator: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 2,
  },
  tapCount: {
    fontSize: 8,
    fontWeight: '800',
    color: 'white',
  },
});

export default DoubleTapAppSwitcher;