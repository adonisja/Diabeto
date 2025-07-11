// Load environment variables first
require('dotenv').config();

module.exports = {
  expo: {
    name: "Diabeto",
    slug: "Diabeto",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.adonisja.Diabeto",
      infoPlist: {
        UIBackgroundModes: ["background-app-refresh", "background-processing"]
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.adonisja.Diabeto",
      permissions: [
        "CAMERA", 
        "READ_EXTERNAL_STORAGE", 
        "WRITE_EXTERNAL_STORAGE",
        "RECEIVE_BOOT_COMPLETED",
        "VIBRATE",
        "com.android.alarm.permission.SET_ALARM",
        "android.permission.SCHEDULE_EXACT_ALARM"
      ],
      edgeToEdgeEnabled: true
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-notifications",
        {
          icon: "./assets/images/icon.png",
          color: "#ffffff"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      googleOAuthClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
      googleOAuthIosClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID,
      googleOAuthAndroidClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_ANDROID_CLIENT_ID,
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      nodeEnv: process.env.NODE_ENV,
      debugMode: process.env.DEBUG_MODE,
      eas: {
        projectId: "your-eas-project-id-here" // Add this if using EAS
      }
    }
  }
};
