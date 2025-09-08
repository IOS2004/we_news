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
      const authData = await storage.getAuthData();
      
      if (authData) {
        // Verify token is still valid
        try {
          const response = await authAPI.verifyToken();
          if (response.success && response.data) {
            setUser(response.data.user);
            // Update stored user data
            await storage.saveUser(response.data.user);
          } else {
            // Token is invalid, clear storage
            await storage.clearAuthData();
          }
        } catch (error) {
          // Token verification failed, clear storage
          await storage.clearAuthData();
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
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

      const response = await authAPI.signIn(data);
      
      if (response.success && response.data) {
        await storage.saveAuthData(response.data);
        setUser(response.data.user);
        showToast.success({
          title: 'Welcome back!',
          message: `Successfully signed in. Hi ${response.data.user.firstName}!`,
        });
        return true;
      } else {
        handleApiError(response, 'Failed to sign in');
        return false;
      }
    } catch (error: any) {
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

      const response = await userAPI.getProfile();
      
      if (response.success && response.data) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        await storage.saveUser(updatedUser);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
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
