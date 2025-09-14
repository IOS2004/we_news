import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator, Text, RefreshControl } from 'react-native';
import { Header, ScreenWrapper, NewsListSkeleton } from '../../../components/common';
import { CategoryFilter, NewsArticleCard } from '../../../components/news';
import { router } from 'expo-router';
import { getTopHeadlines, getArticlesByLanguage } from '../../../services/externalNewsApi';
import { Article } from '../../../types/news';
import { Colors } from '../../../constants/theme';

// Updated categories to match both app categories and API categories
const categories = [
  { label: 'All', value: 'all' },
  { label: 'हिंदी / Hindi', value: 'hindi' },
  { label: 'Tech', value: 'technology' },
  { label: 'Business', value: 'business' },
  { label: 'Sports', value: 'sports' },
  { label: 'Entertainment', value: 'entertainment' },
];

export default function NewsScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async (category: string = 'all', isRefresh: boolean = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(null);

      let fetchedArticles: Article[] = [];

      if (category === 'all') {
        // Get general top headlines from India
        fetchedArticles = await getTopHeadlines();
      } else if (category === 'hindi') {
        // Get Hindi language articles
        fetchedArticles = await getArticlesByLanguage('hi', 'भारत समाचार');
      } else {
        // Get category-specific articles
        fetchedArticles = await getTopHeadlines(category as any);
      }

      setArticles(fetchedArticles);
      
      if (fetchedArticles.length === 0) {
        setError('कोई समाचार उपलब्ध नहीं / No news available for this category');
      }
    } catch (err: any) {
      console.error('Error fetching articles:', err);
      setError('समाचार लोड करने में त्रुटि / Error loading news. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchArticles(selectedCategory);
  }, [selectedCategory]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchArticles(selectedCategory, true);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        समाचार लोड हो रहे हैं... {'\n'}
        Loading news articles...
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <ScreenWrapper style={styles.container}>
        <Header title="समाचार / News" />
        <CategoryFilter
          categories={categories.map(cat => cat.label)}
          selectedCategory={categories.find(cat => cat.value === selectedCategory)?.label || 'All'}
          onSelectCategory={(label) => {
            const category = categories.find(cat => cat.label === label);
            if (category) handleCategorySelect(category.value);
          }}
        />
        <NewsListSkeleton />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={styles.container}>
      <Header title="समाचार / News" />
      <CategoryFilter
        categories={categories.map(cat => cat.label)}
        selectedCategory={categories.find(cat => cat.value === selectedCategory)?.label || 'All'}
        onSelectCategory={(label) => {
          const category = categories.find(cat => cat.label === label);
          if (category) handleCategorySelect(category.value);
        }}
      />
      
      {error ? renderError() : (
        <FlatList
          style={styles.flatList}
          data={articles}
          renderItem={({ item, index }) => (
            <NewsArticleCard
              title={item.title}
              thumbnail={item.thumbnail}
              category={item.category}
              description={item.description}
              author={item.author}
              timeAgo={item.timeAgo}
              onPress={() => {
                console.log('Opening article:', item.title);
                // Navigate to article detail page
                router.push({
                  pathname: '/article/[id]',
                  params: {
                    id: item.id,
                    title: item.title,
                    description: item.description || '',
                    author: item.author || '',
                    image: item.thumbnail || '',
                    timeAgo: item.timeAgo || '',
                    url: item.url || '',
                    source: item.source || '',
                  },
                });
              }}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.flatListContent,
            articles.length === 0 ? styles.centerContainer : {}
          ]}
          ListEmptyComponent={!loading ? renderEmpty : null}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              title="समाचार अपडेट हो रहे हैं... / Updating news..."
            />
          }
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error || '#FF6B6B',
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary || '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: Colors.textSecondary || '#666',
    textAlign: 'center',
  },
});
