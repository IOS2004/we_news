import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]).start(() => animate());
    };

    animate();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.borderLight, Colors.border],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
};

export const NewsCardSkeleton: React.FC = () => {
  return (
    <View style={styles.skeletonCard}>
      <SkeletonLoader 
        width={screenWidth - (Spacing.lg * 2) - (Spacing.lg * 2)} 
        height={200} 
        borderRadius={BorderRadius.md}
        style={styles.skeletonImage}
      />
      <View style={styles.skeletonContent}>
        <SkeletonLoader width={80} height={16} style={styles.skeletonCategory} />
        <SkeletonLoader width="100%" height={20} style={styles.skeletonTitle} />
        <SkeletonLoader width="80%" height={16} style={styles.skeletonTitle} />
      </View>
    </View>
  );
};

export const NewsListSkeleton: React.FC = () => {
  return (
    <View style={styles.listContainer}>
      {[1, 2, 3, 4, 5].map((item) => (
        <View key={item} style={styles.newsItemSkeleton}>
          <SkeletonLoader 
            width={100} 
            height={80} 
            borderRadius={BorderRadius.sm}
            style={styles.skeletonThumbnail}
          />
          <View style={styles.skeletonTextContainer}>
            <SkeletonLoader width={60} height={12} style={styles.skeletonCategorySmall} />
            <SkeletonLoader width="90%" height={16} style={styles.skeletonTitleSmall} />
            <SkeletonLoader width="70%" height={14} style={styles.skeletonDescSmall} />
            <SkeletonLoader width="50%" height={12} style={styles.skeletonAuthor} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  skeletonImage: {
    marginBottom: Spacing.md,
  },
  skeletonContent: {
    padding: Spacing.lg,
  },
  skeletonCategory: {
    marginBottom: Spacing.sm,
  },
  skeletonTitle: {
    marginBottom: Spacing.xs,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  newsItemSkeleton: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'flex-start',
  },
  skeletonThumbnail: {
    marginRight: Spacing.md,
  },
  skeletonTextContainer: {
    flex: 1,
  },
  skeletonCategorySmall: {
    marginBottom: Spacing.xs,
  },
  skeletonTitleSmall: {
    marginBottom: Spacing.xs,
  },
  skeletonDescSmall: {
    marginBottom: Spacing.xs,
  },
  skeletonAuthor: {
    marginBottom: 0,
  },
});
