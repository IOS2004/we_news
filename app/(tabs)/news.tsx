import React, { useState } from 'react';
import { FlatList , StyleSheet,View } from 'react-native';
import { Header, ScreenWrapper } from '../../components/common';
import { CategoryFilter, NewsArticleCard } from '../../components/news';

const dummyArticles = [
  { 
    id: '1', 
    title: 'Local Community Garden Opens in Downtown', 
    thumbnail: 'https://picsum.photos/800/400?random=1', 
    category: 'Local News',
    description: 'A new community garden has opened in the heart of downtown, providing fresh produce and a green space for residents.',
    author: 'Sarah Johnson',
    timeAgo: '3h ago'
  },
  { 
    id: '2', 
    title: 'New Library Branch to Open Next Month', 
    thumbnail: 'https://picsum.photos/800/400?random=2', 
    category: 'Local News',
    description: 'Construction is complete on the new library branch, which will serve the growing northern district.',
    author: 'Mike Chen',
    timeAgo: '5h ago'
  },
  { 
    id: '3', 
    title: 'Tech Innovation Hub Launches Startup Program', 
    thumbnail: 'https://picsum.photos/800/400?random=3', 
    category: 'Tech',
    description: 'Local entrepreneurs can now apply for the new accelerator program focusing on sustainable technology solutions.',
    author: 'Emily Rodriguez',
    timeAgo: '1d ago'
  },
  { 
    id: '4', 
    title: 'Annual Arts Festival Returns This Weekend', 
    thumbnail: 'https://picsum.photos/800/400?random=4', 
    category: 'Entertainment',
    description: 'The city\'s beloved arts festival is back with live performances, local vendors, and interactive workshops.',
    author: 'David Park',
    timeAgo: '2d ago'
  },
  { 
    id: '5', 
    title: 'City Council Approves New Traffic Safety Measures', 
    thumbnail: 'https://picsum.photos/800/400?random=5', 
    category: 'Politics',
    description: 'New speed limits and crosswalk improvements aim to reduce accidents in high-traffic areas.',
    author: 'Lisa Thompson',
    timeAgo: '3d ago'
  },
];

const categories = ['All', 'Local News', 'Politics', 'Tech', 'Entertainment'];

export default function NewsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredArticles = selectedCategory === 'All'
    ? dummyArticles
    : dummyArticles.filter((article) => article.category === selectedCategory);

  return (
    <ScreenWrapper style={styles.container}>
      <Header title="News" />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <FlatList
        style={styles.flatList}
        data={filteredArticles}
        renderItem={({ item }) => (
          <NewsArticleCard
            title={item.title}
            thumbnail={item.thumbnail}
            category={item.category}
            description={item.description}
            author={item.author}
            timeAgo={item.timeAgo}
            onPress={() => {}}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 0,
    // backgroundColor: 'yellow',
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 20,
  },
});
