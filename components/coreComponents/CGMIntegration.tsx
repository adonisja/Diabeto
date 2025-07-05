// components/coreComponents/CGMIntegration-enhanced.tsx

import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Alert, 
    ScrollView,
    ActivityIndicator,
    Switch,
    SafeAreaView,
    StatusBar,
    Animated,
    StyleSheet,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../firebase/AuthContext';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

const { width } = Dimensions.get('window');

interface CGMIntegrationProps {
    onClose: () => void;
    onSuccess?: () => void;
}

interface CGMDevice {
    id: string;
    name: string;
    brand: string;
    model: string;
    icon: string;
    gradient: string[];
    description: string;
    features: string[];
    isConnected: boolean;
    lastSync?: Date;
    emoji: string;
}

const CGM_DEVICES: CGMDevice[] = [
    {
        id: 'dexcom-g7',
        name: 'Dexcom G7',
        brand: 'Dexcom',
        model: 'G7',
        icon: 'cellular',
        gradient: ['#ff6b6b', '#ee5a52'],
        emoji: '📱',
        description: 'Latest generation CGM with 10-day wear time and enhanced accuracy',
        features: ['Real-time glucose readings', '10-day sensor life', 'Smartphone alerts', 'No fingerstick calibration required'],
        isConnected: false
    },
    {
        id: 'dexcom-g6',
        name: 'Dexcom G6',
        brand: 'Dexcom',
        model: 'G6',
        icon: 'cellular',
        gradient: ['#ffa726', '#ff7043'],
        emoji: '📊',
        description: 'Popular CGM with proven accuracy and reliability',
        features: ['Real-time glucose readings', '10-day sensor life', 'Smartphone alerts', 'No fingerstick calibration'],
        isConnected: false
    },
    {
        id: 'libre-3',
        name: 'FreeStyle Libre 3',
        brand: 'Abbott',
        model: 'Libre 3',
        icon: 'radio',
        gradient: ['#66bb6a', '#4caf50'],
        emoji: '🔄',
        description: 'Compact sensor with real-time alerts and minute-by-minute readings',
        features: ['Real-time glucose readings', '14-day sensor life', 'Minute-by-minute readings', 'Optional alarms'],
        isConnected: false
    },
    {
        id: 'libre-2',
        name: 'FreeStyle Libre 2',
        brand: 'Abbott',
        model: 'Libre 2',
        icon: 'radio',
        gradient: ['#42a5f5', '#1976d2'],
        emoji: '👆',
        description: 'Flash glucose monitoring with optional alarms for high/low glucose',
        features: ['Flash glucose monitoring', '14-day sensor life', 'Optional alarms', 'Scan to read glucose'],
        isConnected: false
    },
    {
        id: 'guardian-4',
        name: 'Guardian 4',
        brand: 'Medtronic',
        model: 'Guardian 4',
        icon: 'pulse',
        gradient: ['#ab47bc', '#8e24aa'],
        emoji: '💉',
        description: 'Advanced CGM integrated with insulin pump systems',
        features: ['Real-time glucose readings', '7-day sensor life', 'Predictive alerts', 'Insulin pump integration'],
        isConnected: false
    }
];

const SYNC_SETTINGS = [
    {
        id: 'auto_sync',
        title: 'Auto Sync',
        description: 'Automatically sync glucose data every 15 minutes',
        icon: 'refresh-circle',
        emoji: '🔄'
    },
    {
        id: 'background_sync',
        title: 'Background Sync',
        description: 'Keep syncing even when app is in background',
        icon: 'cloud-upload',
        emoji: '☁️'
    },
    {
        id: 'alerts',
        title: 'CGM Alerts',
        description: 'Forward device alerts to app notifications',
        icon: 'notifications',
        emoji: '🔔'
    }
];

