import { Stack } from 'expo-router';

export default function AuthLayout() {
  // 1. Stack Navigator Definition:
  // This Stack component defines the screens within the (auth) group.
  // `screenOptions={{ headerShown: false }}` means no default header will be shown for any screen in this group.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 2. Screen Definitions: */}
      {/* Each `Stack.Screen` corresponds to a file in the `app/(auth)` directory. */}
      {/* `name="index"` maps to `app/(auth)/index.tsx`, which is my authentication hub. */}
      <Stack.Screen name="index" options={{ title: 'Auth Landing' }} />
      {/* `name="Signin"` maps to `app/(auth)/Signin.tsx`. */}
      <Stack.Screen name="Signin" options={{ title: 'Sign In' }} />
      {/* `name="Signup"` maps to `app/(auth)/Signup.tsx`. */}
      <Stack.Screen name="Signup" options={{ title: 'Sign Up' }} />
      {/* `name="Forgot-Password"` maps to `app/(auth)/Forgot-Password.tsx`. */}
      <Stack.Screen name="Forgot-Password" options={{ title: 'Forgot Password' }} />
    </Stack>
  );
}