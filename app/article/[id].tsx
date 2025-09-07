import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Share,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Article } from '../../types/news';
import { getFullArticleContent } from '../../services/externalNewsApi';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import Header from '../../components/common/Header';
import { Colors } from '../../constants/theme';

export default function ArticleDetailScreen() {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [fullContent, setFullContent] = useState<string>('');
  const [loadingContent, setLoadingContent] = useState(true);

  // Safely extract parameters with fallbacks
  const article: Article = {
    id: (params.id as string) || '',
    title: (params.title as string) || 'No Title Available',
    description: (params.description as string) || 'No description available for this article.',
    author: (params.author as string) || 'Unknown Author',
    thumbnail: (params.image as string) || 'https://picsum.photos/800/400?random=1',
    timeAgo: (params.timeAgo as string) || 'Recently',
    url: (params.url as string) || '',
    source: (params.source as string) || 'Unknown Source',
    category: 'General',
  };

  // Try to fetch full article content when component mounts
  useEffect(() => {
    const fetchFullContent = async () => {
      const description = article.description || 'No description available for this article.';
      
      if (article.id) {
        setLoadingContent(true);
        try {
          const content = await getFullArticleContent(article.id);
          if (content && content.length > description.length) {
            setFullContent(content);
          } else {
            setFullContent(description);
          }
        } catch (error) {
          console.log('Could not fetch full content, using description');
          setFullContent(description);
        } finally {
          setLoadingContent(false);
        }
      } else {
        setFullContent(description);
        setLoadingContent(false);
      }
    };

    fetchFullContent();
  }, [article.id, article.description]);

  // Don't render if critical data is missing
  if (!article.id || !article.title) {
    return (
      <ScreenWrapper>
        <Header title="Article" canGoBack />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={Colors.textSecondary} />
          <Text style={styles.errorText}>लेख नहीं मिला / Article not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>वापस जाएं / Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }
  if (!article.id || !article.title) {
    return (
      <ScreenWrapper>
        <Header title="Article" canGoBack />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={Colors.textSecondary} />
          <Text style={styles.errorText}>लेख नहीं मिला / Article not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>वापस जाएं / Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  const handleOpenOriginal = async () => {
    if (article.url) {
      try {
        await Linking.openURL(article.url);
      } catch (error) {
        console.error('Error opening URL:', error);
      }
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article.title}\n\n${article.description}\n\nRead more: ${article.url}`,
        title: article.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ScreenWrapper>
      <Header 
        title="समाचार विवरण / Article Details"
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Article Image */}
        {article.thumbnail && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: article.thumbnail }} 
              style={styles.articleImage}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Article Content */}
        <View style={styles.contentContainer}>
          {/* Article Title */}
          <Text style={styles.title}>{article.title}</Text>

          {/* Article Meta Info */}
          <View style={styles.metaContainer}>
            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{article.timeAgo}</Text>
            </View>
            
            <View style={styles.metaRow}>
              <Ionicons name="newspaper-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{article.source}</Text>
            </View>

            {article.author && (
              <View style={styles.metaRow}>
                <Ionicons name="person-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.metaText}>{article.author}</Text>
              </View>
            )}
          </View>

          {/* Article Content */}
          <View style={styles.contentContainer}>
            {loadingContent ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.loadingText}>सामग्री लोड हो रही है / Loading content...</Text>
              </View>
            ) : (
              <Text style={styles.description}>{fullContent}</Text>
            )}
          </View>

          {/* Category Tag */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>श्रेणी / Category:</Text>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{article.category}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]} 
              onPress={handleOpenOriginal}
            >
              <Ionicons name="open-outline" size={20} color="white" />
              <Text style={styles.primaryButtonText}>
                मूल लेख पढ़ें / Read Original
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryButton]} 
              onPress={handleShare}
            >
              <Ionicons name="share-outline" size={20} color={Colors.primary} />
              <Text style={styles.secondaryButtonText}>
                साझा करें / Share
              </Text>
            </TouchableOpacity>
          </View>

          {/* Source Information */}
          <View style={styles.sourceContainer}>
            <Text style={styles.sourceTitle}>स्रोत / Source:</Text>
            <Text style={styles.sourceText}>{article.source}</Text>
            <Text style={styles.disclaimerText}>
              यह लेख बाहरी स्रोत से लिया गया है। मूल लेख पढ़ने के लिए "मूल लेख पढ़ें" बटन पर क्लिक करें।
            </Text>
            <Text style={styles.disclaimerText}>
              This article is from an external source. Click "Read Original" to view the full article.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: Colors.surface,
  },
  articleImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    lineHeight: 32,
    marginBottom: 16,
  },
  metaContainer: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    color: Colors.text,
    marginBottom: 24,
    textAlign: 'justify',
    letterSpacing: 0.3,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  sourceContainer: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  sourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  sourceText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  disclaimerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 8,
    fontWeight: '500',
  },
  categoryTag: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
