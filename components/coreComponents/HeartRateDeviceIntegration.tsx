// components/coreComponents/HeartRateDeviceIntegration.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    Alert,
    Switch
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../firebase/AuthContext';
import heartRateDeviceStyles from '../../assets/styles/componentStyles/heartRateDeviceStyles';

interface HeartRateDeviceIntegrationProps {
    onClose: () => void;
    onSuccess?: () => void;
}

interface Device {
    id: string;
    name: string;
    type: 'smartwatch' | 'fitness_tracker' | 'chest_strap' | 'smartphone';
    brand: string;
    icon: string;
    isConnected: boolean;
    battery?: number;
    lastSync?: Date;
    features: string[];
}

const MOCK_DEVICES: Device[] = [
    {
        id: 'apple_watch',
        name: 'Apple Watch Series 9',
        type: 'smartwatch',
        brand: 'Apple',
        icon: 'watch',
        isConnected: false,
        features: ['Continuous HR', 'ECG', 'Blood Oxygen', 'Workout Detection']
    },
    {
        id: 'fitbit_versa',
        name: 'Fitbit Versa 4',
        type: 'fitness_tracker',
        brand: 'Fitbit',
        icon: 'fitness',
        isConnected: true,
        battery: 78,
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        features: ['24/7 HR', 'Sleep Tracking', 'Stress Management', 'GPS']
    },
    {
        id: 'samsung_galaxy',
        name: 'Galaxy Watch 6',
        type: 'smartwatch',
        brand: 'Samsung',
        icon: 'watch-outline',
        isConnected: false,
        features: ['Advanced Sleep', 'Body Composition', 'Blood Pressure', 'ECG']
    },
    {
        id: 'polar_h10',
        name: 'Polar H10',
        type: 'chest_strap',
        brand: 'Polar',
        icon: 'heart-circle',
        isConnected: false,
        features: ['ECG Accurate', 'Bluetooth/ANT+', 'Waterproof', 'Real-time HR']
    }
];

