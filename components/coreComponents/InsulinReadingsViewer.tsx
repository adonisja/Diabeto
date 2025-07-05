// components/coreComponents/InsulinReadingsViewer.tsx

import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    RefreshControl, 
    ActivityIndicator, 
    Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../firebase/AuthContext';
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import insulinViewerStyles from '../../assets/styles/componentStyles/insulinViewerStyles';

interface InsulinRecord {
    id: string;
    insulinType: 'long-acting' | 'short-acting';
    mealTiming: 'pre-meal' | 'post-meal';
    injectionSite: string;
    injectionSubSite: 'left-side' | 'right-side';
    units: number;
    notes: string;
    timestamp: any;
    userEmail: string;
    firstName: string;
    lastName: string;
    entrySource: string;
}

interface InsulinReadingsViewerProps {
    onClose: () => void;
    patientId?: string; // For caretaker/doctor view
}

const formatInjectionSite = (site: string, subSite: string) => {
    const siteMap: { [key: string]: string } = {
        'stomach': 'Stomach',
        'left-arm': 'Left Arm',
        'right-arm': 'Right Arm',
        'left-leg': 'Left Leg',
        'right-leg': 'Right Leg'
    };
    
    const subSiteMap: { [key: string]: string } = {
        'left-side': 'Left Side',
        'right-side': 'Right Side'
    };
    
    return `${siteMap[site] || site} - ${subSiteMap[subSite] || subSite}`;
};

const formatInsulinType = (type: string) => {
    switch (type) {
        case 'long-acting': return 'Long-Acting';
        case 'short-acting': return 'Short-Acting';
        default: return type;
    }
};

const formatMealTiming = (timing: string) => {
    switch (timing) {
        case 'pre-meal': return 'Pre-Meal';
        case 'post-meal': return 'Post-Meal';
        default: return timing;
    }
};

const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getInsulinTypeColor = (type: string) => {
    switch (type) {
        case 'long-acting': return '#4c669f';
        case 'short-acting': return '#FF6B6B';
        default: return '#666';
    }
};

const getInsulinTypeIcon = (type: string) => {
    switch (type) {
        case 'long-acting': return 'time';
        case 'short-acting': return 'flash';
        default: return 'medical';
    }
};

