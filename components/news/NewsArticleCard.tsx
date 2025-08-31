import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface NewsArticleCardProps {
  title: string;
  thumbnail: string;
  category: string;
  onPress: () => void;
}

const NewsArticleCard: React.FC<NewsArticleCardProps> = ({ title, thumbnail, category, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
      <View style={styles.contentContainer}>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.title} numberOfLines={3}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 16,
  },
  category: {
    fontSize: 14,
    color: '#007bff',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NewsArticleCard;
