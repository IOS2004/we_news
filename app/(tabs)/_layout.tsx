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
    // Future implementation for trades mode
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(home)" />
      </Stack>
    );
  } else {
    // Default fallback to home
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(home)" />
      </Stack>
    );
  }
}
