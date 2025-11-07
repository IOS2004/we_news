import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import { router } from 'expo-router';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper, Header } from '../../../components/common';
import { Colors, Typography, Spacing } from '../../../constants/theme';
import { useAuth } from '../../../contexts/AuthContext';
import { useWallet } from '../../../contexts/WalletContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Web frontend URL - Production URL
const WEB_FRONTEND_URL = 'https://we-news-web-frontend.vercel.app';

export default function AddMoneyScreen() {
  const { user } = useAuth();
  const { refreshWallet } = useWallet();
  const webViewRef = useRef<WebView>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [webViewUrl, setWebViewUrl] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Build the WebView URL with auth token
  useEffect(() => {
    const buildUrl = async () => {
      try {
        // Get auth token from AsyncStorage
        const token = await AsyncStorage.getItem('auth_token');
        
        if (!token) {
          console.error('[AddMoney] No auth token found');
          setError('Authentication required. Please login again.');
          return;
        }

        console.log('[AddMoney] Token found, building URL...');
        // Build URL with token and user info as query parameters
        const params = new URLSearchParams({
          token: token,
          userId: user?.id || '',
          email: user?.email || '',
          returnUrl: 'wenews://add-money-success', // Deep link for success
        });

        const url = `${WEB_FRONTEND_URL}/guest-topup?${params.toString()}`;
        console.log('[AddMoney] WebView URL:', url);
        setWebViewUrl(url);
      } catch (err) {
        console.error('[AddMoney] Error building WebView URL:', err);
        setError('Failed to initialize payment page');
      }
    };

    buildUrl();
  }, [user]);

  // Handle hardware back button on Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [canGoBack]);

  // Handle WebView navigation state changes
  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
    setIsLoading(navState.loading);

    // Check if payment was successful based on URL
    if (navState.url.includes('payment-success') || navState.url.includes('success=true')) {
      handlePaymentSuccess();
    } else if (navState.url.includes('payment-failed') || navState.url.includes('success=false')) {
      handlePaymentFailure();
    }
  };

  // Handle payment success
  const handlePaymentSuccess = async () => {
    try {
      // Refresh wallet to get updated balance
      await refreshWallet();
      
      Alert.alert(
        'Payment Successful',
        'Money has been added to your wallet successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error refreshing wallet after payment:', error);
      Alert.alert(
        'Payment Successful',
        'Money has been added. Wallet will update shortly.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  };

  // Handle payment failure
  const handlePaymentFailure = () => {
    Alert.alert(
      'Payment Failed',
      'Your payment could not be processed. Please try again.',
      [
        {
          text: 'Retry',
          onPress: () => {
            if (webViewRef.current) {
              webViewRef.current.reload();
            }
          },
        },
        {
          text: 'Cancel',
          onPress: () => router.back(),
          style: 'cancel',
        },
      ]
    );
  };

  // Handle WebView errors
  const handleWebViewError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    setError('Failed to load payment page. Please check your internet connection.');
  };

  // Handle messages from WebView
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'PAYMENT_SUCCESS':
          handlePaymentSuccess();
          break;
        case 'PAYMENT_FAILED':
          handlePaymentFailure();
          break;
        case 'CLOSE_WEBVIEW':
          router.back();
          break;
        default:
          console.log('Unknown message from WebView:', data);
      }
    } catch (err) {
      console.error('Error parsing WebView message:', err);
    }
  };

  // Refresh WebView
  const handleRefresh = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
      setError(null);
    }
  };

  // Go back in WebView
  const handleGoBack = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
    } else {
      router.back();
    }
  };

  // Close WebView
  const handleClose = () => {
    Alert.alert(
      'Exit Payment',
      'Are you sure you want to exit? Your payment will be cancelled.',
      [
        {
          text: 'Continue Payment',
          style: 'cancel',
        },
        {
          text: 'Exit',
          onPress: () => router.back(),
          style: 'destructive',
        },
      ]
    );
  };

  // Render error state
  if (error) {
    return (
      <ScreenWrapper style={styles.container}>
        <Header title="Add Money" />
        
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={Colors.error} />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
          
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  // Render loading state
  if (!webViewUrl) {
    return (
      <ScreenWrapper style={styles.container}>
        <Header title="Add Money" />
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Initializing payment...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={styles.container}>
      {/* Custom Header with Controls */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleGoBack}>
          <Ionicons 
            name={canGoBack ? 'arrow-back' : 'close'} 
            size={24} 
            color={Colors.text} 
          />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Add Money</Text>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton} onPress={handleRefresh}>
            <Ionicons name="refresh" size={24} color={Colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingBar}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingBarText}>Loading...</Text>
        </View>
      )}

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: webViewUrl }}
        style={styles.webView}
        onNavigationStateChange={handleNavigationStateChange}
        onError={handleWebViewError}
        onMessage={handleMessage}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        allowsBackForwardNavigationGestures={true}
        renderLoading={() => (
          <View style={styles.webViewLoading}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  headerRight: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  loadingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary + '10',
    gap: Spacing.sm,
  },
  loadingBarText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
  },
  webView: {
    flex: 1,
  },
  webViewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  errorText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  retryButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textOnPrimary,
  },
  cancelButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  cancelButtonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
});
