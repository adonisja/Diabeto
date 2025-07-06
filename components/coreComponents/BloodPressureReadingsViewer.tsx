import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { bloodPressureViewerStyles } from '../../assets/styles/componentStyles/bloodPressureViewerStyles';
import { logAction } from '../../firebase/LogService';
import { useAuth } from '../../firebase/AuthContext';

// Mock data for development - replace with actual Firestore integration
const generateMockReadings = () => {
  const readings = [];
  const now = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    const systolic = 110 + Math.floor(Math.random() * 30);
    const diastolic = 70 + Math.floor(Math.random() * 20);
    
    readings.push({
      id: `reading_${i}`,
      systolic,
      diastolic,
      pulse: 60 + Math.floor(Math.random() * 40),
      timestamp: date,
      notes: i % 3 === 0 ? 'After exercise' : i % 5 === 0 ? 'Morning reading' : '',
      category: getBloodPressureCategory(systolic, diastolic),
    });
  }
  
  return readings.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const getBloodPressureCategory = (systolic: number, diastolic: number) => {
  if (systolic < 120 && diastolic < 80) return 'Normal';
  if (systolic < 130 && diastolic < 80) return 'Elevated';
  if (systolic < 140 || diastolic < 90) return 'High Stage 1';
  if (systolic < 180 || diastolic < 120) return 'High Stage 2';
  return 'Hypertensive Crisis';
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Normal': return '#4CAF50';
    case 'Elevated': return '#FF9800';
    case 'High Stage 1': return '#FF5722';
    case 'High Stage 2': return '#D32F2F';
    case 'Hypertensive Crisis': return '#B71C1C';
    default: return '#757575';
  }
};

interface BloodPressureReading {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  timestamp: Date;
  notes?: string;
  category: string;
}

interface BloodPressureReadingsViewerProps {
  onRefresh?: () => void;
}

