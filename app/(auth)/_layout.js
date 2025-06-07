import { Stack } from "expo-router";
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home Page", headerShown: false }} />
      <Stack.Screen name="register" options={{ title: "Register", headerShown: true }} />
      <Stack.Screen name="forgot-password" options={{ title: "Forgot Password", headerShown: true }} />
    </Stack>
  );
}