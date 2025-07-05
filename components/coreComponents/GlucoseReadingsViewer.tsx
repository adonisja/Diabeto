// components/coreComponents/GlucoseReadingsViewer-enhanced.tsx

import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    RefreshControl, 
    ActivityIndicator, 
    Alert,
    SafeAreaView,
    StatusBar,
    Animated,
    Dimensions,
    StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../firebase/AuthContext';
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

const { width } = Dimensions.get('window');

interface GlucoseReading {
    id: string;
    glucoseValue: number;
    readingType: string;
    notes: string;
    status: string;
    timestamp: any;
    userEmail: string;
    firstName: string;
    lastName: string;
    entrySource: string;
    fingerPricked?: string;
}

interface GlucoseReadingsViewerProps {
    onClose: () => void;
}

const READING_TYPE_CONFIG = {
    fasting: { emoji: '🌅', label: 'Fasting', gradient: ['#ff9a9e', '#fecfef'] },
    pre_meal: { emoji: '🍽️', label: 'Pre-Meal', gradient: ['#a8edea', '#fed6e3'] },
    post_meal: { emoji: '🍎', label: 'Post-Meal', gradient: ['#ffecd2', '#fcb69f'] },
    bedtime: { emoji: '🌙', label: 'Bedtime', gradient: ['#667eea', '#764ba2'] },
    random: { emoji: '🎲', label: 'Random', gradient: ['#4facfe', '#00f2fe'] }
};

const STATUS_CONFIG = {
    low: { 
        color: ['#ff6b6b', '#ee5a52'], 
        icon: 'arrow-down-circle', 
        emoji: '⬇️',
        message: 'Below Target'
    },
    normal: { 
        color: ['#4ecdc4', '#44a08d'], 
        icon: 'checkmark-circle', 
        emoji: '✅',
        message: 'In Range'
    },
    elevated: { 
        color: ['#ffe66d', '#ff8a00'], 
        icon: 'warning', 
        emoji: '⚠️',
        message: 'Slightly High'
    },
    high: { 
        color: ['#ff6b6b', '#ee5a52'], 
        icon: 'alert-circle', 
        emoji: '🚨',
        message: 'Above Target'
    }
};

const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } else if (diffDays === 1) {
        return 'Yesterday ' + date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } else if (diffDays < 7) {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    } else {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};

