// This declares a module for 'expo-router/entry', telling TypeScript
// that this module exists and its type is 'any' (or more specific if you know it).
// For 'expo-router/entry', which is essentially a component, 'any' is usually sufficient.
declare module 'expo-router/entry' {
  import React from 'react';
  const ExpoRoot: React.ComponentType<any>; // Declare it as a React component
  export default ExpoRoot;
}