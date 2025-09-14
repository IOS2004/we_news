import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { Header, ScreenWrapper } from '../../../components/common';
import { NewsArticleCard } from '../../../components/news';
import { router } from 'expo-router';
import { Article } from '../../../types/news';
import { Colors, Typography, Spacing } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function BookmarksScreen() {
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      // For now, we'll show a placeholder. In a real app, you'd load from AsyncStorage
      // const savedBookmarks = await AsyncStorage.getItem('bookmarked_articles');
      // if (savedBookmarks) {
      //   setBookmarkedArticles(JSON.parse(savedBookmarks));
      // }
      setBookmarkedArticles([]);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <ScreenWrapper>
        <Header title="Saved Articles" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading bookmarks...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Header title="Saved Articles" />
      
      {bookmarkedArticles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={64} color={Colors.textLight} />
          <Text style={styles.emptyTitle}>No Saved Articles</Text>
          <Text style={styles.emptySubtitle}>
            Articles you bookmark will appear here for easy access later.
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarkedArticles}
          renderItem={renderArticle}
          keyExtractor={(item, index) => `bookmark-${item.id}-${index}`}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textLight,
  },
  listContainer: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold as any,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
});