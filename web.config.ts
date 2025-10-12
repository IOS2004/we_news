// Web-specific polyfills and configurations
if (typeof window !== "undefined") {
  // Add any web-specific initializations here

  // Disable console warnings in production
  if (process.env.NODE_ENV === "production") {
    console.log = () => {};
    console.warn = () => {};
  }
}

export {};
