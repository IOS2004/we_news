import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  authAPI, 
  userAPI, 
  storage, 
  User, 
  AuthData, 
  SignUpData, 
  SignInData, 
  UpdateProfileData,
  ApiResponse 
} from '../services/api';
import { showToast, handleApiError } from '../utils/toast';

interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  signUp: (data: SignUpData) => Promise<boolean>;
  signIn: (data: SignInData) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
  
  // Developer methods
  developerSignIn: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      console.log('[AuthContext] Initializing auth...');
      const authData = await storage.getAuthData();

      if (authData) {
        console.log('[AuthContext] Found stored auth data, validating token...');
        // Try to validate the existing token by fetching the user profile
        try {
          const profileResponse = await userAPI.getProfile();
          
          if (profileResponse.success && profileResponse.data?.user) {
            // Token is valid, use it with updated user data
            console.log('[AuthContext] Token valid, user authenticated:', profileResponse.data.user.email);
            setUser(profileResponse.data.user);
            await storage.saveAuthData({ 
              token: authData.token, 
              user: profileResponse.data.user 
            });
            return;
          }
        } catch (profileError: any) {
          console.warn('[AuthContext] Token validation failed:', profileError.message);
          
          // Only try to refresh if we get a 401 (unauthorized) error
          if (profileError?.response?.status === 401) {
            console.log('[AuthContext] Attempting token refresh...');
            try {
              const refreshResponse = await authAPI.refreshToken();

              if (refreshResponse.success && refreshResponse.data?.token) {
                const newToken = refreshResponse.data.token;
                console.log('[AuthContext] Token refreshed successfully');
                await storage.saveToken(newToken);

                // Try to get profile again with new token
                const newProfileResponse = await userAPI.getProfile();
                if (newProfileResponse.success && newProfileResponse.data?.user) {
                  console.log('[AuthContext] User authenticated after refresh');
                  setUser(newProfileResponse.data.user);
                  await storage.saveAuthData({ 
                    token: newToken, 
                    user: newProfileResponse.data.user 
                  });
                  return;
                }
              }
            } catch (refreshError) {
              console.error('[AuthContext] Token refresh failed:', refreshError);
            }
          } else {
            // Network or other error - keep the user signed in with cached data
            console.log('[AuthContext] Network error during validation, using cached data');
            setUser(authData.user);
            return;
          }
          
          // If we get here, both validation and refresh failed
          console.log('[AuthContext] Session expired, clearing auth data');
          await storage.clearAuthData();
          setUser(null);
        }
      } else {
        console.log('[AuthContext] No stored auth data found');
        setUser(null);
      }
    } catch (error) {
      console.error('[AuthContext] Error initializing auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const signUp = async (data: SignUpData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authAPI.signUp(data);
      
      if (response.success && response.data) {
        await storage.saveAuthData(response.data);
        setUser(response.data.user);
        showToast.success({
          title: 'Welcome!',
          message: `Account created successfully. Welcome ${response.data.user.firstName}!`,
        });
        return true;
      } else {
        handleApiError(response, 'Failed to create account');
        return false;
      }
    } catch (error: any) {
      handleApiError(error, 'Failed to create account');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (data: SignInData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('[AuthContext] Signing in...');
      const response = await authAPI.signIn(data);
      
      if (response.success && response.data) {
        console.log('[AuthContext] Sign in successful, saving auth data...');
        await storage.saveAuthData(response.data);
        console.log('[AuthContext] Auth data saved to AsyncStorage');
        setUser(response.data.user);
        showToast.success({
          title: 'Welcome back!',
          message: `Successfully signed in. Hi ${response.data.user.firstName}!`,
        });
        return true;
      } else {
        console.error('[AuthContext] Sign in failed:', response);
        handleApiError(response, 'Failed to sign in');
        return false;
      }
    } catch (error: any) {
      console.error('[AuthContext] Sign in error:', error);
      handleApiError(error, 'Failed to sign in');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await storage.clearAuthData();
      setUser(null);
      setError(null);
      showToast.info({
        title: 'Signed out',
        message: 'You have been successfully signed out',
      });
    } catch (error) {
      console.error('Error signing out:', error);
      handleApiError(error, 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await userAPI.updateProfile(data);
      
      if (response.success && response.data) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        await storage.saveUser(updatedUser);
        showToast.success({
          title: 'Profile Updated',
          message: 'Your profile has been updated successfully',
        });
        return true;
      } else {
        handleApiError(response, 'Failed to update profile');
        return false;
      }
    } catch (error: any) {
      handleApiError(error, 'Failed to update profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await userAPI.changePassword(currentPassword, newPassword);
      
      if (response.success) {
        showToast.success({
          title: 'Password Changed',
          message: 'Your password has been changed successfully',
        });
        return true;
      } else {
        handleApiError(response, 'Failed to change password');
        return false;
      }
    } catch (error: any) {
      handleApiError(error, 'Failed to change password');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authAPI.forgotPassword(email);
      
      if (response.success) {
        showToast.success({
          title: 'Email Sent',
          message: 'Password reset link has been sent to your email',
        });
        return true;
      } else {
        handleApiError(response, 'Failed to send reset email');
        return false;
      }
    } catch (error: any) {
      handleApiError(error, 'Failed to send reset email');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authAPI.resetPassword(token, password);
      
      if (response.success) {
        showToast.success({
          title: 'Password Reset',
          message: 'Your password has been reset successfully',
        });
        return true;
      } else {
        handleApiError(response, 'Failed to reset password');
        return false;
      }
    } catch (error: any) {
      handleApiError(error, 'Failed to reset password');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      if (!isAuthenticated) return;

      const refreshResponse = await authAPI.refreshToken();

      if (!refreshResponse.success || !refreshResponse.data?.token) {
        throw new Error('Failed to refresh token');
      }

      const newToken = refreshResponse.data.token;
      await storage.saveToken(newToken);

      const profileResponse = await userAPI.getProfile();

      if (profileResponse.success && profileResponse.data?.user) {
        const updatedUser = profileResponse.data.user;
        setUser(updatedUser);
        await storage.saveAuthData({ token: newToken, user: updatedUser });
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const developerSignIn = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Create dummy user data for development
      const dummyUser: User = {
        id: 'dev-user-123',
        username: 'developer',
        firstName: 'Developer',
        lastName: 'User',
        email: 'developer@wenews.com',
        profilePicture: undefined,
        role: 'user',
        preferences: {
          categories: ['technology', 'business', 'entertainment'],
          language: 'en',
          notifications: true,
        },
        referralCode: 'DEV123',
        totalReferrals: 12,
        referralEarnings: 500,
        walletBalance: 1200,
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      // Create dummy auth data
      const dummyAuthData: AuthData = {
        token: 'dev-token-123',
        user: dummyUser,
      };

      // Save to storage for persistence
      await storage.saveAuthData(dummyAuthData);
      setUser(dummyUser);
      
      showToast.success({
        title: 'Developer Access',
        message: 'Signed in with dummy data for development',
      });
      
      return true;
    } catch (error: any) {
      console.error('Developer sign-in error:', error);
      showToast.error({
        title: 'Developer Sign-in Failed',
        message: 'Failed to sign in with developer data',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    clearError,
    refreshUser,
    developerSignIn,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
