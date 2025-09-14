import { Stack } from "expo-router";

const appMode = "home"; // or "news"

export default function RootLayout() {
  if (appMode === "home") {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(home)" />
      </Stack>
    );
  } else {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(news)" />
      </Stack>
    );
  }
}
