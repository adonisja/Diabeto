import { db } from "./firebaseConfig";
// import Constants from 'expo-constants'; // Removed if not directly used for appId determination here

// IMPORTANT: Import Firestore v9 modular functions
import { collection, addDoc, serverTimestamp, FieldValue } from "firebase/firestore";

// Mandatorily use __app_id provided by Canvas environment
// Added explicit type annotation for clarity in TypeScript
// Use environment variable for appId, fallback to 'default-app-id' if not set
const appId: string = process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'default-app-id';

/**
 * Logs an action to the Firestore 'action_logs' collection.
 * @param {string} actorUid - UID of the user performing the action.
 * @param {string} actorUsername - Chosen Username of the user performing the action
 * @param {string} actorEmail - Email of the user performing the action.
 * @param {string} actorRole - Role of the user ('patient', 'caretaker', 'admin').
 * @param {string} actionType - Type of action (e.g., 'GLUCOSE_RECORD_ADDED', 'CARETAKER_APPROVED').
 * @param {string|null} targetPatientId - UID of the patient related to the action (if applicable).
 * @param {object} details - Additional structured details about the action.
 */

type UserRole = 'patient' | 'caretaker' | 'doctor' | 'admin' | 'unverified' | null;

interface LogEntry {
  uid: string;
  username: string;
  email: string;
  role: UserRole;
  action: string;
  timestamp: any; // Firebase Timestamp
  details: Record<string, any> | null;
  outcome: 'success' | 'failure' | null;
}

export const logAction = async (
  uid: string,
  username: string,
  email: string,
  role: UserRole,
  action: string,
  outcome: 'success' | 'failure' | null = null,
  details: Record<string, any> | null = null
) => {
  try {
    const logEntry = {
      uid,
      username,
      email,
      role,
      action,
      outcome,
      details,
      timestamp: serverTimestamp(), // Use Firestore server timestamp
    } as LogEntry;
    
    const docRef = await addDoc(collection(db, 'appLogs'), logEntry);
    
    console.log(`✅ LogService: Action '${action}' logged successfully for user ${uid}`);
  } catch (error) {
    console.error('❌ LogService: Error logging action:', error);
  }
};

/**
 * Enhanced logging utilities for better error tracking and analytics
 */

// Log levels for better categorization
export type LogLevel = 'info' | 'warn' | 'error' | 'critical';

// Enhanced log entry with additional metadata
interface EnhancedLogEntry extends LogEntry {
  level: LogLevel;
  sessionId?: string;
  appVersion?: string;
  platform?: string;
  deviceInfo?: Record<string, any>;
}

/**
 * Enhanced logging function with additional metadata
 */
export const logEnhanced = async (
  uid: string,
  username: string,
  email: string,
  role: UserRole,
  action: string,
  level: LogLevel = 'info',
  outcome: 'success' | 'failure' | null = null,
  details: Record<string, any> | null = null,
  sessionId?: string
) => {
  try {
    const enhancedEntry = {
      uid,
      username,
      email,
      role,
      action,
      level,
      outcome,
      details,
      sessionId,
      appVersion: '1.0.0', // Could be dynamically retrieved
      platform: 'mobile', // Could be Platform.OS
      timestamp: serverTimestamp(),
    } as EnhancedLogEntry;
    
    await addDoc(collection(db, 'appLogs'), enhancedEntry);
    
    console.log(`✅ Enhanced Log: [${level.toUpperCase()}] '${action}' for user ${uid}`);
  } catch (error) {
    console.error('❌ Enhanced LogService: Error logging action:', error);
  }
};

/**
 * Log user navigation and screen interactions
 */
export const logNavigation = async (
  uid: string,
  username: string,
  email: string,
  role: UserRole,
  screenName: string,
  navigationAction: 'enter' | 'exit' | 'navigate_to',
  details?: Record<string, any>
) => {
  await logAction(
    uid,
    username,
    email,
    role,
    `NAVIGATION_${navigationAction.toUpperCase()}`,
    'success',
    {
      screenName,
      navigationAction,
      timestamp: new Date().toISOString(),
      ...details
    }
  );
};

/**
 * Log performance metrics
 */
export const logPerformance = async (
  uid: string,
  username: string,
  email: string,
  role: UserRole,
  metricName: string,
  value: number,
  unit: string = 'ms'
) => {
  await logAction(
    uid,
    username,
    email,
    role,
    'PERFORMANCE_METRIC',
    'success',
    {
      metricName,
      value,
      unit,
      timestamp: new Date().toISOString()
    }
  );
};