export default function BloodPressureReadingsViewer({ onRefresh }: BloodPressureReadingsViewerProps) {
  const [readings, setReadings] = useState<BloodPressureReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const { userProfile } = useAuth();

  useEffect(() => {
    loadReadings();
  }, []);

  const loadReadings = async () => {
    try {
      setLoading(true);
      if (userProfile) {
        await logAction(
          userProfile.uid,
          userProfile.username || 'Unknown',
          userProfile.email,
          userProfile.role,
          'blood_pressure_readings_viewed',
          'success',
          { period: selectedPeriod }
        );
      }
      
      // TODO: Replace with actual Firestore query
      const mockReadings = generateMockReadings();
      setReadings(mockReadings);
    } catch (error) {
      console.error('Error loading blood pressure readings:', error);
      Alert.alert('Error', 'Failed to load blood pressure readings');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredReadings = () => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
    }
    
    return readings.filter(reading => reading.timestamp >= cutoffDate);
  };

  const calculateStats = () => {
    const filteredReadings = getFilteredReadings();
    if (filteredReadings.length === 0) return null;

    const systolicValues = filteredReadings.map(r => r.systolic);
    const diastolicValues = filteredReadings.map(r => r.diastolic);
    const pulseValues = filteredReadings.map(r => r.pulse);

    return {
      avgSystolic: Math.round(systolicValues.reduce((a, b) => a + b, 0) / systolicValues.length),
      avgDiastolic: Math.round(diastolicValues.reduce((a, b) => a + b, 0) / diastolicValues.length),
      avgPulse: Math.round(pulseValues.reduce((a, b) => a + b, 0) / pulseValues.length),
      maxSystolic: Math.max(...systolicValues),
      minSystolic: Math.min(...systolicValues),
      maxDiastolic: Math.max(...diastolicValues),
      minDiastolic: Math.min(...diastolicValues),
      readingCount: filteredReadings.length,
    };
  };

  const handleDeleteReading = async (readingId: string) => {
    Alert.alert(
      'Delete Reading',
      'Are you sure you want to delete this blood pressure reading?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (userProfile) {
                await logAction(
                  userProfile.uid,
                  userProfile.username || 'Unknown',
                  userProfile.email,
                  userProfile.role,
                  'blood_pressure_reading_deleted',
                  'success',
                  { readingId }
                );
              }
              setReadings(prev => prev.filter(r => r.id !== readingId));
              Alert.alert('Success', 'Reading deleted successfully');
            } catch (error) {
              console.error('Error deleting reading:', error);
              Alert.alert('Error', 'Failed to delete reading');
            }
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const stats = calculateStats();
  const filteredReadings = getFilteredReadings();

  if (loading) {
    return (
      <View style={bloodPressureViewerStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#E53E3E" />
        <Text style={bloodPressureViewerStyles.loadingText}>Loading readings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={bloodPressureViewerStyles.container}>
      {/* Header */}
      <View style={bloodPressureViewerStyles.header}>
        <Text style={bloodPressureViewerStyles.title}>Blood Pressure History</Text>
        <TouchableOpacity
          style={bloodPressureViewerStyles.refreshButton}
          onPress={() => {
            loadReadings();
            onRefresh?.();
          }}
        >
          <Ionicons name="refresh" size={24} color="#E53E3E" />
        </TouchableOpacity>
      </View>

      {/* Period Filter */}
      <View style={bloodPressureViewerStyles.filterContainer}>
        {(['week', 'month', 'quarter'] as const).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              bloodPressureViewerStyles.filterButton,
              selectedPeriod === period && bloodPressureViewerStyles.filterButtonActive
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[
              bloodPressureViewerStyles.filterButtonText,
              selectedPeriod === period && bloodPressureViewerStyles.filterButtonTextActive
            ]}>
              {period === 'week' ? 'Week' : period === 'month' ? 'Month' : 'Quarter'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Statistics Card */}
      {stats && (
        <View style={bloodPressureViewerStyles.statsCard}>
          <Text style={bloodPressureViewerStyles.statsTitle}>Summary</Text>
          <View style={bloodPressureViewerStyles.statsGrid}>
            <View style={bloodPressureViewerStyles.statItem}>
              <Text style={bloodPressureViewerStyles.statLabel}>Average</Text>
              <Text style={bloodPressureViewerStyles.statValue}>
                {stats.avgSystolic}/{stats.avgDiastolic}
              </Text>
              <Text style={bloodPressureViewerStyles.statUnit}>mmHg</Text>
            </View>
            <View style={bloodPressureViewerStyles.statItem}>
              <Text style={bloodPressureViewerStyles.statLabel}>Pulse</Text>
              <Text style={bloodPressureViewerStyles.statValue}>{stats.avgPulse}</Text>
              <Text style={bloodPressureViewerStyles.statUnit}>bpm</Text>
            </View>
            <View style={bloodPressureViewerStyles.statItem}>
              <Text style={bloodPressureViewerStyles.statLabel}>Readings</Text>
              <Text style={bloodPressureViewerStyles.statValue}>{stats.readingCount}</Text>
              <Text style={bloodPressureViewerStyles.statUnit}>total</Text>
            </View>
          </View>
          <View style={bloodPressureViewerStyles.rangeContainer}>
            <Text style={bloodPressureViewerStyles.rangeText}>
              Range: {stats.minSystolic}-{stats.maxSystolic}/{stats.minDiastolic}-{stats.maxDiastolic} mmHg
            </Text>
          </View>
        </View>
      )}

      {/* Readings List */}
      <View style={bloodPressureViewerStyles.readingsContainer}>
        <Text style={bloodPressureViewerStyles.sectionTitle}>Recent Readings</Text>
        
        {filteredReadings.length === 0 ? (
          <View style={bloodPressureViewerStyles.emptyState}>
            <Ionicons name="heart-outline" size={48} color="#CCCCCC" />
            <Text style={bloodPressureViewerStyles.emptyStateText}>
              No blood pressure readings found for this period
            </Text>
          </View>
        ) : (
          filteredReadings.map((reading) => (
            <View key={reading.id} style={bloodPressureViewerStyles.readingCard}>
              <View style={bloodPressureViewerStyles.readingHeader}>
                <View>
                  <Text style={bloodPressureViewerStyles.readingDate}>
                    {formatDate(reading.timestamp)}
                  </Text>
                  <Text style={bloodPressureViewerStyles.readingTime}>
                    {formatTime(reading.timestamp)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={bloodPressureViewerStyles.deleteButton}
                  onPress={() => handleDeleteReading(reading.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
              
              <View style={bloodPressureViewerStyles.readingValues}>
                <View style={bloodPressureViewerStyles.primaryValue}>
                  <Text style={bloodPressureViewerStyles.bpValue}>
                    {reading.systolic}/{reading.diastolic}
                  </Text>
                  <Text style={bloodPressureViewerStyles.bpUnit}>mmHg</Text>
                </View>
                <View style={bloodPressureViewerStyles.pulseValue}>
                  <Text style={bloodPressureViewerStyles.pulseNumber}>{reading.pulse}</Text>
                  <Text style={bloodPressureViewerStyles.pulseUnit}>bpm</Text>
                </View>
              </View>
              
              <View style={[
                bloodPressureViewerStyles.categoryBadge,
                { backgroundColor: getCategoryColor(reading.category) }
              ]}>
                <Text style={bloodPressureViewerStyles.categoryText}>
                  {reading.category}
                </Text>
              </View>
              
              {reading.notes && (
                <Text style={bloodPressureViewerStyles.readingNotes}>
                  {reading.notes}
                </Text>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
