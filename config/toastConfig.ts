import React from "react";
import {
  BaseToast,
  ErrorToast,
  InfoToast,
  ToastConfig,
} from "react-native-toast-message";
import { Colors, Typography, Spacing, BorderRadius } from "../constants/theme";

const shadowStyle = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

const baseStyle = {
  paddingVertical: Spacing.md,
  minHeight: 70,
  backgroundColor: Colors.surface,
  borderRadius: BorderRadius.lg,
  ...shadowStyle,
};

const contentStyle = {
  paddingHorizontal: Spacing.lg,
};

const text1Style = {
  fontSize: Typography.fontSize.base,
  fontWeight: Typography.fontWeight.bold as any,
  color: Colors.text,
  marginBottom: 2,
};

const text2Style = {
  fontSize: Typography.fontSize.sm,
  color: Colors.textSecondary,
  fontWeight: Typography.fontWeight.normal as any,
  lineHeight: 18,
};

export const toastConfig: ToastConfig = {
  success: (props: any) =>
    React.createElement(BaseToast, {
      ...props,
      style: {
        ...baseStyle,
        borderLeftColor: Colors.success,
        borderLeftWidth: 7,
      },
      contentContainerStyle: contentStyle,
      text1Style: text1Style,
      text2Style: text2Style,
      text2NumberOfLines: 3,
    }),

  error: (props: any) =>
    React.createElement(ErrorToast, {
      ...props,
      style: {
        ...baseStyle,
        borderLeftColor: Colors.error,
        borderLeftWidth: 7,
      },
      contentContainerStyle: contentStyle,
      text1Style: text1Style,
      text2Style: text2Style,
      text2NumberOfLines: 3,
    }),

  info: (props: any) =>
    React.createElement(InfoToast, {
      ...props,
      style: {
        ...baseStyle,
        borderLeftColor: Colors.primary,
        borderLeftWidth: 7,
      },
      contentContainerStyle: contentStyle,
      text1Style: text1Style,
      text2Style: text2Style,
      text2NumberOfLines: 3,
    }),
};