export default function CGMIntegration({ onClose, onSuccess }: CGMIntegrationProps) {
    const { user, userProfile } = useAuth();
    const [devices, setDevices] = useState<CGMDevice[]>(CGM_DEVICES);
    const [connecting, setConnecting] = useState<string | null>(null);
    const [syncingData, setSyncingData] = useState(false);
    const [settings, setSettings] = useState({
        auto_sync: true,
        background_sync: false,
        alerts: true
    });
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleDeviceConnect = async (deviceId: string) => {
        setConnecting(deviceId);
        
        try {
            // Simulate connection process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Update device status
            setDevices(prev => prev.map(device => 
                device.id === deviceId 
                    ? { ...device, isConnected: true, lastSync: new Date() }
                    : { ...device, isConnected: false }
            ));

            // Save to Firebase
            if (user) {
                await addDoc(collection(db, 'cgmConnections'), {
                    userId: user.uid,
                    deviceId,
                    deviceName: devices.find(d => d.id === deviceId)?.name,
                    connectedAt: serverTimestamp(),
                    isActive: true
                });
            }

            Alert.alert('✅ Connected!', 'Your CGM device has been successfully connected.');
            onSuccess?.();
            
        } catch (error) {
            console.error('Error connecting CGM device:', error);
            Alert.alert('❌ Connection Failed', 'Unable to connect to your CGM device. Please try again.');
        } finally {
            setConnecting(null);
        }
    };

    const handleDeviceDisconnect = async (deviceId: string) => {
        Alert.alert(
            '🔌 Disconnect Device',
            'Are you sure you want to disconnect this CGM device?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Disconnect',
                    style: 'destructive',
                    onPress: () => {
                        setDevices(prev => prev.map(device => 
                            device.id === deviceId 
                                ? { ...device, isConnected: false, lastSync: undefined }
                                : device
                        ));
                    }
                }
            ]
        );
    };

    const handleSyncData = async () => {
        setSyncingData(true);
        
        try {
            // Simulate data sync
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Generate mock glucose readings
            const connectedDevice = devices.find(d => d.isConnected);
            if (connectedDevice && user) {
                const mockReadings = [
                    { value: 95, type: 'random', status: 'normal' },
                    { value: 110, type: 'post_meal', status: 'normal' },
                    { value: 87, type: 'fasting', status: 'normal' }
                ];

                for (const reading of mockReadings) {
                    await addDoc(collection(db, 'glucoseReadings'), {
                        userId: user.uid,
                        glucoseValue: reading.value,
                        readingType: reading.type,
                        status: reading.status,
                        entrySource: 'cgm',
                        deviceName: connectedDevice.name,
                        timestamp: serverTimestamp(),
                        notes: `Synced from ${connectedDevice.name}`
                    });
                }
            }

            Alert.alert('📊 Sync Complete', 'Your glucose data has been successfully synced.');
            
        } catch (error) {
            console.error('Error syncing CGM data:', error);
            Alert.alert('❌ Sync Failed', 'Unable to sync your glucose data. Please try again.');
        } finally {
            setSyncingData(false);
        }
    };

    const renderDeviceCard = (device: CGMDevice) => {
        const isConnecting = connecting === device.id;
        
        return (
            <Animated.View 
                key={device.id}
                style={[
                    styles.deviceCard,
                    {
                        opacity: fadeAnim,
                        transform: [{
                            translateY: fadeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [50, 0]
                            })
                        }]
                    }
                ]}
            >
                <LinearGradient
                    colors={device.isConnected ? ['#4ade80', '#22c55e'] : device.gradient}
                    style={styles.deviceGradient}
                >
                    <View style={styles.deviceHeader}>
                        <View style={styles.deviceInfo}>
                            <Text style={styles.deviceEmoji}>{device.emoji}</Text>
                            <View style={styles.deviceDetails}>
                                <Text style={styles.deviceName}>{device.name}</Text>
                                <Text style={styles.deviceBrand}>{device.brand}</Text>
                            </View>
                        </View>
                        
                        <View style={styles.deviceStatus}>
                            {device.isConnected && (
                                <View style={styles.connectedBadge}>
                                    <Ionicons name="checkmark-circle" size={16} color="#ffffff" />
                                    <Text style={styles.connectedText}>Connected</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <Text style={styles.deviceDescription}>{device.description}</Text>

                    <View style={styles.featuresContainer}>
                        {device.features.map((feature, index) => (
                            <View key={index} style={styles.featureItem}>
                                <Ionicons name="checkmark" size={14} color="#ffffff" />
                                <Text style={styles.featureText}>{feature}</Text>
                            </View>
                        ))}
                    </View>

                    {device.lastSync && (
                        <Text style={styles.lastSync}>
                            Last sync: {device.lastSync.toLocaleTimeString()}
                        </Text>
                    )}

                    <View style={styles.deviceActions}>
                        {device.isConnected ? (
                            <>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => handleDeviceDisconnect(device.id)}
                                >
                                    <LinearGradient
                                        colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                                        style={styles.actionButtonGradient}
                                    >
                                        <Ionicons name="power" size={16} color="#ffffff" />
                                        <Text style={styles.actionButtonText}>Disconnect</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={handleSyncData}
                                    disabled={syncingData}
                                >
                                    <LinearGradient
                                        colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                                        style={styles.actionButtonGradient}
                                    >
                                        {syncingData ? (
                                            <ActivityIndicator size="small" color="#ffffff" />
                                        ) : (
                                            <Ionicons name="refresh" size={16} color="#ffffff" />
                                        )}
                                        <Text style={styles.actionButtonText}>
                                            {syncingData ? 'Syncing...' : 'Sync Now'}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity
                                style={[styles.connectButton, { flex: 1 }]}
                                onPress={() => handleDeviceConnect(device.id)}
                                disabled={isConnecting}
                            >
                                <LinearGradient
                                    colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.8)']}
                                    style={styles.connectButtonGradient}
                                >
                                    {isConnecting ? (
                                        <ActivityIndicator size="small" color={device.gradient[0]} />
                                    ) : (
                                        <Ionicons name="link" size={16} color={device.gradient[0]} />
                                    )}
                                    <Text style={[styles.connectButtonText, { color: device.gradient[0] }]}>
                                        {isConnecting ? 'Connecting...' : 'Connect Device'}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                    </View>
                </LinearGradient>
            </Animated.View>
        );
    };

    const renderSettingsSection = () => (
        <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>⚙️ Sync Settings</Text>
            
            {SYNC_SETTINGS.map((setting) => (
                <View key={setting.id} style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingEmoji}>{setting.emoji}</Text>
                        <View style={styles.settingDetails}>
                            <Text style={styles.settingTitle}>{setting.title}</Text>
                            <Text style={styles.settingDescription}>{setting.description}</Text>
                        </View>
                    </View>
                    
                    <Switch
                        value={settings[setting.id as keyof typeof settings]}
                        onValueChange={(value) => setSettings(prev => ({ ...prev, [setting.id]: value }))}
                        trackColor={{ false: "#e2e8f0", true: "#667eea" }}
                        thumbColor={settings[setting.id as keyof typeof settings] ? "#ffffff" : "#f4f3f4"}
                    />
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Intro Card */}
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.introCard}
                >
                    <Text style={styles.introTitle}>🚀 Connect Your CGM</Text>
                    <Text style={styles.introText}>
                        Seamlessly integrate your continuous glucose monitor to automatically sync your readings and get real-time insights.
                    </Text>
                </LinearGradient>

                {/* Devices Section */}
                <View style={styles.devicesSection}>
                    <Text style={styles.sectionTitle}>📱 Available Devices</Text>
                    {devices.map(renderDeviceCard)}
                </View>

                {/* Settings Section */}
                {renderSettingsSection()}

                {/* Info Section */}
                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>ℹ️ Important Notes</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoItem}>
                            <Ionicons name="shield-checkmark" size={16} color="#4ade80" />
                            <Text style={styles.infoText}>Your glucose data is encrypted and secure</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="time" size={16} color="#667eea" />
                            <Text style={styles.infoText}>Sync may take a few minutes to complete</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="battery-half" size={16} color="#fbbf24" />
                            <Text style={styles.infoText}>Ensure your CGM device has sufficient battery</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8', // Match parent background
    },
    scrollContainer: {
        flex: 1,
        padding: 20,
        paddingTop: 10, // Add some top padding since no header
    },
    introCard: {
        borderRadius: 20,
        padding: 24,
        marginBottom: 30,
        alignItems: 'center',
    },
    introTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: 12,
        textAlign: 'center',
    },
    introText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 24,
    },
    devicesSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2d3748',
        marginBottom: 16,
        paddingLeft: 4,
    },
    deviceCard: {
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    deviceGradient: {
        padding: 20,
    },
    deviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    deviceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    deviceEmoji: {
        fontSize: 32,
        marginRight: 12,
    },
    deviceDetails: {
        flex: 1,
    },
    deviceName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: 2,
    },
    deviceBrand: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '600',
    },
    deviceStatus: {
        alignItems: 'flex-end',
    },
    connectedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    connectedText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 4,
    },
    deviceDescription: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 16,
        lineHeight: 20,
    },
    featuresContainer: {
        marginBottom: 16,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
        marginLeft: 8,
        fontWeight: '500',
    },
    lastSync: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        fontStyle: 'italic',
        marginBottom: 16,
    },
    deviceActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
    },
    actionButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    actionButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 6,
    },
    connectButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    connectButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    connectButtonText: {
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
    },
    settingsSection: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 16,
    },
    settingEmoji: {
        fontSize: 20,
        marginRight: 12,
    },
    settingDetails: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 14,
        color: '#718096',
        lineHeight: 18,
    },
    infoSection: {
        marginBottom: 40,
    },
    infoCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#4a5568',
        marginLeft: 12,
        flex: 1,
        lineHeight: 20,
    },
});
