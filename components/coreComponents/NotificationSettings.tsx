// components/coreComponents/NotificationSettings.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  ScrollView,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../firebase/AuthContext';
import NotificationService, { NotificationSettings as NotificationSettingsType, defaultNotificationSettings } from '../../firebase/NotificationService';
import { logAction } from '../../firebase/LogService';
import { notificationSettingsStyles } from '../../assets/styles/componentStyles/notificationSettingsStyles';

interface NotificationSettingsProps {
  onClose: () => void;
}

export default function NotificationSettings({ onClose }: NotificationSettingsProps) {
  const { user, userProfile } = useAuth();
  const [settings, setSettings] = useState<NotificationSettingsType>(defaultNotificationSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      const userSettings = await NotificationService.loadNotificationSettings(user.uid);
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading notification settings:', error);
      Alert.alert('Error', 'Failed to load notification settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!user?.uid) return;

    try {
      setSaving(true);
      
      // Log settings save attempt
      await logAction(
        user.uid,
        userProfile?.username || '',
        user.email || '',
        userProfile?.role || 'caretaker',
        'NOTIFICATION_SETTINGS_SAVE_ATTEMPT',
        'success',
        {
          settingsCount: Object.keys(settings).length,
          pushNotificationsEnabled: settings.pushNotificationsEnabled,
          timestamp: new Date().toISOString()
        }
      );
      
      const success = await NotificationService.saveNotificationSettings(
        user.uid,
        settings,
        user.email || '',
        userProfile?.role || 'caretaker'
      );

      if (success) {
        // Log successful settings save
        await logAction(
          user.uid,
          userProfile?.username || '',
          user.email || '',
          userProfile?.role || 'caretaker',
          'NOTIFICATION_SETTINGS_SAVED',
          'success',
          {
            settings: settings,
            timestamp: new Date().toISOString()
          }
        );
        
        Alert.alert('Success', 'Notification settings saved successfully');
      } else {
        // Log settings save failure
        await logAction(
          user.uid,
          userProfile?.username || '',
          user.email || '',
          userProfile?.role || 'caretaker',
          'NOTIFICATION_SETTINGS_SAVE_FAILED',
          'failure',
          {
            error: 'Service returned false',
            timestamp: new Date().toISOString()
          }
        );
        
        Alert.alert('Error', 'Failed to save notification settings');
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      
      // Log settings save error
      await logAction(
        user?.uid || '',
        userProfile?.username || '',
        user?.email || '',
        userProfile?.role || 'caretaker',
        'NOTIFICATION_SETTINGS_SAVE_ERROR',
        'failure',
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      );
      
      Alert.alert('Error', 'Failed to save notification settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof NotificationSettingsType, value: any) => {
    setSettings((prev: NotificationSettingsType) => ({
      ...prev,
      [key]: value
    }));
  };

  const requestPermissions = async () => {
    const hasPermission = await NotificationService.requestPermissions();
    if (hasPermission) {
      updateSetting('pushNotificationsEnabled', true);
      
      // Log successful permission grant
      await logAction(
        user?.uid || '',
        userProfile?.username || '',
        user?.email || '',
        userProfile?.role || 'caretaker',
        'NOTIFICATION_PERMISSIONS_GRANTED',
        'success',
        {
          platform: Platform.OS,
          timestamp: new Date().toISOString()
        }
      );
      
      Alert.alert('Success', 'Push notifications enabled successfully');
    } else {
      // Log permission denial
      await logAction(
        user?.uid || '',
        userProfile?.username || '',
        user?.email || '',
        userProfile?.role || 'caretaker',
        'NOTIFICATION_PERMISSIONS_DENIED',
        'failure',
        {
          platform: Platform.OS,
          timestamp: new Date().toISOString()
        }
      );
      
      Alert.alert(
        'Permission Denied',
        'Please enable notifications in your device settings to receive medical alerts.'
      );
    }
  };

  const renderToggleRow = (
    title: string,
    subtitle: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    icon: string,
    disabled: boolean = false
  ) => (
    <View style={[notificationSettingsStyles.settingRow, disabled && notificationSettingsStyles.disabledRow]}>
      <View style={notificationSettingsStyles.settingIcon}>
        <Ionicons name={icon as any} size={24} color={disabled ? '#BDC3C7' : '#5C6AC4'} />
      </View>
      <View style={notificationSettingsStyles.settingContent}>
        <Text style={[notificationSettingsStyles.settingTitle, disabled && notificationSettingsStyles.disabledText]}>
          {title}
        </Text>
        <Text style={[notificationSettingsStyles.settingSubtitle, disabled && notificationSettingsStyles.disabledText]}>
          {subtitle}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor={value ? '#5C6AC4' : '#BDC3C7'}
        trackColor={{ false: '#E5E5E5', true: '#A855F7' }}
        disabled={disabled}
      />
    </View>
  );

  const renderTimeRow = (
    title: string,
    subtitle: string,
    value: string,
    onPress: () => void,
    icon: string,
    disabled: boolean = false
  ) => (
    <TouchableOpacity
      style={[notificationSettingsStyles.settingRow, disabled && notificationSettingsStyles.disabledRow]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      <View style={notificationSettingsStyles.settingIcon}>
        <Ionicons name={icon as any} size={24} color={disabled ? '#BDC3C7' : '#5C6AC4'} />
      </View>
      <View style={notificationSettingsStyles.settingContent}>
        <Text style={[notificationSettingsStyles.settingTitle, disabled && notificationSettingsStyles.disabledText]}>
          {title}
        </Text>
        <Text style={[notificationSettingsStyles.settingSubtitle, disabled && notificationSettingsStyles.disabledText]}>
          {subtitle}
        </Text>
      </View>
      <View style={notificationSettingsStyles.timeDisplay}>
        <Text style={[notificationSettingsStyles.timeText, disabled && notificationSettingsStyles.disabledText]}>
          {value}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={disabled ? '#BDC3C7' : '#95A5A6'} />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={notificationSettingsStyles.container}>
        <View style={notificationSettingsStyles.loadingContainer}>
          <Text style={notificationSettingsStyles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={notificationSettingsStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5C6AC4" />
      
      {/* Header */}
      <LinearGradient
        colors={['#5C6AC4', '#667EEA']}
        style={notificationSettingsStyles.header}
      >
        <TouchableOpacity style={notificationSettingsStyles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={notificationSettingsStyles.headerTitle}>Notification Settings</Text>
        <View style={notificationSettingsStyles.placeholder} />
      </LinearGradient>

      <ScrollView style={notificationSettingsStyles.scrollContainer}>
        {/* Main Settings */}
        <View style={notificationSettingsStyles.section}>
          <Text style={notificationSettingsStyles.sectionTitle}>📱 Push Notifications</Text>
          
          {!settings.pushNotificationsEnabled && (
            <TouchableOpacity
              style={notificationSettingsStyles.enableButton}
              onPress={requestPermissions}
            >
              <Ionicons name="notifications-outline" size={20} color="#fff" />
              <Text style={notificationSettingsStyles.enableButtonText}>
                Enable Push Notifications
              </Text>
            </TouchableOpacity>
          )}

          {renderToggleRow(
            'Push Notifications',
            'Receive notifications on your device',
            settings.pushNotificationsEnabled,
            (value) => updateSetting('pushNotificationsEnabled', value),
            'notifications',
            false
          )}

          {renderToggleRow(
            'Medical Alerts',
            'Get notified about abnormal patient readings',
            settings.medicalAlertsEnabled,
            (value) => updateSetting('medicalAlertsEnabled', value),
            'medical',
            !settings.pushNotificationsEnabled
          )}

          {renderToggleRow(
            'Critical Alerts Only',
            'Only receive notifications for critical situations',
            settings.criticalAlertsOnly,
            (value) => updateSetting('criticalAlertsOnly', value),
            'warning',
            !settings.medicalAlertsEnabled
          )}
        </View>

        {/* Quiet Hours */}
        <View style={notificationSettingsStyles.section}>
          <Text style={notificationSettingsStyles.sectionTitle}>🌙 Quiet Hours</Text>
          
          {renderToggleRow(
            'Enable Quiet Hours',
            'Reduce notifications during specified hours',
            settings.quietHoursEnabled,
            (value) => updateSetting('quietHoursEnabled', value),
            'moon',
            !settings.pushNotificationsEnabled
          )}

          {renderTimeRow(
            'Quiet Hours Start',
            'When to start reducing notifications',
            settings.quietHoursStart,
            () => {
              // This would open a time picker
              Alert.alert('Time Picker', 'Time picker would open here');
            },
            'time',
            !settings.quietHoursEnabled
          )}

          {renderTimeRow(
            'Quiet Hours End',
            'When to resume normal notifications',
            settings.quietHoursEnd,
            () => {
              // This would open a time picker
              Alert.alert('Time Picker', 'Time picker would open here');
            },
            'time',
            !settings.quietHoursEnabled
          )}
        </View>

        {/* Sound & Vibration */}
        <View style={notificationSettingsStyles.section}>
          <Text style={notificationSettingsStyles.sectionTitle}>🔊 Sound & Vibration</Text>
          
          {renderToggleRow(
            'Sound',
            'Play sound for notifications',
            settings.soundEnabled,
            (value) => updateSetting('soundEnabled', value),
            'volume-high',
            !settings.pushNotificationsEnabled
          )}

          {renderToggleRow(
            'Vibration',
            'Vibrate for notifications',
            settings.vibrationEnabled,
            (value) => updateSetting('vibrationEnabled', value),
            'phone-portrait',
            !settings.pushNotificationsEnabled
          )}
        </View>

        {/* Info Section */}
        <View style={notificationSettingsStyles.infoSection}>
          <View style={notificationSettingsStyles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#3B82F6" />
            <Text style={notificationSettingsStyles.infoText}>
              Critical alerts will always be delivered, even during quiet hours. 
              Doctors receive alerts only when they visit the app.
            </Text>
          </View>
        </View>

        {/* Save Button */}
        <View style={notificationSettingsStyles.buttonContainer}>
          <TouchableOpacity
            style={[
              notificationSettingsStyles.saveButton,
              saving && notificationSettingsStyles.saveButtonDisabled
            ]}
            onPress={saveSettings}
            disabled={saving}
          >
            <LinearGradient
              colors={saving ? ['#BDC3C7', '#95A5A6'] : ['#10B981', '#059669']}
              style={notificationSettingsStyles.saveButtonGradient}
            >
              <Ionicons
                name={saving ? 'time-outline' : 'checkmark-circle-outline'}
                size={20}
                color="#fff"
              />
              <Text style={notificationSettingsStyles.saveButtonText}>
                {saving ? 'Saving...' : 'Save Settings'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={notificationSettingsStyles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}
