import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Header, ScreenWrapper, NewsListSkeleton } from '../../../components/common';
import { NewsArticleCard } from '../../../components/news';
import { router } from 'expo-router';
import { getTopHeadlines } from '../../../services/externalNewsApi';
import { Article } from '../../../types/news';
import { Colors, Typography, Spacing } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { label: 'General', value: 'general', icon: 'newspaper' },
  { label: 'Technology', value: 'technology', icon: 'laptop' },
  { label: 'Business', value: 'business', icon: 'business' },
  { label: 'Sports', value: 'sports', icon: 'football' },
  { label: 'Entertainment', value: 'entertainment', icon: 'musical-notes' },
  { label: 'Health', value: 'health', icon: 'medical' },
  { label: 'Science', value: 'science', icon: 'flask' },
];

export default function CategoriesScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryArticles = async (category: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getTopHeadlines(category as any);

      if (response && response.length > 0) {
        setArticles(response);
      } else {
        setError('No articles found for this category');
      }
    } catch (error) {
      console.error('Error fetching category articles:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryArticles(selectedCategory);
  }, [selectedCategory]);

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  const handleArticlePress = (article: Article) => {
    router.push({
      pathname: '/article/[id]',
      params: { 
        id: encodeURIComponent(article.url || article.id),
        title: article.title,
        url: article.url || '',
        image: article.thumbnail || '',
        description: article.description || '',
        content: article.description || '',
        publishedAt: article.timeAgo || '',
        source: article.source || 'Unknown'
      }
    });
  };

  const renderCategoryButton = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.value && styles.selectedCategoryButton
      ]}
      onPress={() => handleCategoryPress(item.value)}
    >
      <Ionicons 
        name={item.icon as any} 
        size={20} 
        color={selectedCategory === item.value ? Colors.white : Colors.primary} 
      />
      <Text style={[
        styles.categoryText,
        selectedCategory === item.value && styles.selectedCategoryText
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderArticle = ({ item }: { item: Article }) => (
    <NewsArticleCard 
      title={item.title}
      thumbnail={item.thumbnail}
      category={item.category}
      description={item.description}
      author={item.author}
      timeAgo={item.timeAgo}
      onPress={() => handleArticlePress(item)}
    />
  );

  return (
    <ScreenWrapper>
      <Header title="News Categories" />
      
      {/* Category Filter */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryButton}
          keyExtractor={(item) => item.value}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        />
      </View>

      {/* Articles List */}
      {loading ? (
        <NewsListSkeleton />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={articles}
          renderItem={renderArticle}
          keyExtractor={(item, index) => `category-${item.id}-${index}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No articles available in this category</Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  categoriesContainer: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoriesContent: {
    paddingHorizontal: Spacing.md,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    marginLeft: Spacing.xs,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium as any,
    color: Colors.primary,
  },
  selectedCategoryText: {
    color: Colors.white,
  },
  listContainer: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
  },
});