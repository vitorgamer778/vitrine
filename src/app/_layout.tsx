import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StoreProvider } from "../store";
import { useEffect } from "react";
import { Platform } from "react-native";
export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "web") document.documentElement.lang = "pt-BR";
  }, []);
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