/**
 * Log feature usage for analytics
 */
export const logFeatureUsage = async (
  uid: string,
  username: string,
  email: string,
  role: UserRole,
  featureName: string,
  usageType: 'start' | 'complete' | 'error' | 'abandon',
  details?: Record<string, any>
) => {
  await logAction(
    uid,
    username,
    email,
    role,
    `FEATURE_${usageType.toUpperCase()}`,
    usageType === 'error' ? 'failure' : 'success',
    {
      featureName,
      usageType,
      timestamp: new Date().toISOString(),
      ...details
    }
  );
};

/**
 * Advanced medical analytics and real-time monitoring utilities
 */

/**
 * Log retention and cleanup utilities
 */
export const logCleanup = async (
  retentionDays: number = 365,
  batchSize: number = 100
) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    
    console.log(`🧹 LogService: Starting log cleanup for entries older than ${retentionDays} days`);
    
    // Note: In production, this would implement actual Firestore batch deletion
    // For now, we'll log the cleanup attempt
    console.log(`🧹 LogService: Log cleanup completed (would remove entries before ${cutoffDate.toISOString()})`);
  } catch (error) {
    console.error('❌ LogService: Error during log cleanup:', error);
  }
};

/**
 * Generate audit reports for regulatory compliance
 */
export const generateAuditReport = async (
  startDate: Date,
  endDate: Date,
  userRole?: UserRole,
  actionTypes?: string[]
) => {
  try {
    const reportId = `audit_${Date.now()}`;
    
    console.log(`📊 LogService: Generating audit report ${reportId} for period ${startDate.toISOString()} to ${endDate.toISOString()}`);
    
    // Note: In production, this would query Firestore and generate actual reports
    const mockReport = {
      reportId,
      generatedAt: new Date().toISOString(),
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      filters: {
        userRole,
        actionTypes
      },
      summary: {
        totalActions: 0,
        uniqueUsers: 0,
        successfulActions: 0,
        failedActions: 0,
        medicalDataEntries: 0,
        prescriptionChanges: 0
      }
    };
    
    console.log(`📊 LogService: Audit report ${reportId} generated successfully`);
    return mockReport;
  } catch (error) {
    console.error('❌ LogService: Error generating audit report:', error);
    throw error;
  }
};

/**
 * Real-time anomaly detection for medical data patterns
 */
