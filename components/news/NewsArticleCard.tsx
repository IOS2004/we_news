import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

interface NewsArticleCardProps {
  title: string;
  thumbnail: string;
  category: string;
  description?: string;
  author?: string;
  timeAgo?: string;
  onPress: () => void;
}

const NewsArticleCard: React.FC<NewsArticleCardProps> = ({ 
  title, 
  thumbnail, 
  category, 
  description,
  author,
  timeAgo,
  onPress 
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
        {/* Category Badge */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      </View>
      
      {/* Content Container */}
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        {description && (
          <Text style={styles.description} numberOfLines={3}>{description}</Text>
        )}
        
        {/* Bottom Info Row */}
        <View style={styles.bottomInfo}>
          <View style={styles.authorInfo}>
            <Ionicons name="person-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.author}>{author || 'Anonymous'}</Text>
          </View>
          <View style={styles.timeInfo}>
            <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.timeAgo}>{timeAgo || 'Just now'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginVertical: Spacing.sm,
    marginHorizontal: Spacing.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surfaceSecondary,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textOnPrimary,
    textTransform: 'capitalize',
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    lineHeight: Typography.lineHeight.tight * Typography.fontSize.lg,
  },
  description: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
  },
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  author: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeAgo: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
});

export default NewsArticleCard;
