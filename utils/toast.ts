import Toast from "react-native-toast-message";

export interface ToastConfig {
  title?: string;
  message: string;
  duration?: number;
}

export const showToast = {
  success: (config: ToastConfig) => {
    Toast.show({
      type: "success",
      text1: config.title || "Success",
      text2: config.message,
      visibilityTime: config.duration || 3000,
      position: "top",
    });
  },

  error: (config: ToastConfig) => {
    Toast.show({
      type: "error",
      text1: config.title || "Error",
      text2: config.message,
      visibilityTime: config.duration || 4000,
      position: "top",
    });
  },

  warning: (config: ToastConfig) => {
    Toast.show({
      type: "info",
      text1: config.title || "Warning",
      text2: config.message,
      visibilityTime: config.duration || 3500,
      position: "top",
    });
  },

  info: (config: ToastConfig) => {
    Toast.show({
      type: "info",
      text1: config.title || "Info",
      text2: config.message,
      visibilityTime: config.duration || 3000,
      position: "top",
    });
  },
};

// Helper function to handle API errors
export const handleApiError = (
  error: any,
  fallbackMessage: string = "Something went wrong"
) => {
  let errorMessage = fallbackMessage;

  if (error?.message) {
    errorMessage = error.message;
  } else if (error?.response?.data?.message) {
    errorMessage = error.response.data.message;
  } else if (error?.data?.message) {
    errorMessage = error.data.message;
  }

  // Handle validation errors
  if (error?.errors && Array.isArray(error.errors)) {
    errorMessage = error.errors
      .map((err: any) => err.msg || err.message)
      .join(", ");
  }

  showToast.error({
    title: "Error",
    message: errorMessage,
  });
};

export default showToast;
