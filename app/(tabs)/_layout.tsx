import { Stack } from "expo-router";
import { useAppMode } from "../../contexts/AppModeContext";

export default function RootLayout() {
  const { currentMode } = useAppMode();
  
  if (currentMode === "home") {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(home)" />
      </Stack>
    );
  } else if (currentMode === "news") {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(news)" />
      </Stack>
    );
  } else if (currentMode === "trades") {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(trades)" />
      </Stack>
    );
  } else {
    // Default fallback to news
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(news)" />
      </Stack>
    );
  }
}