export default function GlucoseReadingsViewer({ onClose }: GlucoseReadingsViewerProps) {
    const { user } = useAuth();
    const [readings, setReadings] = useState<GlucoseReading[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'glucoseReadings'),
            where('userId', '==', user.uid),
            orderBy('timestamp', 'desc'),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const readingsData: GlucoseReading[] = [];
            querySnapshot.forEach((doc) => {
                readingsData.push({
                    id: doc.id,
                    ...doc.data()
                } as GlucoseReading);
            });
            setReadings(readingsData);
            setLoading(false);
            setRefreshing(false);
        }, (error) => {
            console.error('Error fetching glucose readings:', error);
            Alert.alert('Error', 'Failed to load glucose readings');
            setLoading(false);
            setRefreshing(false);
        });

        return () => unsubscribe();
    }, [user]);

    const onRefresh = () => {
        setRefreshing(true);
    };

    const calculateStats = () => {
        if (readings.length === 0) return { avg: 0, low: 0, normal: 0, high: 0 };
        
        const recent = readings.slice(0, 14); // Last 14 readings
        const avg = Math.round(recent.reduce((sum, r) => sum + r.glucoseValue, 0) / recent.length);
        
        const statusCounts = recent.reduce((acc, r) => {
            acc[r.status] = (acc[r.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            avg,
            low: statusCounts.low || 0,
            normal: statusCounts.normal || 0,
            high: (statusCounts.high || 0) + (statusCounts.elevated || 0)
        };
    };

    const renderReadingItem = ({ item, index }: { item: GlucoseReading; index: number }) => {
        const statusConfig = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.normal;
        const typeConfig = READING_TYPE_CONFIG[item.readingType as keyof typeof READING_TYPE_CONFIG];
        
        return (
            <Animated.View 
                style={[
                    styles.readingCard,
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
                    colors={['#ffffff', '#f8faff']}
                    style={styles.cardGradient}
                >
                    {/* Header with glucose value and status */}
                    <View style={styles.cardHeader}>
                        <View style={styles.valueSection}>
                            <Text style={styles.glucoseValue}>{item.glucoseValue}</Text>
                            <Text style={styles.unitText}>mg/dL</Text>
                        </View>
                        
                        <LinearGradient
                            colors={statusConfig.color}
                            style={styles.statusBadge}
                        >
                            <Text style={styles.statusEmoji}>{statusConfig.emoji}</Text>
                            <Text style={styles.statusText}>{statusConfig.message}</Text>
                        </LinearGradient>
                    </View>

                    {/* Reading type and time */}
                    <View style={styles.readingInfo}>
                        <View style={styles.typeContainer}>
                            {typeConfig && (
                                <LinearGradient
                                    colors={typeConfig.gradient}
                                    style={styles.typeBadge}
                                >
                                    <Text style={styles.typeEmoji}>{typeConfig.emoji}</Text>
                                    <Text style={styles.typeText}>{typeConfig.label}</Text>
                                </LinearGradient>
                            )}
                        </View>
                        
                        <View style={styles.timeContainer}>
                            <Ionicons name="time-outline" size={16} color="#667eea" />
                            <Text style={styles.timeText}>{formatDate(item.timestamp)}</Text>
                        </View>
                    </View>

                    {/* Additional details */}
                    <View style={styles.detailsSection}>
                        {item.entrySource && (
                            <View style={styles.detailItem}>
                                <Ionicons name="person-outline" size={14} color="#718096" />
                                <Text style={styles.detailText}>
                                    {item.entrySource === 'patient' ? 'Self-logged' : `By ${item.entrySource}`}
                                </Text>
                            </View>
                        )}
                        
                        {item.fingerPricked && (
                            <View style={styles.detailItem}>
                                <Ionicons name="hand-left-outline" size={14} color="#718096" />
                                <Text style={styles.detailText}>{item.fingerPricked}</Text>
                            </View>
                        )}
                    </View>

                    {/* Notes if present */}
                    {item.notes && (
                        <View style={styles.notesContainer}>
                            <Ionicons name="chatbubble-outline" size={14} color="#667eea" />
                            <Text style={styles.notesText}>{item.notes}</Text>
                        </View>
                    )}
                </LinearGradient>
            </Animated.View>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.emptyIconContainer}
            >
                <Ionicons name="analytics-outline" size={48} color="#ffffff" />
            </LinearGradient>
            <Text style={styles.emptyTitle}>No Glucose Readings Yet</Text>
            <Text style={styles.emptySubtitle}>
                Start tracking your glucose levels by logging your first reading! 📊
            </Text>
        </View>
    );

    const renderStatsHeader = () => {
        const stats = calculateStats();
        
        return (
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.statsContainer}
            >
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{readings.length}</Text>
                        <Text style={styles.statLabel}>Total Readings</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.avg}</Text>
                        <Text style={styles.statLabel}>Avg (14 days)</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.normal}</Text>
                        <Text style={styles.statLabel}>✅ In Range</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.high}</Text>
                        <Text style={styles.statLabel}>⚠️ Above Range</Text>
                    </View>
                </View>
            </LinearGradient>
        );
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.loadingIconContainer}
                    >
                        <ActivityIndicator size="large" color="#ffffff" />
                    </LinearGradient>
                    <Text style={styles.loadingText}>Loading your glucose readings...</Text>
                </View>
            ) : (
                <FlatList
                    data={readings}
                    renderItem={renderReadingItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#667eea']}
                            tintColor="#667eea"
                        />
                    }
                    ListHeaderComponent={readings.length > 0 ? renderStatsHeader : null}
                    ListEmptyComponent={renderEmptyState}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8', // Match the parent background
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    loadingIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#4a5568',
        fontWeight: '600',
        textAlign: 'center',
    },
    statsContainer: {
        margin: 20,
        marginTop: 10,
        borderRadius: 20,
        padding: 20,
        marginBottom: 10,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '600',
        textAlign: 'center',
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    readingCard: {
        marginBottom: 16,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    cardGradient: {
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(102, 126, 234, 0.1)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    valueSection: {
        alignItems: 'center',
    },
    glucoseValue: {
        fontSize: 36,
        fontWeight: '800',
        color: '#2d3748',
    },
    unitText: {
        fontSize: 14,
        color: '#718096',
        fontWeight: '600',
        marginTop: -4,
    },
    statusBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusEmoji: {
        fontSize: 16,
        marginRight: 6,
    },
    statusText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '700',
    },
    readingInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    typeContainer: {
        flex: 1,
    },
    typeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    typeEmoji: {
        fontSize: 14,
        marginRight: 4,
    },
    typeText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '700',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 14,
        color: '#667eea',
        fontWeight: '600',
        marginLeft: 4,
    },
    detailsSection: {
        marginBottom: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    detailText: {
        fontSize: 12,
        color: '#718096',
        marginLeft: 6,
        fontWeight: '500',
    },
    notesContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(102, 126, 234, 0.05)',
        padding: 12,
        borderRadius: 12,
        marginTop: 8,
    },
    notesText: {
        fontSize: 14,
        color: '#4a5568',
        marginLeft: 8,
        flex: 1,
        fontStyle: 'italic',
        lineHeight: 20,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 60,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#2d3748',
        marginBottom: 12,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#718096',
        textAlign: 'center',
        lineHeight: 24,
    },
});
