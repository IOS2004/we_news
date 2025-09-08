import axios, { AxiosInstance, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// API Configuration
const getApiBaseUrl = () => {
  if (!__DEV__) {
    return "https://your-production-api.com/api";
  }

  // For development, use IP address for mobile (Expo Go)
  // React Native doesn't have window object, so this should work for mobile
  return "http://10.10.4.239:5000/api";
};

const API_BASE_URL = getApiBaseUrl();

// Token storage keys
export const TOKEN_STORAGE_KEY = "auth_token";
export const USER_STORAGE_KEY = "user_data";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Debug logging in development
if (__DEV__) {
  console.log("API Base URL:", API_BASE_URL);
}

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting token from storage:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (__DEV__) {
      console.log("API Error:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          method: error.config?.method,
          url: error.config?.url,
          baseURL: error.config?.baseURL,
        },
      });
    }

    // Handle 401 errors (token expired/invalid)
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, USER_STORAGE_KEY]);
      } catch (storageError) {
        console.error("Error clearing storage:", storageError);
      }
    }
    return Promise.reject(error);
  }
);

// API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

// User interfaces
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  role: "user" | "admin";
  preferences: {
    categories: string[];
    language: string;
    notifications: boolean;
  };
  referralCode: string;
  totalReferrals: number;
  referralEarnings: number;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}

export interface AuthData {
  user: User;
  token: string;
}

// Auth interfaces
export interface SignUpData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  referralCode?: string;
  preferences?: {
    categories?: string[];
    language?: string;
    notifications?: boolean;
  };
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  preferences?: {
    categories?: string[];
    language?: string;
    notifications?: boolean;
  };
}

// Authentication API
export const authAPI = {
  // Sign up
  signUp: async (data: SignUpData): Promise<ApiResponse<AuthData>> => {
    try {
      const response: AxiosResponse<ApiResponse<AuthData>> = await api.post(
        "/auth/signup",
        data
      );
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data || { success: false, message: "Network error" }
      );
    }
  },

  // Sign in
  signIn: async (data: SignInData): Promise<ApiResponse<AuthData>> => {
    try {
      const response: AxiosResponse<ApiResponse<AuthData>> = await api.post(
        "/auth/login",
        data
      );
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data || { success: false, message: "Network error" }
      );
    }
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<ApiResponse> => {
    try {
      const response: AxiosResponse<ApiResponse> = await api.post(
        "/auth/forgot-password",
        { email }
      );
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data || { success: false, message: "Network error" }
      );
    }
  },

  // Reset password
  resetPassword: async (
    token: string,
    password: string
  ): Promise<ApiResponse> => {
    try {
      const response: AxiosResponse<ApiResponse> = await api.post(
        "/auth/reset-password",
        {
          token,
          password,
        }
      );
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data || { success: false, message: "Network error" }
      );
    }
  },

  // Verify token
  verifyToken: async (): Promise<ApiResponse<{ user: User }>> => {
    try {
      const response: AxiosResponse<ApiResponse<{ user: User }>> =
        await api.get("/auth/verify");
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data || { success: false, message: "Network error" }
      );
    }
  },
};

// User API
export const userAPI = {
  // Get profile
  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    try {
      const response: AxiosResponse<ApiResponse<{ user: User }>> =
        await api.get("/user/profile");
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data || { success: false, message: "Network error" }
      );
    }
  },

  // Update profile
  updateProfile: async (
    data: UpdateProfileData
  ): Promise<ApiResponse<{ user: User }>> => {
    try {
      const response: AxiosResponse<ApiResponse<{ user: User }>> =
        await api.put("/user/profile", data);
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data || { success: false, message: "Network error" }
      );
    }
  },

  // Change password
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse> => {
    try {
      const response: AxiosResponse<ApiResponse> = await api.put(
        "/user/change-password",
        {
          currentPassword,
          newPassword,
        }
      );
      return response.data;
    } catch (error: any) {
      throw (
        error.response?.data || { success: false, message: "Network error" }
      );
    }
  },
};

// Storage utilities
export const storage = {
  // Save auth data
  saveAuthData: async (authData: AuthData): Promise<void> => {
    try {
      await AsyncStorage.multiSet([
        [TOKEN_STORAGE_KEY, authData.token],
        [USER_STORAGE_KEY, JSON.stringify(authData.user)],
      ]);
    } catch (error) {
      console.error("Error saving auth data:", error);
      throw error;
    }
  },

  // Get auth data
  getAuthData: async (): Promise<AuthData | null> => {
    try {
      const [[, token], [, userData]] = await AsyncStorage.multiGet([
        TOKEN_STORAGE_KEY,
        USER_STORAGE_KEY,
      ]);

      if (token && userData) {
        return {
          token,
          user: JSON.parse(userData),
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting auth data:", error);
      return null;
    }
  },

  // Clear auth data
  clearAuthData: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, USER_STORAGE_KEY]);
    } catch (error) {
      console.error("Error clearing auth data:", error);
      throw error;
    }
  },

  // Save user data
  saveUser: async (user: User): Promise<void> => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user data:", error);
      throw error;
    }
  },
};

export default api;
