import axios, { AxiosInstance, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// API Configuration
const getApiBaseUrl = () => {
  // Use environment variable, fallback to hosted backend
  return (
    process.env.EXPO_PUBLIC_API_BASE_URL || "https://wenews.onrender.com/api"
  );
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

// Investment/Growth Plans interfaces
export interface BackendInvestmentPlan {
  id: string;
  name: string;
  joiningAmount: number;
  levels: number;
  validity: number;
  dailyReturn: number;
  weeklyReturn: number;
  monthlyReturn: number;
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface GrowthPlan {
  id: string;
  name: string;
  description: string;
  plans: {
    daily: { initialPayment: number; contributionAmount: number };
    weekly: { initialPayment: number; contributionAmount: number };
    monthly: { initialPayment: number; contributionAmount: number };
  };
  planValidity: number;
  earnings: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  features: string[];
  color: string;
  gradient: [string, string];
  popular: boolean;
}

// Investment Plans API
export const investmentAPI = {
  // Get all investment plans
  getInvestmentPlans: async (): Promise<
    ApiResponse<BackendInvestmentPlan[]>
  > => {
    try {
      const response: AxiosResponse<ApiResponse<BackendInvestmentPlan[]>> =
        await api.get("/investment/plans");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching investment plans:", error);
      throw error;
    }
  },

  // Purchase investment plan
  purchaseInvestmentPlan: async (planId: string): Promise<ApiResponse<any>> => {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.post(
        "/investment/purchase",
        {
          planId,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error purchasing investment plan:", error);
      throw error;
    }
  },

  // Get user's current investment
  getMyInvestment: async (): Promise<ApiResponse<any>> => {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.get(
        "/investment/my-investment"
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching user investment:", error);
      throw error;
    }
  },
};

// Utility function to map backend investment plans to frontend growth plans structure
export const mapBackendPlansToGrowthPlans = (
  backendPlans: BackendInvestmentPlan[]
): GrowthPlan[] => {
  const planColorMapping: {
    [key: string]: { color: string; gradient: [string, string] };
  } = {
    bass: { color: "#3B82F6", gradient: ["#3B82F6", "#1D4ED8"] },
    silver: { color: "#6B7280", gradient: ["#6B7280", "#4B5563"] },
    gold: { color: "#F59E0B", gradient: ["#F59E0B", "#D97706"] },
    diamond: { color: "#8B5CF6", gradient: ["#8B5CF6", "#7C3AED"] },
    platinum: { color: "#10B981", gradient: ["#10B981", "#059669"] },
    eight: { color: "#DC2626", gradient: ["#DC2626", "#B91C1C"] },
  };

  const getDescription = (name: string): string => {
    const descriptions: { [key: string]: string } = {
      bass: "Start your growth journey",
      silver: "Enhanced growth opportunities",
      gold: "Premium growth experience",
      diamond: "Elite growth tier",
      platinum: "Ultimate growth package",
      eight: "The pinnacle of growth",
    };
    return (
      descriptions[name.toLowerCase()] || "Accelerate your financial growth"
    );
  };

  const getFeatures = (name: string): string[] => {
    const baseFeatures = [
      "Daily contribution tracking",
      "Growth rewards system",
      "Portfolio analytics",
      "Performance insights",
    ];

    const features: { [key: string]: string[] } = {
      bass: baseFeatures,
      silver: [
        "Everything in Bass Plan",
        "Higher growth rewards",
        "Priority support",
        "Advanced analytics",
      ],
      gold: [
        "Everything in Silver Plan",
        "Premium growth rates",
        "Exclusive insights",
        "Personal account manager",
      ],
      diamond: [
        "Everything in Gold Plan",
        "Maximum earning potential",
        "VIP customer support",
        "Early access to new plans",
      ],
      platinum: [
        "Everything in Diamond Plan",
        "Highest growth rewards",
        "Dedicated relationship manager",
        "Exclusive growth opportunities",
      ],
      eight: [
        "Everything in Platinum Plan",
        "Maximum daily contributions",
        "Elite status benefits",
        "Personalized growth strategy",
      ],
    };

    return features[name.toLowerCase()] || baseFeatures;
  };

  return backendPlans.map((backendPlan, index) => {
    const planKey = backendPlan.name.toLowerCase();
    const colorData = planColorMapping[planKey] || {
      color: "#3B82F6",
      gradient: ["#3B82F6", "#1D4ED8"] as [string, string],
    };

    // Calculate different frequency options based on daily return
    const dailyContribution = backendPlan.dailyReturn;
    const weeklyContribution = backendPlan.weeklyReturn;
    const monthlyContribution = backendPlan.monthlyReturn;

    // Calculate initial payments (keeping similar structure to mock data)
    const baseInitialPayment = backendPlan.joiningAmount;

    return {
      id: backendPlan.id,
      name: `${backendPlan.name} Plan`,
      description: getDescription(backendPlan.name),
      plans: {
        daily: {
          initialPayment: baseInitialPayment,
          contributionAmount: dailyContribution,
        },
        weekly: {
          initialPayment: Math.round(baseInitialPayment * 0.85), // Slight discount for weekly
          contributionAmount: weeklyContribution,
        },
        monthly: {
          initialPayment: Math.round(baseInitialPayment * 0.7), // Better discount for monthly
          contributionAmount: monthlyContribution,
        },
      },
      planValidity: backendPlan.validity,
      earnings: {
        daily: Math.round(dailyContribution * 1.8), // Growth potential calculation
        weekly: Math.round(weeklyContribution * 1.8),
        monthly: Math.round(monthlyContribution * 1.8),
      },
      features: getFeatures(backendPlan.name),
      color: colorData.color,
      gradient: colorData.gradient,
      popular: index === 1, // Make Silver plan popular (second plan)
    };
  });
};

export default api;
