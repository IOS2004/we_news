import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import Card from '../common/Card';

interface NewsArticle {
  id: string;
  title: string;
  thumbnail: string;
}

interface NewsHighlightReelProps {
  articles: NewsArticle[];
}

const NewsHighlightReel: React.FC<NewsHighlightReelProps> = ({ articles }) => {
  const renderItem = ({ item }: { item: NewsArticle }) => (
    <TouchableOpacity style={styles.articleContainer}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <Text style={styles.articleTitle} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <Card>
      <Text style={styles.title}>Latest News</Text>
      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  articleContainer: {
    width: 150,
    marginRight: 16,
  },
  thumbnail: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  articleTitle: {
    fontSize: 14,
    marginTop: 8,
  },
});

export default NewsHighlightReel;
