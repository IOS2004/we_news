import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import Card from '../common/Card';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';

interface NewsArticle {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
}

interface NewsHighlightReelProps {
  articles: NewsArticle[];
}

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = screenWidth - (Spacing.lg * 2); // Account for card padding
const itemWidth = cardWidth - (Spacing.lg * 2); // Account for internal padding

const NewsHighlightReel: React.FC<NewsHighlightReelProps> = ({ articles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'business':
        return Colors.info;
      case 'technology':
      case 'tech':
        return Colors.primary;
      case 'politics':
        return Colors.warning;
      case 'entertainment':
        return Colors.secondary;
      default:
        return Colors.textSecondary;
    }
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / itemWidth);
    setCurrentIndex(index);
  };

  const renderItem = ({ item, index }: { item: NewsArticle; index: number }) => (
    <TouchableOpacity style={styles.articleContainer}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <View style={styles.categoryOverlay}>
          <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(item.category) }]}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.articleTitle} numberOfLines={2}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPaginationDots = () => (
    <View style={styles.paginationContainer}>
      {articles.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            {
              backgroundColor: index === currentIndex ? Colors.primary : Colors.borderLight,
              width: index === currentIndex ? 20 : 8,
            }
          ]}
        />
      ))}
    </View>
  );

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Latest News</Text>
        {renderPaginationDots()}
      </View>
      
      <FlatList
        ref={flatListRef}
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={itemWidth}
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContainer}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 0,
    marginBottom: Spacing.xl,
    marginHorizontal: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  paginationDot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.borderLight,
  },
  flatListContainer: {
    paddingRight: 0,
  },
  articleContainer: {
    width: itemWidth,
    marginRight: 0,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  thumbnail: {
    width: '100%',
    height: 180,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceSecondary,
  },
  categoryOverlay: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
  },
  categoryTag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.base,
  },
  categoryText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textOnPrimary,
    textTransform: 'capitalize',
  },
  contentContainer: {
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
  },
  articleTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    lineHeight: Typography.fontSize.base * 1.4,
  },
});

export default NewsHighlightReel;