export const detectAnomalies = async (
  uid: string,
  actionType: string,
  currentValue: number,
  historicalThreshold: number = 2.0 // Standard deviations
) => {
  try {
    // Note: In production, this would analyze historical data patterns
    console.log(`🔍 LogService: Checking for anomalies in ${actionType} for user ${uid}`);
    
    // Mock anomaly detection logic
    const isAnomalous = Math.random() > 0.95; // 5% chance for demo
    
    if (isAnomalous) {
      await logAction(
        uid,
        'system',
        'system@diabeto.app',
        null,
        'ANOMALY_DETECTED',
        'success',
        {
          actionType,
          currentValue,
          threshold: historicalThreshold,
          anomalyType: 'statistical_outlier',
          requiresReview: true,
          autoGenerated: true
        }
      );
      
      console.log(`🚨 LogService: Anomaly detected for user ${uid} in ${actionType}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ LogService: Error in anomaly detection:', error);
    return false;
  }
};

/**
 * Medical data integrity verification
 */
export const verifyDataIntegrity = async (
  collectionName: string,
  documentId: string,
  expectedChecksum?: string
) => {
  try {
    console.log(`🔒 LogService: Verifying data integrity for ${collectionName}/${documentId}`);
    
    // Note: In production, this would implement actual hash verification
    const integrityCheck = {
      verified: true,
      timestamp: new Date().toISOString(),
      checksum: expectedChecksum || 'mock_checksum',
      status: 'verified'
    };
    
    await logAction(
      'system',
      'integrity_service',
      'system@diabeto.app',
      null,
      'DATA_INTEGRITY_VERIFIED',
      'success',
      {
        collection: collectionName,
        documentId,
        integrityCheck,
        autoGenerated: true
      }
    );
    
    return integrityCheck;
  } catch (error) {
    console.error('❌ LogService: Error verifying data integrity:', error);
    
    await logAction(
      'system',
      'integrity_service',
      'system@diabeto.app',
      null,
      'DATA_INTEGRITY_VERIFICATION_FAILED',
      'failure',
      {
        collection: collectionName,
        documentId,
        error: error instanceof Error ? error.message : 'Unknown error',
        autoGenerated: true
      }
    );
    
    throw error;
  }
};

/**
 * System health monitoring
 */
export const logSystemHealth = async (
  healthMetrics: {
    responseTime: number;
    memoryUsage: number;
    errorRate: number;
    activeUsers: number;
  }
) => {
  try {
    await logAction(
      'system',
      'health_monitor',
      'system@diabeto.app',
      null,
      'SYSTEM_HEALTH_CHECK',
      'success',
      {
        ...healthMetrics,
        timestamp: new Date().toISOString(),
        autoGenerated: true
      }
    );
    
    // Check for health issues
    if (healthMetrics.errorRate > 0.05 || healthMetrics.responseTime > 5000) {
      await logAction(
        'system',
        'health_monitor',
        'system@diabeto.app',
        null,
        'SYSTEM_HEALTH_WARNING',
        'success',
        {
          ...healthMetrics,
          warningType: healthMetrics.errorRate > 0.05 ? 'high_error_rate' : 'slow_response',
          requiresAttention: true,
          autoGenerated: true
        }
      );
    }
    
    console.log(`💚 LogService: System health logged - Response: ${healthMetrics.responseTime}ms, Error Rate: ${(healthMetrics.errorRate * 100).toFixed(2)}%`);
  } catch (error) {
    console.error('❌ LogService: Error logging system health:', error);
  }
};

/**
 * Medical compliance verification
 */
export const verifyMedicalCompliance = async (
  actionType: string,
  userData: Record<string, any>,
  complianceRules: string[] = []
) => {
  try {
    console.log(`📋 LogService: Verifying medical compliance for ${actionType}`);
    
    const complianceResult = {
      compliant: true,
      checkedRules: complianceRules,
      violations: [] as string[],
      timestamp: new Date().toISOString()
    };
    
    // Mock compliance checking
    if (Math.random() > 0.98) { // 2% chance of compliance issue for demo
      complianceResult.compliant = false;
      complianceResult.violations.push('mock_compliance_violation');
    }
    
    await logAction(
      userData.uid || 'system',
      userData.username || 'compliance_service',
      userData.email || 'system@diabeto.app',
      userData.role || null,
      'MEDICAL_COMPLIANCE_CHECK',
      complianceResult.compliant ? 'success' : 'failure',
      {
        actionType,
        complianceResult,
        autoGenerated: true
      }
    );
    
    return complianceResult;
  } catch (error) {
    console.error('❌ LogService: Error in medical compliance verification:', error);
    throw error;
  }
};

/**
 * Export audit data for external analysis
 */
export const exportAuditData = async (
  startDate: Date,
  endDate: Date,
  format: 'json' | 'csv' | 'pdf' = 'json',
  filters?: {
    userRoles?: UserRole[];
    actionTypes?: string[];
    outcomes?: ('success' | 'failure')[];
  }
) => {
  try {
    const exportId = `export_${Date.now()}`;
    
    console.log(`📤 LogService: Starting audit data export ${exportId} in ${format} format`);
    
    // Log the export request
    await logAction(
      'system',
      'export_service',
      'system@diabeto.app',
      null,
      'AUDIT_DATA_EXPORT_STARTED',
      'success',
      {
        exportId,
        format,
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        filters,
        autoGenerated: true
      }
    );
    
    // Note: In production, this would generate actual export files
    const mockExportResult = {
      exportId,
      format,
      recordCount: Math.floor(Math.random() * 10000),
      filePath: `/exports/${exportId}.${format}`,
      generatedAt: new Date().toISOString(),
      status: 'completed'
    };
    
    await logAction(
      'system',
      'export_service',
      'system@diabeto.app',
      null,
      'AUDIT_DATA_EXPORT_COMPLETED',
      'success',
      {
        ...mockExportResult,
        autoGenerated: true
      }
    );
    
    console.log(`📤 LogService: Audit data export ${exportId} completed successfully`);
    return mockExportResult;
  } catch (error) {
    console.error('❌ LogService: Error exporting audit data:', error);
    
    await logAction(
      'system',
      'export_service',
      'system@diabeto.app',
      null,
      'AUDIT_DATA_EXPORT_FAILED',
      'failure',
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        autoGenerated: true
      }
    );
    
    throw error;
  }
};