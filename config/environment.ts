/**
 * Environment Configuration
 * Handles environment detection and configuration for different build types
 */

export type AppEnvironment = 'development' | 'preview' | 'production';

/**
 * Get the current app environment
 */
export const getEnvironment = (): AppEnvironment => {
  // First check if NODE_ENV is explicitly set
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === 'production') return 'production';
  if (nodeEnv === 'development') return 'development';
  
  // For Expo/React Native, check if we're in development mode
  if (__DEV__) return 'development';
  
  // Default to production for release builds
  return 'production';
};

/**
 * Environment-specific configuration
 */
export const config = {
  development: {
    apiBaseUrl: 'https://wenews-testing.onrender.com/api',
    cashfreeEnv: 'SANDBOX' as const,
    enableLogging: true,
    enableDebugMode: true,
  },
  preview: {
    apiBaseUrl: 'https://wenews-testing.onrender.com/api',
    cashfreeEnv: 'SANDBOX' as const,
    enableLogging: true,
    enableDebugMode: false,
  },
  production: {
    apiBaseUrl: 'https://wenews.onrender.com/api',
    cashfreeEnv: 'PROD' as const,
    enableLogging: false,
    enableDebugMode: false,
  },
};

/**
 * Get current environment configuration
 */
export const getCurrentConfig = () => {
  const env = getEnvironment();
  const envConfig = config[env];
  
  // Override with environment variables if provided
  return {
    ...envConfig,
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || envConfig.apiBaseUrl,
    cashfreeEnv: process.env.EXPO_PUBLIC_CASHFREE_ENV || envConfig.cashfreeEnv,
  };
};

/**
 * Check if app is in production mode
 */
export const isProduction = (): boolean => {
  return getEnvironment() === 'production';
};

/**
 * Check if app is in development mode
 */
export const isDevelopment = (): boolean => {
  return getEnvironment() === 'development';
};

/**
 * Log environment information (only in development)
 */
export const logEnvironmentInfo = () => {
  if (isDevelopment()) {
    const env = getEnvironment();
    const config = getCurrentConfig();
    
    console.log('🌍 Environment Info:');
    console.log('  📍 Current Environment:', env);
    console.log('  🔗 API Base URL:', config.apiBaseUrl);
    console.log('  💳 CashFree Environment:', config.cashfreeEnv);
    console.log('  🐛 Debug Mode:', config.enableDebugMode);
    console.log('  📊 Logging Enabled:', config.enableLogging);
    console.log('  🏗️ __DEV__:', __DEV__);
    console.log('  🔧 NODE_ENV:', process.env.NODE_ENV);
  }
};

export default {
  getEnvironment,
  getCurrentConfig,
  isProduction,
  isDevelopment,
  logEnvironmentInfo,
  config,
};