export default function HeartRateDeviceIntegration({ onClose, onSuccess }: HeartRateDeviceIntegrationProps) {
    const { userProfile } = useAuth();
    const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
    const [autoSync, setAutoSync] = useState(true);
    const [syncFrequency, setSyncFrequency] = useState<'realtime' | 'hourly' | 'daily'>('hourly');
    const [isScanning, setIsScanning] = useState(false);

    const handleDeviceConnection = (deviceId: string) => {
        setDevices(prev => prev.map(device => {
            if (device.id === deviceId) {
                const wasConnected = device.isConnected;
                
                if (!wasConnected) {
                    // Simulate connection process
                    Alert.alert(
                        'Connecting to Device',
                        `Connecting to ${device.name}...`,
                        [
                            {
                                text: 'Cancel',
                                style: 'cancel'
                            },
                            {
                                text: 'Connect',
                                onPress: () => {
                                    // Simulate successful connection
                                    setTimeout(() => {
                                        setDevices(current => current.map(d => 
                                            d.id === deviceId 
                                                ? { 
                                                    ...d, 
                                                    isConnected: true, 
                                                    battery: Math.floor(Math.random() * 50) + 50,
                                                    lastSync: new Date()
                                                }
                                                : d
                                        ));
                                        
                                        Alert.alert(
                                            'Device Connected! 🎉',
                                            `${device.name} is now connected and will sync your heart rate data automatically.`,
                                            [{ text: 'Great!', onPress: onSuccess }]
                                        );
                                    }, 1500);
                                }
                            }
                        ]
                    );
                } else {
                    // Disconnect device
                    Alert.alert(
                        'Disconnect Device',
                        `Are you sure you want to disconnect ${device.name}?`,
                        [
                            { text: 'Cancel', style: 'cancel' },
                            {
                                text: 'Disconnect',
                                style: 'destructive',
                                onPress: () => {
                                    return {
                                        ...device,
                                        isConnected: false,
                                        battery: undefined,
                                        lastSync: undefined
                                    };
                                }
                            }
                        ]
                    );
                }
            }
            return device;
        }));
    };

    const handleScanForDevices = () => {
        setIsScanning(true);
        
        // Simulate scanning process
        setTimeout(() => {
            setIsScanning(false);
            Alert.alert(
                'Scan Complete',
                'Found 2 new compatible devices nearby. Check the device list below.',
                [{ text: 'OK' }]
            );
        }, 3000);
    };

    const handleSyncNow = () => {
        const connectedDevices = devices.filter(d => d.isConnected);
        
        if (connectedDevices.length === 0) {
            Alert.alert('No Connected Devices', 'Please connect a device first to sync data.');
            return;
        }

        Alert.alert(
            'Syncing Data...',
            'Fetching latest heart rate data from your connected devices.',
            [{ text: 'OK' }]
        );

        // Update last sync time for connected devices
        setDevices(prev => prev.map(device => 
            device.isConnected 
                ? { ...device, lastSync: new Date() }
                : device
        ));
    };

    const getBrandGradient = (brand: string): string[] => {
        switch (brand.toLowerCase()) {
            case 'apple': return ['#007AFF', '#5AC8FA'];
            case 'fitbit': return ['#00B0B9', '#4CC9F0'];
            case 'samsung': return ['#1428A0', '#4169E1'];
            case 'polar': return ['#FF6B35', '#FF8E53'];
            default: return ['#667eea', '#764ba2'];
        }
    };

    const formatLastSync = (lastSync: Date | undefined): string => {
        if (!lastSync) return 'Never';
        
        const now = new Date();
        const diffMs = now.getTime() - lastSync.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMins / 60);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return lastSync.toLocaleDateString();
    };

    const renderDeviceCard = (device: Device) => (
        <View key={device.id} style={heartRateDeviceStyles.deviceCard}>
            <LinearGradient
                colors={getBrandGradient(device.brand)}
                style={heartRateDeviceStyles.deviceGradient}
            >
                <View style={heartRateDeviceStyles.deviceHeader}>
                    <View style={heartRateDeviceStyles.deviceIconContainer}>
                        <Ionicons name={device.icon as any} size={24} color="#fff" />
                    </View>
                    <View style={heartRateDeviceStyles.deviceInfo}>
                        <Text style={heartRateDeviceStyles.deviceName}>{device.name}</Text>
                        <Text style={heartRateDeviceStyles.deviceBrand}>{device.brand}</Text>
                    </View>
                    <View style={heartRateDeviceStyles.deviceStatus}>
                        {device.isConnected ? (
                            <View style={heartRateDeviceStyles.connectedBadge}>
                                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                                <Text style={heartRateDeviceStyles.connectedText}>Connected</Text>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={heartRateDeviceStyles.connectButton}
                                onPress={() => handleDeviceConnection(device.id)}
                            >
                                <Text style={heartRateDeviceStyles.connectButtonText}>Connect</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {device.isConnected && (
                    <View style={heartRateDeviceStyles.deviceDetails}>
                        {device.battery && (
                            <View style={heartRateDeviceStyles.detailItem}>
                                <Ionicons name="battery-half" size={16} color="#fff" />
                                <Text style={heartRateDeviceStyles.detailText}>{device.battery}% Battery</Text>
                            </View>
                        )}
                        <View style={heartRateDeviceStyles.detailItem}>
                            <Ionicons name="sync" size={16} color="#fff" />
                            <Text style={heartRateDeviceStyles.detailText}>
                                Last sync: {formatLastSync(device.lastSync)}
                            </Text>
                        </View>
                    </View>
                )}

                <View style={heartRateDeviceStyles.featuresContainer}>
                    <Text style={heartRateDeviceStyles.featuresTitle}>Features:</Text>
                    <View style={heartRateDeviceStyles.featuresList}>
                        {device.features.map((feature, index) => (
                            <View key={index} style={heartRateDeviceStyles.featureTag}>
                                <Text style={heartRateDeviceStyles.featureText}>{feature}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </LinearGradient>
        </View>
    );

    return (
        <SafeAreaView style={heartRateDeviceStyles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#ff5722" />
            
            {/* Header */}
            <LinearGradient
                colors={['#ff5722', '#ffab91']}
                style={heartRateDeviceStyles.headerGradient}
            >
                <View style={heartRateDeviceStyles.header}>
                    <TouchableOpacity onPress={onClose} style={heartRateDeviceStyles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={heartRateDeviceStyles.headerTitle}>Device Integration</Text>
                    <View style={heartRateDeviceStyles.headerSpacer} />
                </View>
            </LinearGradient>

            <ScrollView style={heartRateDeviceStyles.content} showsVerticalScrollIndicator={false}>
                {/* Welcome Section */}
                <LinearGradient
                    colors={['#ff9a9e', '#fecfef']}
                    style={heartRateDeviceStyles.welcomeCard}
                >
                    <Ionicons name="watch" size={32} color="#ff5722" />
                    <Text style={heartRateDeviceStyles.welcomeTitle}>Connect Your Devices ⌚</Text>
                    <Text style={heartRateDeviceStyles.welcomeMessage}>
                        Sync heart rate data from your smartwatch or fitness tracker for continuous monitoring
                    </Text>
                </LinearGradient>

                {/* Sync Settings */}
                <View style={heartRateDeviceStyles.settingsCard}>
                    <Text style={heartRateDeviceStyles.settingsTitle}>📱 Sync Settings</Text>
                    
                    <View style={heartRateDeviceStyles.settingRow}>
                        <View style={heartRateDeviceStyles.settingInfo}>
                            <Text style={heartRateDeviceStyles.settingLabel}>Auto Sync</Text>
                            <Text style={heartRateDeviceStyles.settingDescription}>
                                Automatically sync data from connected devices
                            </Text>
                        </View>
                        <Switch
                            value={autoSync}
                            onValueChange={setAutoSync}
                            trackColor={{ false: '#ccc', true: '#ff5722' }}
                        />
                    </View>

                    <View style={heartRateDeviceStyles.settingRow}>
                        <View style={heartRateDeviceStyles.settingInfo}>
                            <Text style={heartRateDeviceStyles.settingLabel}>Sync Frequency</Text>
                            <Text style={heartRateDeviceStyles.settingDescription}>
                                How often to sync data: {syncFrequency}
                            </Text>
                        </View>
                        <TouchableOpacity style={heartRateDeviceStyles.frequencyButton}>
                            <Text style={heartRateDeviceStyles.frequencyButtonText}>Change</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity 
                        style={heartRateDeviceStyles.syncNowButton}
                        onPress={handleSyncNow}
                    >
                        <Ionicons name="sync" size={20} color="#fff" />
                        <Text style={heartRateDeviceStyles.syncNowText}>Sync Now</Text>
                    </TouchableOpacity>
                </View>

                {/* Device Discovery */}
                <View style={heartRateDeviceStyles.discoveryCard}>
                    <Text style={heartRateDeviceStyles.discoveryTitle}>🔍 Find Devices</Text>
                    <Text style={heartRateDeviceStyles.discoveryDescription}>
                        Make sure your device is in pairing mode and nearby
                    </Text>
                    
                    <TouchableOpacity 
                        style={[
                            heartRateDeviceStyles.scanButton,
                            isScanning && heartRateDeviceStyles.scanButtonActive
                        ]}
                        onPress={handleScanForDevices}
                        disabled={isScanning}
                    >
                        <Ionicons 
                            name={isScanning ? "sync" : "search"} 
                            size={20} 
                            color="#fff" 
                        />
                        <Text style={heartRateDeviceStyles.scanButtonText}>
                            {isScanning ? 'Scanning...' : 'Scan for Devices'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Available Devices */}
                <View style={heartRateDeviceStyles.devicesSection}>
                    <Text style={heartRateDeviceStyles.devicesSectionTitle}>📱 Available Devices</Text>
                    {devices.map(renderDeviceCard)}
                </View>

                {/* Info Section */}
                <View style={heartRateDeviceStyles.infoCard}>
                    <Text style={heartRateDeviceStyles.infoTitle}>💡 Integration Tips</Text>
                    <View style={heartRateDeviceStyles.tipsList}>
                        <View style={heartRateDeviceStyles.tipItem}>
                            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                            <Text style={heartRateDeviceStyles.tipText}>
                                Keep devices charged and within Bluetooth range
                            </Text>
                        </View>
                        <View style={heartRateDeviceStyles.tipItem}>
                            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                            <Text style={heartRateDeviceStyles.tipText}>
                                Enable background app refresh for automatic syncing
                            </Text>
                        </View>
                        <View style={heartRateDeviceStyles.tipItem}>
                            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                            <Text style={heartRateDeviceStyles.tipText}>
                                Check sync status regularly to ensure data accuracy
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
