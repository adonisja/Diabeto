import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../firebase/AuthContext';
import { logAction } from '../../firebase/LogService';
import medicalAlertDetailStyles from '../../assets/styles/protectedStyles/medicalAlertDetailStyles';
import type { MedicalAlert, AlertSeverity, ReadingType } from '../../components/coreComponents/MedicalAlertsPanel';

export default function MedicalAlertDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userProfile } = useAuth();
  const [alert, setAlert] = useState<MedicalAlert | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock alert data - replace with actual Firestore query
  const mockAlertData: MedicalAlert = {
    id: params.alertId as string,
    patientId: params.patientId as string,
    patientName: 'John Doe',
    readingType: params.readingType as ReadingType,
    severity: params.severity as AlertSeverity,
    value: '190/120',
    normalRange: '90-120/60-80 mmHg',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    description: 'Hypertensive Crisis - Immediate medical attention required',
    context: 'After Exercise',
    notes: 'Patient reported headache and dizziness after morning exercise routine. Blood pressure taken 10 minutes post-workout.',
    acknowledged: false,
  };

  useEffect(() => {
    loadAlertDetails();
  }, []);

  const loadAlertDetails = async () => {
    try {
      setLoading(true);
      
      if (userProfile) {
        await logAction(
          userProfile.uid,
          userProfile.username || 'Unknown',
          userProfile.email,
          userProfile.role,
          'medical_alert_detail_viewed',
          'success',
          { 
            alertId: params.alertId,
            patientId: params.patientId,
            readingType: params.readingType,
            severity: params.severity 
          }
        );
      }

      // TODO: Replace with actual Firestore query
      setAlert(mockAlertData);
    } catch (error) {
      console.error('Error loading alert details:', error);
      Alert.alert('Error', 'Failed to load alert details');
    } finally {
      setLoading(false);
    }
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

  const getMedicalExplanation = (readingType: ReadingType, severity: AlertSeverity, value: string) => {
    switch (readingType) {
      case 'blood_pressure':
        if (severity === 'critical') {
          return {
            title: 'Hypertensive Crisis',
            explanation: 'A hypertensive crisis is a severe increase in blood pressure that can lead to a stroke. Extremely high blood pressure — a top number (systolic pressure) of 180 mmHg or higher or a bottom number (diastolic pressure) of 120 mmHg or higher — can damage blood vessels.',
            immediateActions: [
              'Call emergency services immediately if symptoms are present',
              'Do not wait - seek emergency medical care',
              'Monitor for symptoms: chest pain, shortness of breath, visual changes, or severe headache',
              'Do not drive yourself to the hospital',
            ],
            riskFactors: 'High blood pressure, medication non-compliance, stress, excessive salt intake',
            followUp: 'Emergency room evaluation required immediately',
          };
        } else if (severity === 'severe') {
          return {
            title: 'Stage 2 High Blood Pressure',
            explanation: 'Stage 2 high blood pressure indicates readings consistently ranging from 140/90 mmHg or higher. This level significantly increases the risk of heart attack and stroke.',
            immediateActions: [
              'Contact your healthcare provider within 24 hours',
              'Take blood pressure medication as prescribed',
              'Reduce sodium intake and limit alcohol',
              'Monitor blood pressure regularly',
            ],
            riskFactors: 'Age, family history, obesity, physical inactivity, tobacco use, excessive alcohol',
            followUp: 'Schedule appointment with physician within 1-2 days',
          };
        }
        break;
      
      case 'glucose':
        if (severity === 'severe') {
          return {
            title: 'Severe Hyperglycemia',
            explanation: 'Blood glucose levels above 400 mg/dL indicate severe hyperglycemia, which can lead to diabetic ketoacidosis (DKA) or hyperosmolar hyperglycemic syndrome (HHS). Both conditions are medical emergencies.',
            immediateActions: [
              'Check for ketones in urine if possible',
              'Contact healthcare provider immediately',
              'Stay hydrated with water (not sugary drinks)',
              'Take prescribed rapid-acting insulin if available',
              'Seek emergency care if vomiting or unable to keep fluids down',
            ],
            riskFactors: 'Missed insulin doses, illness, infection, stress, dehydration',
            followUp: 'Emergency evaluation if symptoms worsen, otherwise contact physician same day',
          };
        } else if (severity === 'mild') {
          return {
            title: 'Mild Hypoglycemia',
            explanation: 'Blood glucose levels between 54-70 mg/dL indicate mild hypoglycemia. While not immediately dangerous, it requires prompt treatment to prevent progression to more severe hypoglycemia.',
            immediateActions: [
              'Consume 15 grams of fast-acting carbohydrates',
              'Examples: 4 glucose tablets, 1/2 cup fruit juice, 1 tablespoon honey',
              'Recheck blood glucose in 15 minutes',
              'Repeat treatment if still below 70 mg/dL',
              'Eat a snack once blood glucose normalizes',
            ],
            riskFactors: 'Too much insulin, delayed or missed meals, increased physical activity',
            followUp: 'Monitor closely, contact provider if frequent episodes occur',
          };
        }
        break;

      case 'heart_rate':
        if (severity === 'warning') {
          return {
            title: 'Bradycardia (Slow Heart Rate)',
            explanation: 'A heart rate below 60 beats per minute is considered bradycardia. While some athletes normally have low heart rates, bradycardia can indicate underlying heart problems in others.',
            immediateActions: [
              'Monitor for symptoms: dizziness, fatigue, fainting, chest pain',
              'Avoid sudden position changes',
              'Stay hydrated',
              'Contact healthcare provider if symptomatic',
            ],
            riskFactors: 'Heart disease, medications (beta-blockers), electrolyte imbalances, hypothyroidism',
            followUp: 'Discuss with healthcare provider at next appointment, sooner if symptomatic',
          };
        }
        break;
    }

    return {
      title: 'Abnormal Reading Detected',
      explanation: 'This reading falls outside the normal range and requires attention.',
      immediateActions: ['Contact your healthcare provider for guidance'],
      riskFactors: 'Various factors can contribute to abnormal readings',
      followUp: 'Discuss with healthcare provider',
    };
  };

  const handleContactPatient = async () => {
    try {
      if (userProfile && alert) {
        await logAction(
          userProfile.uid,
          userProfile.username || 'Unknown',
          userProfile.email,
          userProfile.role,
          'patient_contacted_from_alert',
          'success',
          { 
            alertId: alert.id,
            patientId: alert.patientId,
            contactMethod: 'notification'
          }
        );
      }

      Alert.alert(
        'Contact Patient',
        'A notification has been sent to the patient regarding this abnormal reading.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error contacting patient:', error);
      Alert.alert('Error', 'Failed to contact patient');
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={medicalAlertDetailStyles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#E53E3E" />
        <View style={medicalAlertDetailStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#E53E3E" />
          <Text style={medicalAlertDetailStyles.loadingText}>Loading alert details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!alert) {
    return (
      <SafeAreaView style={medicalAlertDetailStyles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#E53E3E" />
        <View style={medicalAlertDetailStyles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#E53E3E" />
          <Text style={medicalAlertDetailStyles.errorText}>Alert not found</Text>
          <TouchableOpacity
            style={medicalAlertDetailStyles.backButton}
            onPress={() => router.back()}
          >
            <Text style={medicalAlertDetailStyles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const medicalInfo = getMedicalExplanation(alert.readingType, alert.severity, alert.value);

  return (
    <SafeAreaView style={medicalAlertDetailStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E53E3E" />
      
      {/* Header */}
      <LinearGradient
        colors={['#E53E3E', '#DC2626']}
        style={medicalAlertDetailStyles.header}
      >
        <TouchableOpacity
          style={medicalAlertDetailStyles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={medicalAlertDetailStyles.headerTitle}>Alert Details</Text>
        <TouchableOpacity
          style={medicalAlertDetailStyles.headerButton}
          onPress={handleContactPatient}
        >
          <Ionicons name="chatbubble-ellipses" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={medicalAlertDetailStyles.content} showsVerticalScrollIndicator={false}>
        {/* Alert Overview */}
        <View style={medicalAlertDetailStyles.overviewCard}>
          <View style={medicalAlertDetailStyles.patientHeader}>
            <View style={[
              medicalAlertDetailStyles.severityBadge,
              { backgroundColor: getSeverityColor(alert.severity) }
            ]}>
              <Ionicons 
                name={getSeverityIcon(alert.severity)} 
                size={20} 
                color="white" 
              />
            </View>
            <View style={medicalAlertDetailStyles.patientInfo}>
              <Text style={medicalAlertDetailStyles.patientName}>{alert.patientName}</Text>
              <View style={medicalAlertDetailStyles.readingInfo}>
                <Ionicons 
                  name={getReadingTypeIcon(alert.readingType)} 
                  size={16} 
                  color="#666" 
                />
                <Text style={medicalAlertDetailStyles.readingType}>
                  {alert.readingType.replace('_', ' ')} reading
                </Text>
              </View>
            </View>
            <View style={[
              medicalAlertDetailStyles.severityLabel,
              { backgroundColor: getSeverityColor(alert.severity) }
            ]}>
              <Text style={medicalAlertDetailStyles.severityLabelText}>
                {alert.severity.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={medicalAlertDetailStyles.timestamp}>
            {formatTimestamp(alert.timestamp)}
          </Text>

          <View style={medicalAlertDetailStyles.valueSection}>
            <Text style={medicalAlertDetailStyles.valueLabel}>Reading Value:</Text>
            <Text style={[
              medicalAlertDetailStyles.value,
              { color: getSeverityColor(alert.severity) }
            ]}>
              {alert.value}
            </Text>
            <Text style={medicalAlertDetailStyles.normalRange}>
              Normal range: {alert.normalRange}
            </Text>
          </View>

          {alert.context && (
            <View style={medicalAlertDetailStyles.contextSection}>
              <Text style={medicalAlertDetailStyles.contextLabel}>Context:</Text>
              <Text style={medicalAlertDetailStyles.contextValue}>{alert.context}</Text>
            </View>
          )}

          {alert.notes && (
            <View style={medicalAlertDetailStyles.notesSection}>
              <Text style={medicalAlertDetailStyles.notesLabel}>Notes:</Text>
              <Text style={medicalAlertDetailStyles.notesValue}>{alert.notes}</Text>
            </View>
          )}
        </View>

        {/* Medical Explanation */}
        <View style={medicalAlertDetailStyles.medicalCard}>
          <Text style={medicalAlertDetailStyles.medicalTitle}>{medicalInfo.title}</Text>
          <Text style={medicalAlertDetailStyles.medicalExplanation}>
            {medicalInfo.explanation}
          </Text>

          <View style={medicalAlertDetailStyles.actionsSection}>
            <Text style={medicalAlertDetailStyles.actionsTitle}>Immediate Actions:</Text>
            {medicalInfo.immediateActions.map((action, index) => (
              <View key={index} style={medicalAlertDetailStyles.actionItem}>
                <Text style={medicalAlertDetailStyles.actionBullet}>•</Text>
                <Text style={medicalAlertDetailStyles.actionText}>{action}</Text>
              </View>
            ))}
          </View>

          <View style={medicalAlertDetailStyles.riskSection}>
            <Text style={medicalAlertDetailStyles.riskTitle}>Risk Factors:</Text>
            <Text style={medicalAlertDetailStyles.riskText}>{medicalInfo.riskFactors}</Text>
          </View>

          <View style={medicalAlertDetailStyles.followUpSection}>
            <Text style={medicalAlertDetailStyles.followUpTitle}>Follow-up:</Text>
            <Text style={medicalAlertDetailStyles.followUpText}>{medicalInfo.followUp}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={medicalAlertDetailStyles.actionButtons}>
          <TouchableOpacity
            style={medicalAlertDetailStyles.contactButton}
            onPress={handleContactPatient}
          >
            <LinearGradient
              colors={['#3B82F6', '#1D4ED8']}
              style={medicalAlertDetailStyles.buttonGradient}
            >
              <Ionicons name="call" size={20} color="white" />
              <Text style={medicalAlertDetailStyles.buttonText}>Contact Patient</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={medicalAlertDetailStyles.acknowledgeButton}
            onPress={() => {
              Alert.alert('Alert Acknowledged', 'This alert has been acknowledged.');
              router.back();
            }}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={medicalAlertDetailStyles.buttonGradient}
            >
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={medicalAlertDetailStyles.buttonText}>Acknowledge Alert</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={medicalAlertDetailStyles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}
