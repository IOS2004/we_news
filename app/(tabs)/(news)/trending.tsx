import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator, Text, RefreshControl } from 'react-native';
import { Header, ScreenWrapper, NewsListSkeleton } from '../../../components/common';
import { CategoryFilter, NewsArticleCard } from '../../../components/news';
import { router } from 'expo-router';
import { getTopHeadlines } from '../../../services/externalNewsApi';
import { Article } from '../../../types/news';
import { Colors } from '../../../constants/theme';

export default function TrendingNewsScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrendingArticles = async (isRefresh: boolean = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(null);

      // Fetch trending articles (general category for most popular)
      const response = await getTopHeadlines('general');

      if (response && response.length > 0) {
        setArticles(response);
      } else {
        setError('Failed to fetch trending news');
      }
    } catch (error) {
      console.error('Error fetching trending articles:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTrendingArticles();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTrendingArticles(true);
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

  const renderItem = ({ item }: { item: Article }) => (
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

  if (loading && !refreshing) {
    return (
      <ScreenWrapper>
        <Header title="Trending News" />
        <NewsListSkeleton />
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper>
        <Header title="Trending News" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Header title="Trending News" />
      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item, index) => `trending-${item.id}-${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No trending articles available</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
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