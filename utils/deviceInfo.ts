/**
 * Device information utilities for audit logging
 * Provides consistent device identification across the app
 */
import { Platform } from 'react-native';

export interface DeviceInfo {
  deviceId: string;
  deviceType: string;
  osName: string;
  osVersion: string;
  modelName: string;
  brand: string;
}

// Lazy import Device only when needed and not on web
let Device: typeof import('expo-device') | null = null;

const loadDevice = async () => {
  if (Platform.OS === 'web') {
    return null;
  }
  if (!Device) {
    try {
      Device = require('expo-device');
    } catch (error) {
      console.warn('expo-device not available:', error);
      return null;
    }
  }
  return Device;
};

/**
 * Gets comprehensive device information for logging purposes
 * @returns Promise<DeviceInfo> - Device information object
 */
export const getDeviceInfo = async (): Promise<DeviceInfo> => {
  try {
    // For web platform, use basic browser info
    if (Platform.OS === 'web') {
      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent || 'unknown-browser' : 'unknown-browser';
      const platform = typeof navigator !== 'undefined' ? navigator.platform || 'unknown-platform' : 'unknown-platform';
      
      return {
        deviceId: `web-${platform}-${Date.now()}`,
        deviceType: 'web-browser',
        osName: platform,
        osVersion: 'unknown',
        modelName: 'browser',
        brand: 'web'
      };
    }

    // For React Native platforms, use expo-device
    const DeviceModule = await loadDevice();
    
    if (DeviceModule) {
      const deviceType = DeviceModule.deviceType ? DeviceModule.DeviceType[DeviceModule.deviceType] : 'unknown';
      const osName = DeviceModule.osName || Platform.OS;
      const osVersion = DeviceModule.osVersion || 'unknown-version';
      const modelName = DeviceModule.modelName || 'unknown-model';
      const brand = DeviceModule.brand || 'unknown-brand';
      
      // Create a semi-unique device identifier
      const deviceId = `${osName}-${modelName}-${brand}-${deviceType}`.replace(/\s+/g, '-').toLowerCase();
      
      return {
        deviceId,
        deviceType,
        osName,
        osVersion,
        modelName,
        brand
      };
    }
    
    // Fallback if expo-device is not available
    throw new Error('expo-device not available');
    
  } catch (error) {
    console.warn('Could not get device info:', error);
    
    // Fallback based on platform
    const fallbackId = Platform.OS === 'web' 
      ? `web-fallback-${Date.now()}`
      : `${Platform.OS}-fallback-${Date.now()}`;
      
    return {
      deviceId: fallbackId,
      deviceType: Platform.OS === 'web' ? 'web-browser' : 'mobile',
      osName: Platform.OS,
      osVersion: 'unknown',
      modelName: 'unknown',
      brand: 'unknown'
    };
  }
};

/**
 * Gets a simple device ID string for basic logging
 * @returns Promise<string> - Simple device identifier
 */
export const getSimpleDeviceId = async (): Promise<string> => {
  try {
    const info = await getDeviceInfo();
    return info.deviceId;
  } catch (error) {
    console.warn('DeviceInfo: Error getting device ID, using fallback:', error);
    const fallbackId = `fallback-${Platform.OS}-${Date.now()}`;
    return fallbackId;
  }
};
