// firebase/NotificationService.tsx
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { logAction } from './LogService';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationSettings {
  pushNotificationsEnabled: boolean;
  medicalAlertsEnabled: boolean;
  criticalAlertsOnly: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string; // "08:00"
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export const defaultNotificationSettings: NotificationSettings = {
  pushNotificationsEnabled: true,
  medicalAlertsEnabled: true,
  criticalAlertsOnly: false,
  quietHoursEnabled: true,
  quietHoursStart: "22:00",
  quietHoursEnd: "08:00",
  soundEnabled: true,
  vibrationEnabled: true,
};

export class NotificationService {
  // Request notification permissions
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Push notification permissions not granted');
        return false;
      }

      // Get push token for this device
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('medical-alerts', {
          name: 'Medical Alerts',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  // Get push token for the device
  static async getPushToken(): Promise<string | null> {
    try {
      const token = await Notifications.getExpoPushTokenAsync();
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  // Save user's notification settings to Firestore
  static async saveNotificationSettings(
    userId: string,
    settings: NotificationSettings,
    userEmail: string,
    userRole: string
  ): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        notificationSettings: settings,
        pushToken: await this.getPushToken(),
        lastNotificationSettingsUpdate: new Date(),
      });

      // Log the settings change
      await logAction(
        userId,
        '',
        userEmail,
        userRole as any,
        'NOTIFICATION_SETTINGS_UPDATED',
        'success',
        settings
      );

      return true;
    } catch (error) {
      console.error('Error saving notification settings:', error);
      return false;
    }
  }

  // Load user's notification settings from Firestore
  static async loadNotificationSettings(userId: string): Promise<NotificationSettings> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists() && userDoc.data().notificationSettings) {
        return userDoc.data().notificationSettings as NotificationSettings;
      }
      
      return defaultNotificationSettings;
    } catch (error) {
      console.error('Error loading notification settings:', error);
      return defaultNotificationSettings;
    }
  }

  // Check if it's quiet hours
  static isQuietHours(settings: NotificationSettings): boolean {
    if (!settings.quietHoursEnabled) return false;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const start = settings.quietHoursStart;
    const end = settings.quietHoursEnd;
    
    // Handle overnight quiet hours (e.g., 22:00 to 08:00)
    if (start > end) {
      return currentTime >= start || currentTime <= end;
    }
    
    // Handle same-day quiet hours (e.g., 13:00 to 17:00)
    return currentTime >= start && currentTime <= end;
  }

  // Check if notification should be sent based on settings
  static shouldSendNotification(
    settings: NotificationSettings,
    alertSeverity: 'mild' | 'warning' | 'severe' | 'critical'
  ): boolean {
    // Check if push notifications are enabled
    if (!settings.pushNotificationsEnabled || !settings.medicalAlertsEnabled) {
      return false;
    }

    // Check if only critical alerts are enabled
    if (settings.criticalAlertsOnly && alertSeverity !== 'critical') {
      return false;
    }

    // Always send critical alerts, even during quiet hours
    if (alertSeverity === 'critical') {
      return true;
    }

    // Check quiet hours for non-critical alerts
    if (this.isQuietHours(settings)) {
      return false;
    }

    return true;
  }

  // Send push notification for medical alert
  static async sendMedicalAlertNotification(
    userId: string,
    alertData: {
      patientName: string;
      readingType: string;
      severity: 'mild' | 'warning' | 'severe' | 'critical';
      value: string;
      description: string;
    }
  ): Promise<boolean> {
    try {
      // Load user settings
      const settings = await this.loadNotificationSettings(userId);
      
      // Check if notification should be sent
      if (!this.shouldSendNotification(settings, alertData.severity)) {
        console.log('Notification not sent due to user settings');
        return false;
      }

      // Get severity emoji and title
      const getSeverityInfo = (severity: string) => {
        switch (severity) {
          case 'critical': return { emoji: '🚨', title: 'CRITICAL ALERT' };
          case 'severe': return { emoji: '⚠️', title: 'SEVERE ALERT' };
          case 'warning': return { emoji: '⚠️', title: 'WARNING' };
          case 'mild': return { emoji: '⚡', title: 'ALERT' };
          default: return { emoji: '📋', title: 'ALERT' };
        }
      };

      const severityInfo = getSeverityInfo(alertData.severity);
      
      // Schedule the notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${severityInfo.emoji} ${severityInfo.title}`,
          body: `${alertData.patientName}: ${alertData.readingType} reading ${alertData.value}`,
          data: {
            type: 'medical_alert',
            severity: alertData.severity,
            patientName: alertData.patientName,
            readingType: alertData.readingType,
            value: alertData.value,
            screen: 'medical-alert-detail',
          },
          sound: settings.soundEnabled ? 'default' : false,
          priority: alertData.severity === 'critical' ? 'high' : 'normal',
        },
        trigger: null, // Send immediately
      });

      // Log the notification
      await logAction(
        userId,
        '',
        '',
        'caretaker',
        'PUSH_NOTIFICATION_SENT',
        'success',
        {
          notificationType: 'medical_alert',
          severity: alertData.severity,
          patientName: alertData.patientName,
          readingType: alertData.readingType,
          value: alertData.value,
          sentDuringQuietHours: this.isQuietHours(settings),
          timestamp: new Date().toISOString(),
        }
      );

      return true;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return false;
    }
  }

  // Handle notification response (when user taps notification)
  static setupNotificationResponseHandler() {
    Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      
      if (data.type === 'medical_alert' && data.screen) {
        // Navigate to the alert detail screen
        // This would need to be implemented with your navigation system
        console.log('Navigate to:', data.screen, data);
      }
    });
  }

  // Initialize notification service
  static async initialize(userId: string, userRole: string): Promise<boolean> {
    try {
      // Only set up push notifications for caretakers
      if (userRole !== 'caretaker') {
        console.log('Push notifications only enabled for caretakers');
        return false;
      }

      // Request permissions
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log('Notification permissions denied');
        return false;
      }

      // Set up response handler
      this.setupNotificationResponseHandler();

      // Update user's push token in Firestore
      const pushToken = await this.getPushToken();
      if (pushToken) {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          pushToken: pushToken,
          lastPushTokenUpdate: new Date(),
        });
      }

      console.log('Notification service initialized for caretaker');
      return true;
    } catch (error) {
      console.error('Error initializing notification service:', error);
      return false;
    }
  }
}

export default NotificationService;
