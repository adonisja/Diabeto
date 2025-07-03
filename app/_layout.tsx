// app/_layout.tsx

import { useEffect } from "react";
import { Stack } from "expo-router";
import AuthProvider from "../firebase/AuthContext";
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  useEffect(() => {
    // Hide splash screen after a brief moment to allow app to initialize
    const timer = setTimeout(() => {
      SplashScreen.hideAsync().catch(console.warn);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(protected)" options={{ headerShown: false }} />
      <Stack.Screen name="[...unmatched]" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}