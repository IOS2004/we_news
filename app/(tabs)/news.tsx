import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { Header, ScreenWrapper } from '../../components/common';
import { CategoryFilter, NewsArticleCard } from '../../components/news';

const dummyArticles = [
  { id: '1', title: 'Politics News Headline 1', thumbnail: 'https://picsum.photos/200', category: 'Politics' },
  { id: '2', title: 'Business News Headline 2', thumbnail: 'https://picsum.photos/201', category: 'Business' },
  { id: '3', title: 'Tech News Headline 3', thumbnail: 'https://picsum.photos/202', category: 'Tech' },
  { id: '4', title: 'Entertainment News Headline 4', thumbnail: 'https://picsum.photos/203', category: 'Entertainment' },
  { id: '5', title: 'Politics News Headline 5', thumbnail: 'https://picsum.photos/204', category: 'Politics' },
];

const categories = ['All', 'Politics', 'Business', 'Tech', 'Entertainment'];

export default function NewsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredArticles = selectedCategory === 'All'
    ? dummyArticles
    : dummyArticles.filter((article) => article.category === selectedCategory);

  return (
    <ScreenWrapper>
      <Header title="News" />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <FlatList
        data={filteredArticles}
        renderItem={({ item }) => (
          <NewsArticleCard
            title={item.title}
            thumbnail={item.thumbnail}
            category={item.category}
            onPress={() => {}}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </ScreenWrapper>
  );
}
