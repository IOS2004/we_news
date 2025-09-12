import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Card from '../common/Card';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

interface AdPlaceholderProps {
  onAdPress?: () => void;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ onAdPress }) => {
  return (
    <Card style={styles.card}>
      <TouchableOpacity 
        style={styles.container} 
        onPress={onAdPress}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#f8f9fa', '#e8f4fd']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {/* Ad Banner Content */}
          <View style={styles.bannerContent}>
            <View style={styles.adTextContainer}>
              <Text style={styles.adLabel}>Sponsored Content</Text>
              <Text style={styles.bannerTitle}>Advertisement Space</Text>
              <Text style={styles.bannerSubtitle}>Premium banner placement for brand visibility</Text>
            </View>
            
            {/* Mock Banner Image/Logo Area */}
            <View style={styles.bannerImageContainer}>
              <LinearGradient
                colors={[Colors.primary + '20', Colors.primaryLight + '30']}
                style={styles.mockImage}
              >
                <Ionicons name="business-outline" size={28} color={Colors.primary} />
              </LinearGradient>
            </View>
          </View>

          {/* Ad Badge */}
          <View style={styles.adBadge}>
            <Text style={styles.adBadgeText}>AD</Text>
          </View>
        </LinearGradient>

        {/* Border indicator */}
        <View style={styles.adBorder} />
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 0,
    marginBottom: Spacing.xl,
    marginHorizontal: Spacing.lg,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  container: {
    position: 'relative',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  gradient: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    minHeight: 140,
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  adTextContainer: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  adLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  bannerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.fontSize.sm * 1.4,
  },
  bannerImageContainer: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockImage: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  adBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.warning,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    ...Shadows.sm,
  },
  adBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  adBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.primary,
  },
});

export default AdPlaceholder;