export default function InsulinReadingsViewer({ onClose, patientId }: InsulinReadingsViewerProps) {
    const { user, userProfile } = useAuth();
    const [readings, setReadings] = useState<InsulinRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const targetUserId = patientId || user?.uid;

    useEffect(() => {
        if (!targetUserId) return;

        const q = query(
            collection(db, 'insulinRecords'),
            where('userId', '==', targetUserId),
            orderBy('timestamp', 'desc'),
            limit(100)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const readingsData: InsulinRecord[] = [];
            querySnapshot.forEach((doc) => {
                readingsData.push({
                    id: doc.id,
                    ...doc.data()
                } as InsulinRecord);
            });
            setReadings(readingsData);
            setLoading(false);
            setRefreshing(false);
        }, (error) => {
            console.error('Error fetching insulin readings:', error);
            Alert.alert('Error', 'Failed to load insulin readings');
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

        const totalUnits = readings.reduce((sum, record) => sum + record.units, 0);
        const avgUnits = totalUnits / readings.length;
        
        const longActingCount = readings.filter(r => r.insulinType === 'long-acting').length;
        const shortActingCount = readings.filter(r => r.insulinType === 'short-acting').length;
        
        // Site rotation analysis
        const siteUsage: { [key: string]: number } = {};
        readings.forEach(record => {
            const siteKey = `${record.injectionSite}-${record.injectionSubSite}`;
            siteUsage[siteKey] = (siteUsage[siteKey] || 0) + 1;
        });

        const mostUsedSite = Object.entries(siteUsage)
            .sort(([,a], [,b]) => b - a)[0];

        return {
            totalRecords: readings.length,
            totalUnits,
            avgUnits: Math.round(avgUnits * 10) / 10,
            longActingCount,
            shortActingCount,
            mostUsedSite: mostUsedSite ? formatInjectionSite(
                mostUsedSite[0].split('-')[0], 
                mostUsedSite[0].split('-')[1] + '-' + mostUsedSite[0].split('-')[2]
            ) : 'N/A'
        };
    };

    const stats = calculateStats();

    const renderReadingItem = ({ item }: { item: InsulinRecord }) => {
        const typeColor = getInsulinTypeColor(item.insulinType);
        const typeIcon = getInsulinTypeIcon(item.insulinType);

        return (
            <View style={insulinViewerStyles.readingItem}>
                <View style={insulinViewerStyles.readingHeader}>
                    <View style={insulinViewerStyles.unitsContainer}>
                        <Text style={insulinViewerStyles.unitsValue}>{item.units}</Text>
                        <Text style={insulinViewerStyles.unitsLabel}>units</Text>
                    </View>
                    <View style={[insulinViewerStyles.typeContainer, { backgroundColor: typeColor }]}>
                        <Ionicons name={typeIcon as any} size={16} color="#fff" />
                        <Text style={insulinViewerStyles.typeText}>
                            {formatInsulinType(item.insulinType)}
                        </Text>
                    </View>
                </View>
                
                <View style={insulinViewerStyles.readingDetails}>
                    <View style={insulinViewerStyles.detailRow}>
                        <Ionicons name="time" size={14} color="#666" />
                        <Text style={insulinViewerStyles.detailText}>
                            {formatDate(item.timestamp)}
                        </Text>
                    </View>
                    <View style={insulinViewerStyles.detailRow}>
                        <Ionicons name="restaurant" size={14} color="#666" />
                        <Text style={insulinViewerStyles.detailText}>
                            {formatMealTiming(item.mealTiming)}
                        </Text>
                    </View>
                    <View style={insulinViewerStyles.detailRow}>
                        <Ionicons name="body" size={14} color="#666" />
                        <Text style={insulinViewerStyles.detailText}>
                            {formatInjectionSite(item.injectionSite, item.injectionSubSite)}
                        </Text>
                    </View>
                    {item.entrySource && (
                        <View style={insulinViewerStyles.detailRow}>
                            <Ionicons name="person" size={14} color="#666" />
                            <Text style={insulinViewerStyles.detailText}>
                                Entered by {item.entrySource === 'patient' ? 'patient' : item.entrySource}
                            </Text>
                        </View>
                    )}
                </View>
                
                {item.notes && (
                    <View style={insulinViewerStyles.notesContainer}>
                        <Text style={insulinViewerStyles.notesText}>{item.notes}</Text>
                    </View>
                )}
            </View>
        );
    };

    const renderEmptyState = () => (
        <View style={insulinViewerStyles.emptyState}>
            <Ionicons name="medical-outline" size={64} color="#ccc" />
            <Text style={insulinViewerStyles.emptyStateTitle}>No Insulin Records</Text>
            <Text style={insulinViewerStyles.emptyStateText}>
                Start tracking insulin injections by logging your first record.
            </Text>
        </View>
    );

    const renderStatsSection = () => {
        if (!stats) return null;

        return (
            <View style={insulinViewerStyles.statsContainer}>
                <Text style={insulinViewerStyles.statsTitle}>Summary Statistics</Text>
                <View style={insulinViewerStyles.statsGrid}>
                    <View style={insulinViewerStyles.statItem}>
                        <Text style={insulinViewerStyles.statValue}>{stats.totalRecords}</Text>
                        <Text style={insulinViewerStyles.statLabel}>Total Records</Text>
                    </View>
                    <View style={insulinViewerStyles.statItem}>
                        <Text style={insulinViewerStyles.statValue}>{stats.totalUnits}</Text>
                        <Text style={insulinViewerStyles.statLabel}>Total Units</Text>
                    </View>
                    <View style={insulinViewerStyles.statItem}>
                        <Text style={insulinViewerStyles.statValue}>{stats.avgUnits}</Text>
                        <Text style={insulinViewerStyles.statLabel}>Avg Units</Text>
                    </View>
                    <View style={insulinViewerStyles.statItem}>
                        <Text style={insulinViewerStyles.statValue}>{stats.longActingCount}</Text>
                        <Text style={insulinViewerStyles.statLabel}>Long-Acting</Text>
                    </View>
                    <View style={insulinViewerStyles.statItem}>
                        <Text style={insulinViewerStyles.statValue}>{stats.shortActingCount}</Text>
                        <Text style={insulinViewerStyles.statLabel}>Short-Acting</Text>
                    </View>
                    <View style={[insulinViewerStyles.statItem, { flex: 2 }]}>
                        <Text style={insulinViewerStyles.statValue} numberOfLines={1}>
                            {stats.mostUsedSite}
                        </Text>
                        <Text style={insulinViewerStyles.statLabel}>Most Used Site</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={insulinViewerStyles.container}>
            {/* Header */}
            <View style={insulinViewerStyles.header}>
                <TouchableOpacity onPress={onClose} style={insulinViewerStyles.closeButton}>
                    <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
                <Text style={insulinViewerStyles.headerTitle}>Insulin Records</Text>
                <View style={insulinViewerStyles.headerSpacer} />
            </View>

            {/* Content */}
            {loading ? (
                <View style={insulinViewerStyles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4c669f" />
                    <Text style={insulinViewerStyles.loadingText}>Loading records...</Text>
                </View>
            ) : (
                <>
                    {/* Stats Section */}
                    {renderStatsSection()}

                    {/* Records List */}
                    <FlatList
                        data={readings}
                        renderItem={renderReadingItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={insulinViewerStyles.listContainer}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#4c669f']}
                            />
                        }
                        ListEmptyComponent={renderEmptyState}
                        showsVerticalScrollIndicator={false}
                    />
                </>
            )}
        </View>
    );
}
