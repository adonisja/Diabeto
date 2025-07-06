import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Switch,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { bloodPressureDeviceStyles } from '../../assets/styles/componentStyles/bloodPressureDeviceStyles';
import { logAction } from '../../firebase/LogService';
import { useAuth } from '../../firebase/AuthContext';

interface Device {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'syncing';
  lastSync: Date;
  batteryLevel: number;
}

// Mock device data - replace with actual device integration
const MOCK_DEVICES: Device[] = [
  {
    id: 'omron_bp652',
    name: 'OMRON BP652',
    type: 'Bluetooth',
    status: 'connected',
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    batteryLevel: 85,
  },
  {
    id: 'withings_bpm_core',
    name: 'Withings BPM Core',
    type: 'WiFi',
    status: 'disconnected',
    lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    batteryLevel: 45,
  },
];

interface BloodPressureDeviceIntegrationProps {
  onReadingsImported?: (count: number) => void;
}

export default function BloodPressureDeviceIntegration({ onReadingsImported }: BloodPressureDeviceIntegrationProps) {
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
  const [autoSync, setAutoSync] = useState(true);
  const [syncInterval, setSyncInterval] = useState<'15min' | '30min' | '1hour' | '4hours'>('30min');
  const [loading, setLoading] = useState(false);
  const { userProfile } = useAuth();

  useEffect(() => {
    // Mock device discovery
    discoverDevices();
  }, []);

  const discoverDevices = async () => {
    try {
      setLoading(true);
      if (userProfile) {
        await logAction(
          userProfile.uid,
          userProfile.username || 'Unknown',
          userProfile.email,
          userProfile.role,
          'blood_pressure_devices_discovered',
          'success',
          { deviceCount: devices.length }
        );
      }
      
      // Simulate device discovery delay
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error discovering devices:', error);
      setLoading(false);
    }
  };

  const connectDevice = async (deviceId: string) => {
    try {
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, status: 'connected' as const }
          : device
      ));

      if (userProfile) {
        await logAction(
          userProfile.uid,
          userProfile.username || 'Unknown',
          userProfile.email,
          userProfile.role,
          'blood_pressure_device_connected',
          'success',
          { deviceId }
        );
      }

      Alert.alert('Success', 'Device connected successfully');
    } catch (error) {
      console.error('Error connecting device:', error);
      Alert.alert('Error', 'Failed to connect device');
    }
  };

  const disconnectDevice = async (deviceId: string) => {
    try {
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, status: 'disconnected' as const }
          : device
      ));

      if (userProfile) {
        await logAction(
          userProfile.uid,
          userProfile.username || 'Unknown',
          userProfile.email,
          userProfile.role,
          'blood_pressure_device_disconnected',
          'success',
          { deviceId }
        );
      }

      Alert.alert('Success', 'Device disconnected');
    } catch (error) {
      console.error('Error disconnecting device:', error);
      Alert.alert('Error', 'Failed to disconnect device');
    }
  };

  const syncDevice = async (deviceId: string) => {
    try {
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, status: 'syncing' as const }
          : device
      ));

      // Simulate sync process
      setTimeout(async () => {
        const importedCount = Math.floor(Math.random() * 10) + 1;
        
        setDevices(prev => prev.map(device => 
          device.id === deviceId 
            ? { ...device, status: 'connected' as const, lastSync: new Date() }
            : device
        ));

        if (userProfile) {
          await logAction(
            userProfile.uid,
            userProfile.username || 'Unknown',
            userProfile.email,
            userProfile.role,
            'blood_pressure_readings_synced',
            'success',
            { deviceId, readingsCount: importedCount }
          );
        }

        Alert.alert(
          'Sync Complete',
          `Successfully imported ${importedCount} new readings`,
          [{ text: 'OK', onPress: () => onReadingsImported?.(importedCount) }]
        );
      }, 3000);
    } catch (error) {
      console.error('Error syncing device:', error);
      Alert.alert('Error', 'Failed to sync device');
      
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, status: 'connected' as const }
          : device
      ));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return '#4CAF50';
      case 'disconnected': return '#F44336';
      case 'syncing': return '#FF9800';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return 'checkmark-circle';
      case 'disconnected': return 'close-circle';
      case 'syncing': return 'sync';
      default: return 'help-circle';
    }
  };

  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <ScrollView style={bloodPressureDeviceStyles.container}>
      {/* Header */}
      <View style={bloodPressureDeviceStyles.header}>
        <Text style={bloodPressureDeviceStyles.title}>Device Integration</Text>
        <TouchableOpacity
          style={bloodPressureDeviceStyles.refreshButton}
          onPress={discoverDevices}
          disabled={loading}
        >
          <Ionicons 
            name={loading ? "hourglass" : "refresh"} 
            size={24} 
            color="#E53E3E" 
          />
        </TouchableOpacity>
      </View>

      {/* Settings Card */}
      <View style={bloodPressureDeviceStyles.settingsCard}>
        <Text style={bloodPressureDeviceStyles.settingsTitle}>Sync Settings</Text>
        
        <View style={bloodPressureDeviceStyles.settingRow}>
          <View style={bloodPressureDeviceStyles.settingInfo}>
            <Text style={bloodPressureDeviceStyles.settingLabel}>Auto Sync</Text>
            <Text style={bloodPressureDeviceStyles.settingDescription}>
              Automatically sync readings from connected devices
            </Text>
          </View>
          <Switch
            value={autoSync}
            onValueChange={setAutoSync}
            trackColor={{ false: '#E5E5E5', true: '#FFE2E2' }}
            thumbColor={autoSync ? '#E53E3E' : '#CCCCCC'}
          />
        </View>

        {autoSync && (
          <View style={bloodPressureDeviceStyles.intervalContainer}>
            <Text style={bloodPressureDeviceStyles.intervalLabel}>Sync Interval</Text>
            <View style={bloodPressureDeviceStyles.intervalButtons}>
              {(['15min', '30min', '1hour', '4hours'] as const).map((interval) => (
                <TouchableOpacity
                  key={interval}
                  style={[
                    bloodPressureDeviceStyles.intervalButton,
                    syncInterval === interval && bloodPressureDeviceStyles.intervalButtonActive
                  ]}
                  onPress={() => setSyncInterval(interval)}
                >
                  <Text style={[
                    bloodPressureDeviceStyles.intervalButtonText,
                    syncInterval === interval && bloodPressureDeviceStyles.intervalButtonTextActive
                  ]}>
                    {interval}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Devices List */}
      <View style={bloodPressureDeviceStyles.devicesContainer}>
        <Text style={bloodPressureDeviceStyles.sectionTitle}>Available Devices</Text>
        
        {loading ? (
          <View style={bloodPressureDeviceStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#E53E3E" />
            <Text style={bloodPressureDeviceStyles.loadingText}>Discovering devices...</Text>
          </View>
        ) : devices.length === 0 ? (
          <View style={bloodPressureDeviceStyles.emptyState}>
            <Ionicons name="hardware-chip-outline" size={48} color="#CCCCCC" />
            <Text style={bloodPressureDeviceStyles.emptyStateText}>
              No devices found
            </Text>
            <Text style={bloodPressureDeviceStyles.emptyStateSubtext}>
              Make sure your blood pressure monitor is in pairing mode
            </Text>
          </View>
        ) : (
          devices.map((device) => (
            <View key={device.id} style={bloodPressureDeviceStyles.deviceCard}>
              <View style={bloodPressureDeviceStyles.deviceHeader}>
                <View style={bloodPressureDeviceStyles.deviceInfo}>
                  <Text style={bloodPressureDeviceStyles.deviceName}>{device.name}</Text>
                  <Text style={bloodPressureDeviceStyles.deviceType}>
                    {device.type} • {formatLastSync(device.lastSync)}
                  </Text>
                </View>
                <View style={[
                  bloodPressureDeviceStyles.statusBadge,
                  { backgroundColor: getStatusColor(device.status) }
                ]}>
                  <Ionicons 
                    name={getStatusIcon(device.status)} 
                    size={16} 
                    color="white" 
                  />
                  <Text style={bloodPressureDeviceStyles.statusText}>
                    {device.status}
                  </Text>
                </View>
              </View>

              <View style={bloodPressureDeviceStyles.deviceDetails}>
                <View style={bloodPressureDeviceStyles.batteryContainer}>
                  <Ionicons 
                    name={device.batteryLevel > 20 ? "battery-full" : "battery-dead"} 
                    size={16} 
                    color={device.batteryLevel > 20 ? "#4CAF50" : "#F44336"} 
                  />
                  <Text style={bloodPressureDeviceStyles.batteryText}>
                    {device.batteryLevel}%
                  </Text>
                </View>
              </View>

              <View style={bloodPressureDeviceStyles.deviceActions}>
                {device.status === 'connected' || device.status === 'syncing' ? (
                  <>
                    <TouchableOpacity
                      style={[bloodPressureDeviceStyles.actionButton, bloodPressureDeviceStyles.syncButton]}
                      onPress={() => syncDevice(device.id)}
                      disabled={device.status === 'syncing'}
                    >
                      <Ionicons 
                        name={device.status === 'syncing' ? "hourglass" : "sync"} 
                        size={16} 
                        color="white" 
                      />
                      <Text style={bloodPressureDeviceStyles.actionButtonText}>
                        {device.status === 'syncing' ? 'Syncing...' : 'Sync Now'}
                      </Text>
                    </TouchableOpacity>
                    {device.status !== 'syncing' && (
                      <TouchableOpacity
                        style={[bloodPressureDeviceStyles.actionButton, bloodPressureDeviceStyles.disconnectButton]}
                        onPress={() => disconnectDevice(device.id)}
                      >
                        <Ionicons name="unlink" size={16} color="#F44336" />
                        <Text style={[bloodPressureDeviceStyles.actionButtonText, { color: '#F44336' }]}>
                          Disconnect
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                ) : (
                  <TouchableOpacity
                    style={[bloodPressureDeviceStyles.actionButton, bloodPressureDeviceStyles.connectButton]}
                    onPress={() => connectDevice(device.id)}
                  >
                    <Ionicons name="link" size={16} color="white" />
                    <Text style={bloodPressureDeviceStyles.actionButtonText}>Connect</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </View>

      {/* Help Section */}
      <View style={bloodPressureDeviceStyles.helpCard}>
        <Text style={bloodPressureDeviceStyles.helpTitle}>Setup Help</Text>
        <Text style={bloodPressureDeviceStyles.helpText}>
          • Ensure your device is in pairing mode{'\n'}
          • Keep devices close to your phone during setup{'\n'}
          • Grant necessary permissions when prompted{'\n'}
          • Contact support if you experience connection issues
        </Text>
      </View>
    </ScrollView>
  );
}
