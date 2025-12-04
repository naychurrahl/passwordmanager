import { AppProvider } from "@/components/AppContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="AuthModal" options={{presentation: "modal"}}/>
      </Stack>
    </AppProvider>
  );
}
