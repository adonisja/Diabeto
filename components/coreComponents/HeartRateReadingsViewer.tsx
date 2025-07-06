// components/coreComponents/HeartRateReadingsViewer.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    FlatList,
    Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../firebase/AuthContext';
import { collection, query, where, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import heartRateViewerStyles from '../../assets/styles/componentStyles/heartRateViewerStyles';

interface HeartRateReadingsViewerProps {
    onClose: () => void;
    patientId?: string; // For caretaker/doctor access
}

interface HeartRateReading {
    id: string;
    heartRate: number;
    measuredAt: Date;
    measurementType: 'resting' | 'active' | 'post_exercise' | 'stress';
    status: string;
    notes?: string;
    measurementMethod?: string;
    pulseCountData?: { count: number; duration: number };
    createdAt: Date;
}

const MEASUREMENT_TYPE_CONFIG = {
    resting: { emoji: '😴', label: 'Resting', gradient: ['#4CAF50', '#81C784'] },
    active: { emoji: '🚶', label: 'Active', gradient: ['#FF9800', '#FFB74D'] },
    post_exercise: { emoji: '🏃', label: 'Post-Exercise', gradient: ['#F44336', '#EF5350'] },
    stress: { emoji: '😰', label: 'Stress', gradient: ['#9C27B0', '#BA68C8'] }
};

const STATUS_CONFIG = {
    low: { 
        color: ['#2196F3', '#64B5F6'], 
        icon: 'arrow-down-circle', 
        emoji: '🔵',
        message: 'Below Normal'
    },
    normal: { 
        color: ['#4CAF50', '#81C784'], 
        icon: 'checkmark-circle', 
        emoji: '🟢',
        message: 'Normal Range'
    },
    elevated: { 
        color: ['#FF9800', '#FFB74D'], 
        icon: 'warning', 
        emoji: '🟡',
        message: 'Elevated'
    },
    high: { 
        color: ['#F44336', '#EF5350'], 
        icon: 'alert-circle', 
        emoji: '🔴',
        message: 'High'
    }
};

export default function HeartRateReadingsViewer({ onClose, patientId }: HeartRateReadingsViewerProps) {
    const { user, userProfile } = useAuth();
    const [readings, setReadings] = useState<HeartRateReading[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Determine which user's data to fetch
    const targetUserId = patientId || user?.uid;

    useEffect(() => {
        if (!targetUserId) {
            Alert.alert('Error', 'User not found');
            onClose();
            return;
        }

        setLoading(true);

        // Set up real-time listener for heart rate readings
        const FIREBASE_APP_ID = process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'default-app-id';
        const readingsRef = collection(db, 'artifacts', FIREBASE_APP_ID, 'heartRateReadings');
        const readingsQuery = query(
            readingsRef,
            where('userId', '==', targetUserId),
            orderBy('measuredAt', 'desc')
        );

        const unsubscribe = onSnapshot(readingsQuery, (snapshot) => {
            const readingsData: HeartRateReading[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                readingsData.push({
                    id: doc.id,
                    ...data,
                    measuredAt: data.measuredAt?.toDate() || new Date(),
                    createdAt: data.createdAt?.toDate() || new Date(),
                } as HeartRateReading);
            });
            
            setReadings(readingsData);
            setLoading(false);
            setRefreshing(false);
        }, (error) => {
            console.error('Error fetching heart rate readings:', error);
            Alert.alert('Error', 'Failed to load heart rate readings');
            setLoading(false);
            setRefreshing(false);
        });

        return () => unsubscribe();
    }, [targetUserId]);

    const onRefresh = () => {
        setRefreshing(true);
        // The real-time listener will automatically refresh the data
    };

    const calculateStats = () => {
        if (readings.length === 0) return null;

        const totalReadings = readings.length;
        const avgHeartRate = Math.round(readings.reduce((sum, reading) => sum + reading.heartRate, 0) / totalReadings);
        
        const restingReadings = readings.filter(r => r.measurementType === 'resting');
        const avgRestingHR = restingReadings.length > 0 
            ? Math.round(restingReadings.reduce((sum, reading) => sum + reading.heartRate, 0) / restingReadings.length)
            : 0;
        
        const maxHR = Math.max(...readings.map(r => r.heartRate));
        const minHR = Math.min(...readings.map(r => r.heartRate));

        return {
            totalReadings,
            avgHeartRate,
            avgRestingHR,
            maxHR,
            minHR
        };
    };

    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date: Date): string => {
        const today = new Date();
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    const renderStatsHeader = () => {
        const stats = calculateStats();
        if (!stats) return null;

        return (
            <LinearGradient
                colors={['#e91e63', '#f06292']}
                style={heartRateViewerStyles.statsContainer}
            >
                <Text style={heartRateViewerStyles.statsTitle}>📊 Heart Rate Summary</Text>
                <View style={heartRateViewerStyles.statsGrid}>
                    <View style={heartRateViewerStyles.statItem}>
                        <Text style={heartRateViewerStyles.statValue}>{stats.totalReadings}</Text>
                        <Text style={heartRateViewerStyles.statLabel}>Total Records</Text>
                    </View>
                    <View style={heartRateViewerStyles.statItem}>
                        <Text style={heartRateViewerStyles.statValue}>{stats.avgHeartRate}</Text>
                        <Text style={heartRateViewerStyles.statLabel}>Avg HR</Text>
                    </View>
                    <View style={heartRateViewerStyles.statItem}>
                        <Text style={heartRateViewerStyles.statValue}>{stats.avgRestingHR || 'N/A'}</Text>
                        <Text style={heartRateViewerStyles.statLabel}>Avg Resting</Text>
                    </View>
                    <View style={heartRateViewerStyles.statItem}>
                        <Text style={heartRateViewerStyles.statValue}>{stats.maxHR}</Text>
                        <Text style={heartRateViewerStyles.statLabel}>Max HR</Text>
                    </View>
                </View>
            </LinearGradient>
        );
    };

    const renderReadingItem = ({ item }: { item: HeartRateReading }) => {
        const typeConfig = MEASUREMENT_TYPE_CONFIG[item.measurementType];
        const statusConfig = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.normal;

        return (
            <View style={heartRateViewerStyles.readingItem}>
                {/* Header */}
                <View style={heartRateViewerStyles.readingHeader}>
                    <View style={heartRateViewerStyles.valueContainer}>
                        <Text style={heartRateViewerStyles.heartRateValue}>{item.heartRate}</Text>
                        <Text style={heartRateViewerStyles.unit}>BPM</Text>
                    </View>
                    <LinearGradient
                        colors={statusConfig.color}
                        style={heartRateViewerStyles.statusContainer}
                    >
                        <Ionicons name={statusConfig.icon as any} size={16} color="#fff" />
                        <Text style={heartRateViewerStyles.statusText}>{statusConfig.emoji} {statusConfig.message}</Text>
                    </LinearGradient>
                </View>

                {/* Details */}
                <View style={heartRateViewerStyles.readingDetails}>
                    <View style={heartRateViewerStyles.detailRow}>
                        <Ionicons name="time-outline" size={16} color="#666" />
                        <Text style={heartRateViewerStyles.detailText}>
                            {formatDate(item.measuredAt)} at {formatTime(item.measuredAt)}
                        </Text>
                    </View>
                    
                    <View style={heartRateViewerStyles.detailRow}>
                        <Text style={heartRateViewerStyles.typeEmoji}>{typeConfig.emoji}</Text>
                        <Text style={heartRateViewerStyles.detailText}>{typeConfig.label}</Text>
                        {item.measurementMethod === 'pulse_count' && (
                            <View style={heartRateViewerStyles.methodBadge}>
                                <Text style={heartRateViewerStyles.methodText}>Pulse Counter</Text>
                            </View>
                        )}
                    </View>

                    {item.pulseCountData && (
                        <View style={heartRateViewerStyles.detailRow}>
                            <Ionicons name="analytics-outline" size={16} color="#666" />
                            <Text style={heartRateViewerStyles.detailText}>
                                {item.pulseCountData.count} beats in {item.pulseCountData.duration}s
                            </Text>
                        </View>
                    )}
                </View>

                {/* Notes */}
                {item.notes && (
                    <View style={heartRateViewerStyles.notesContainer}>
                        <Text style={heartRateViewerStyles.notesText}>{item.notes}</Text>
                    </View>
                )}
            </View>
        );
    };

    const renderEmptyState = () => (
        <View style={heartRateViewerStyles.emptyState}>
            <Ionicons name="heart-outline" size={64} color="#ccc" />
            <Text style={heartRateViewerStyles.emptyTitle}>No Heart Rate Records</Text>
            <Text style={heartRateViewerStyles.emptyMessage}>
                Start tracking your heart rate to see your cardiovascular health patterns here.
            </Text>
            <TouchableOpacity style={heartRateViewerStyles.emptyButton} onPress={onClose}>
                <Text style={heartRateViewerStyles.emptyButtonText}>Add First Reading</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={heartRateViewerStyles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#e91e63" />
            
            {/* Header */}
            <LinearGradient
                colors={['#e91e63', '#f06292']}
                style={heartRateViewerStyles.headerGradient}
            >
                <View style={heartRateViewerStyles.header}>
                    <TouchableOpacity onPress={onClose} style={heartRateViewerStyles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={heartRateViewerStyles.headerTitle}>
                        {patientId ? 'Patient Heart Rate' : 'My Heart Rate History'}
                    </Text>
                    <View style={heartRateViewerStyles.headerSpacer} />
                </View>
            </LinearGradient>

            {readings.length === 0 && !loading ? (
                renderEmptyState()
            ) : (
                <FlatList
                    data={readings}
                    renderItem={renderReadingItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={heartRateViewerStyles.listContainer}
                    ListHeaderComponent={renderStatsHeader}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#e91e63']} />
                    }
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}
