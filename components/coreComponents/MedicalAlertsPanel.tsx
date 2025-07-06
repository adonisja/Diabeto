import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import medicalAlertsPanelStyles from '../../assets/styles/componentStyles/medicalAlertsPanelStyles';
import { useAuth } from '../../firebase/AuthContext';
import { logAction } from '../../firebase/LogService';

// Mock data for development - replace with actual Firestore integration
const generateMockAlerts = (): MedicalAlert[] => {
  const alerts: MedicalAlert[] = [
    {
      id: 'alert_001',
      patientId: 'patient_123',
      patientName: 'John Doe',
      readingType: 'blood_pressure',
      severity: 'critical',
      value: '190/120',
      normalRange: '90-120/60-80 mmHg',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      description: 'Hypertensive Crisis - Immediate medical attention required',
      context: 'After Exercise',
      notes: 'Patient reported headache and dizziness',
      acknowledged: false,
    },
    {
      id: 'alert_002',
      patientId: 'patient_456',
      patientName: 'Jane Smith',
      readingType: 'glucose',
      severity: 'severe',
      value: '450',
      normalRange: '70-180 mg/dL',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      description: 'Severely elevated blood glucose - Risk of diabetic ketoacidosis',
      context: 'After Meal',
      notes: 'Patient missed insulin dose',
      acknowledged: false,
    },
    {
      id: 'alert_003',
      patientId: 'patient_789',
      patientName: 'Mike Johnson',
      readingType: 'heart_rate',
      severity: 'warning',
      value: '45',
      normalRange: '60-100 BPM',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      description: 'Bradycardia - Abnormally slow heart rate',
      context: 'Rest',
      notes: 'Patient on beta-blockers',
      acknowledged: true,
    },
    {
      id: 'alert_004',
      patientId: 'patient_321',
      patientName: 'Sarah Wilson',
      readingType: 'glucose',
      severity: 'mild',
      value: '65',
      normalRange: '70-180 mg/dL',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      description: 'Mild hypoglycemia - Monitor for symptoms',
      context: 'Before Meal',
      notes: 'Patient exercised before reading',
      acknowledged: true,
    },
  ];
  
  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export type AlertSeverity = 'mild' | 'warning' | 'severe' | 'critical';
export type ReadingType = 'glucose' | 'blood_pressure' | 'heart_rate' | 'insulin';

export interface MedicalAlert {
  id: string;
  patientId: string;
  patientName: string;
  readingType: ReadingType;
  severity: AlertSeverity;
  value: string;
  normalRange: string;
  timestamp: Date;
  description: string;
  context?: string;
  notes?: string;
  acknowledged: boolean;
}

interface MedicalAlertsPanelProps {
  userRole: 'doctor' | 'caretaker';
}

export default function MedicalAlertsPanel({ userRole }: MedicalAlertsPanelProps) {
  const [alerts, setAlerts] = useState<MedicalAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | AlertSeverity>('all');
  const { userProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      if (userProfile) {
        await logAction(
          userProfile.uid,
          userProfile.username || 'Unknown',
          userProfile.email,
          userProfile.role,
          'medical_alerts_viewed',
          'success',
          { userRole, filterType: filter }
        );
      }
      
      // TODO: Replace with actual Firestore query based on user relationships
      const mockAlerts = generateMockAlerts();
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Error loading medical alerts:', error);
      Alert.alert('Error', 'Failed to load medical alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAlerts();
    setRefreshing(false);
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      if (userProfile) {
        await logAction(
          userProfile.uid,
          userProfile.username || 'Unknown',
          userProfile.email,
          userProfile.role,
          'medical_alert_acknowledged',
          'success',
          { alertId, userRole }
        );
      }

      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true }
          : alert
      ));
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      Alert.alert('Error', 'Failed to acknowledge alert');
    }
  };

  const handleViewAlertDetails = (alert: MedicalAlert) => {
    // Navigate to alert detail screen
    router.push({
      pathname: '/(protected)/medical-alert-detail',
      params: {
        alertId: alert.id,
        patientId: alert.patientId,
        readingType: alert.readingType,
        severity: alert.severity,
      }
    });
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'mild': return '#f39c12';
      case 'warning': return '#e67e22';
      case 'severe': return '#e74c3c';
      case 'critical': return '#8e44ad';
      default: return '#95a5a6';
    }
  };

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'mild': return 'information-circle';
      case 'warning': return 'warning';
      case 'severe': return 'alert-circle';
      case 'critical': return 'medical';
      default: return 'help-circle';
    }
  };

  const getReadingTypeIcon = (type: ReadingType) => {
    switch (type) {
      case 'glucose': return 'pulse';
      case 'blood_pressure': return 'heart-outline';
      case 'heart_rate': return 'heart';
      case 'insulin': return 'medical';
      default: return 'analytics';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const getFilteredAlerts = () => {
    if (filter === 'all') return alerts;
    return alerts.filter(alert => alert.severity === filter);
  };

  const getUnacknowledgedCount = () => {
    return alerts.filter(alert => !alert.acknowledged).length;
  };

  if (loading) {
    return (
      <View style={medicalAlertsPanelStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#E53E3E" />
        <Text style={medicalAlertsPanelStyles.loadingText}>Loading medical alerts...</Text>
      </View>
    );
  }

  const filteredAlerts = getFilteredAlerts();
  const unacknowledgedCount = getUnacknowledgedCount();

  return (
    <View style={medicalAlertsPanelStyles.container}>
      {/* Header */}
      <View style={medicalAlertsPanelStyles.header}>
        <View style={medicalAlertsPanelStyles.headerLeft}>
          <Text style={medicalAlertsPanelStyles.title}>Medical Alerts</Text>
          {unacknowledgedCount > 0 && (
            <View style={medicalAlertsPanelStyles.badge}>
              <Text style={medicalAlertsPanelStyles.badgeText}>{unacknowledgedCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={medicalAlertsPanelStyles.refreshButton}
          onPress={handleRefresh}
        >
          <Ionicons name="refresh" size={24} color="#E53E3E" />
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View style={medicalAlertsPanelStyles.filterContainer}>
        {(['all', 'critical', 'severe', 'warning', 'mild'] as const).map((severity) => (
          <TouchableOpacity
            key={severity}
            style={[
              medicalAlertsPanelStyles.filterButton,
              filter === severity && medicalAlertsPanelStyles.filterButtonActive,
              severity !== 'all' && { borderColor: getSeverityColor(severity) }
            ]}
            onPress={() => setFilter(severity)}
          >
            <Text style={[
              medicalAlertsPanelStyles.filterButtonText,
              filter === severity && medicalAlertsPanelStyles.filterButtonTextActive
            ]}>
              {severity === 'all' ? 'All' : severity.charAt(0).toUpperCase() + severity.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Alerts List */}
      <ScrollView 
        style={medicalAlertsPanelStyles.alertsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredAlerts.length === 0 ? (
          <View style={medicalAlertsPanelStyles.emptyState}>
            <Ionicons name="checkmark-circle" size={48} color="#27ae60" />
            <Text style={medicalAlertsPanelStyles.emptyStateText}>
              No {filter === 'all' ? '' : filter + ' '}alerts at this time
            </Text>
            <Text style={medicalAlertsPanelStyles.emptyStateSubtext}>
              Your patients' readings are within normal ranges
            </Text>
          </View>
        ) : (
          filteredAlerts.map((alert) => (
            <TouchableOpacity
              key={alert.id}
              style={[
                medicalAlertsPanelStyles.alertCard,
                !alert.acknowledged && medicalAlertsPanelStyles.alertCardUnacknowledged,
                { borderLeftColor: getSeverityColor(alert.severity) }
              ]}
              onPress={() => handleViewAlertDetails(alert)}
            >
              <View style={medicalAlertsPanelStyles.alertHeader}>
                <View style={medicalAlertsPanelStyles.alertHeaderLeft}>
                  <View style={[
                    medicalAlertsPanelStyles.severityBadge,
                    { backgroundColor: getSeverityColor(alert.severity) }
                  ]}>
                    <Ionicons 
                      name={getSeverityIcon(alert.severity)} 
                      size={16} 
                      color="white" 
                    />
                  </View>
                  <View style={medicalAlertsPanelStyles.patientInfo}>
                    <Text style={medicalAlertsPanelStyles.patientName}>
                      {alert.patientName}
                    </Text>
                    <View style={medicalAlertsPanelStyles.readingInfo}>
                      <Ionicons 
                        name={getReadingTypeIcon(alert.readingType)} 
                        size={14} 
                        color="#666" 
                      />
                      <Text style={medicalAlertsPanelStyles.readingType}>
                        {alert.readingType.replace('_', ' ')}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={medicalAlertsPanelStyles.timestamp}>
                  {formatTimestamp(alert.timestamp)}
                </Text>
              </View>

              <View style={medicalAlertsPanelStyles.alertContent}>
                <View style={medicalAlertsPanelStyles.valueContainer}>
                  <Text style={medicalAlertsPanelStyles.valueLabel}>Reading:</Text>
                  <Text style={[
                    medicalAlertsPanelStyles.value,
                    { color: getSeverityColor(alert.severity) }
                  ]}>
                    {alert.value}
                  </Text>
                  <Text style={medicalAlertsPanelStyles.normalRange}>
                    (Normal: {alert.normalRange})
                  </Text>
                </View>
                
                <Text style={medicalAlertsPanelStyles.description}>
                  {alert.description}
                </Text>

                {alert.context && (
                  <Text style={medicalAlertsPanelStyles.context}>
                    Context: {alert.context}
                  </Text>
                )}

                {alert.notes && (
                  <Text style={medicalAlertsPanelStyles.notes}>
                    Notes: {alert.notes}
                  </Text>
                )}
              </View>

              <View style={medicalAlertsPanelStyles.alertActions}>
                {!alert.acknowledged && (
                  <TouchableOpacity
                    style={medicalAlertsPanelStyles.acknowledgeButton}
                    onPress={() => handleAcknowledgeAlert(alert.id)}
                  >
                    <Ionicons name="checkmark" size={16} color="#27ae60" />
                    <Text style={medicalAlertsPanelStyles.acknowledgeButtonText}>
                      Acknowledge
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={medicalAlertsPanelStyles.viewDetailsButton}
                  onPress={() => handleViewAlertDetails(alert)}
                >
                  <Text style={medicalAlertsPanelStyles.viewDetailsButtonText}>
                    View Details
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#E53E3E" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
