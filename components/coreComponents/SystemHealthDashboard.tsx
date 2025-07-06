// components/coreComponents/SystemHealthDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../firebase/AuthContext';
import { 
    logSystemHealth, 
    generateAuditReport, 
    exportAuditData,
    verifyMedicalCompliance,
    detectAnomalies 
} from '../../firebase/LogService';

interface SystemMetrics {
    responseTime: number;
    memoryUsage: number;
    errorRate: number;
    activeUsers: number;
    lastUpdated: Date;
}

interface HealthStatus {
    status: 'excellent' | 'good' | 'warning' | 'critical';
    message: string;
    color: string[];
}

export default function SystemHealthDashboard() {
    const { user, userProfile } = useAuth();
    const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [healthStatus, setHealthStatus] = useState<HealthStatus>({
        status: 'good',
        message: 'System operating normally',
        color: ['#4caf50', '#81c784']
    });

    useEffect(() => {
        loadSystemMetrics();
        const interval = setInterval(loadSystemMetrics, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const loadSystemMetrics = async () => {
        try {
            setRefreshing(true);
            
            // Simulate system metrics collection
            const mockMetrics: SystemMetrics = {
                responseTime: Math.floor(Math.random() * 1000) + 200,
                memoryUsage: Math.random() * 0.8 + 0.1, // 10-90%
                errorRate: Math.random() * 0.02, // 0-2%
                activeUsers: Math.floor(Math.random() * 500) + 50,
                lastUpdated: new Date()
            };

            // Log system health
            await logSystemHealth(mockMetrics);

            setMetrics(mockMetrics);
            updateHealthStatus(mockMetrics);
            
        } catch (error) {
            console.error('Error loading system metrics:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const updateHealthStatus = (metrics: SystemMetrics) => {
        if (metrics.errorRate > 0.05 || metrics.responseTime > 5000) {
            setHealthStatus({
                status: 'critical',
                message: 'System performance issues detected',
                color: ['#f44336', '#ef5350']
            });
        } else if (metrics.errorRate > 0.02 || metrics.responseTime > 2000) {
            setHealthStatus({
                status: 'warning',
                message: 'System performance degraded',
                color: ['#ff9800', '#ffb74d']
            });
        } else if (metrics.responseTime < 500 && metrics.errorRate < 0.01) {
            setHealthStatus({
                status: 'excellent',
                message: 'System performing optimally',
                color: ['#4caf50', '#66bb6a']
            });
        } else {
            setHealthStatus({
                status: 'good',
                message: 'System operating normally',
                color: ['#2196f3', '#42a5f5']
            });
        }
    };

    const handleGenerateAuditReport = async () => {
        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 30); // Last 30 days

            const report = await generateAuditReport(startDate, endDate, userProfile?.role);
            
            Alert.alert(
                'Audit Report Generated',
                `Report ID: ${report.reportId}\\nPeriod: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
                [{ text: 'OK' }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to generate audit report');
        }
    };

    const handleExportData = async (format: 'json' | 'csv' | 'pdf') => {
        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 7); // Last 7 days

            const exportResult = await exportAuditData(startDate, endDate, format);
            
            Alert.alert(
                'Data Export Completed',
                `Export ID: ${exportResult.exportId}\\nRecords: ${exportResult.recordCount}\\nFormat: ${format.toUpperCase()}`,
                [{ text: 'OK' }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to export data');
        }
    };

    const handleRunCompliance = async () => {
        try {
            const result = await verifyMedicalCompliance(
                'SYSTEM_COMPLIANCE_CHECK',
                {
                    uid: user?.uid,
                    username: userProfile?.username,
                    email: user?.email,
                    role: userProfile?.role
                },
                ['HIPAA_COMPLIANCE', 'DATA_INTEGRITY', 'ACCESS_CONTROL']
            );

            Alert.alert(
                'Compliance Check Complete',
                `Status: ${result.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}\\nRules Checked: ${result.checkedRules.length}\\nViolations: ${result.violations.length}`,
                [{ text: 'OK' }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to run compliance check');
        }
    };

    const renderMetricCard = (title: string, value: string, subtitle: string, icon: string, color: string[]) => (
        <LinearGradient colors={color} style={styles.metricCard}>
            <View style={styles.metricHeader}>
                <Ionicons name={icon as any} size={24} color="#fff" />
                <Text style={styles.metricTitle}>{title}</Text>
            </View>
            <Text style={styles.metricValue}>{value}</Text>
            <Text style={styles.metricSubtitle}>{subtitle}</Text>
        </LinearGradient>
    );

    if (loading && !metrics) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196f3" />
                <Text style={styles.loadingText}>Loading system metrics...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* System Status Header */}
            <LinearGradient colors={healthStatus.color} style={styles.statusHeader}>
                <View style={styles.statusContent}>
                    <Ionicons 
                        name={healthStatus.status === 'excellent' ? 'checkmark-circle' : 
                              healthStatus.status === 'good' ? 'information-circle' :
                              healthStatus.status === 'warning' ? 'warning' : 'alert-circle'} 
                        size={32} 
                        color="#fff" 
                    />
                    <Text style={styles.statusTitle}>System Health: {healthStatus.status.toUpperCase()}</Text>
                    <Text style={styles.statusMessage}>{healthStatus.message}</Text>
                    <Text style={styles.lastUpdated}>
                        Last updated: {metrics?.lastUpdated.toLocaleTimeString()}
                    </Text>
                </View>
                <TouchableOpacity onPress={loadSystemMetrics} style={styles.refreshButton}>
                    <Ionicons name="refresh" size={24} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>

            {/* Metrics Grid */}
            <View style={styles.metricsGrid}>
                {renderMetricCard(
                    'Response Time',
                    `${metrics?.responseTime}ms`,
                    'Average response time',
                    'time-outline',
                    ['#2196f3', '#42a5f5']
                )}
                {renderMetricCard(
                    'Memory Usage',
                    `${((metrics?.memoryUsage || 0) * 100).toFixed(1)}%`,
                    'System memory usage',
                    'hardware-chip-outline',
                    ['#9c27b0', '#ba68c8']
                )}
                {renderMetricCard(
                    'Error Rate',
                    `${((metrics?.errorRate || 0) * 100).toFixed(2)}%`,
                    'System error rate',
                    'bug-outline',
                    ['#f44336', '#ef5350']
                )}
                {renderMetricCard(
                    'Active Users',
                    `${metrics?.activeUsers}`,
                    'Currently active users',
                    'people-outline',
                    ['#4caf50', '#66bb6a']
                )}
            </View>

            {/* Admin Actions */}
            <View style={styles.actionsContainer}>
                <Text style={styles.sectionTitle}>Administrative Actions</Text>
                
                <TouchableOpacity onPress={handleGenerateAuditReport} style={styles.actionButton}>
                    <LinearGradient colors={['#673ab7', '#9575cd']} style={styles.actionGradient}>
                        <Ionicons name="document-text-outline" size={24} color="#fff" />
                        <Text style={styles.actionText}>Generate Audit Report</Text>
                        <Ionicons name="chevron-forward" size={20} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>

                <View style={styles.exportRow}>
                    <TouchableOpacity onPress={() => handleExportData('json')} style={styles.exportButton}>
                        <LinearGradient colors={['#ff5722', '#ff8a65']} style={styles.exportGradient}>
                            <Text style={styles.exportText}>Export JSON</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => handleExportData('csv')} style={styles.exportButton}>
                        <LinearGradient colors={['#795548', '#a1887f']} style={styles.exportGradient}>
                            <Text style={styles.exportText}>Export CSV</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => handleExportData('pdf')} style={styles.exportButton}>
                        <LinearGradient colors={['#607d8b', '#90a4ae']} style={styles.exportGradient}>
                            <Text style={styles.exportText}>Export PDF</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={handleRunCompliance} style={styles.actionButton}>
                    <LinearGradient colors={['#ff9800', '#ffb74d']} style={styles.actionGradient}>
                        <Ionicons name="shield-checkmark-outline" size={24} color="#fff" />
                        <Text style={styles.actionText}>Run Compliance Check</Text>
                        <Ionicons name="chevron-forward" size={20} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        backgroundColor: '#f5f5f5'
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666'
    },
    statusHeader: {
        padding: 20,
        borderRadius: 15,
        margin: 15,
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const
    },
    statusContent: {
        flex: 1
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: 'bold' as const,
        color: '#fff',
        marginTop: 5
    },
    statusMessage: {
        fontSize: 14,
        color: '#fff',
        marginTop: 2,
        opacity: 0.9
    },
    lastUpdated: {
        fontSize: 12,
        color: '#fff',
        marginTop: 5,
        opacity: 0.8
    },
    refreshButton: {
        padding: 10
    },
    metricsGrid: {
        flexDirection: 'row' as const,
        flexWrap: 'wrap' as const,
        justifyContent: 'space-between' as const,
        paddingHorizontal: 15
    },
    metricCard: {
        width: '48%' as const,
        padding: 15,
        borderRadius: 12,
        marginBottom: 15
    },
    metricHeader: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        marginBottom: 10
    },
    metricTitle: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: '#fff',
        marginLeft: 8
    },
    metricValue: {
        fontSize: 24,
        fontWeight: 'bold' as const,
        color: '#fff',
        marginBottom: 5
    },
    metricSubtitle: {
        fontSize: 12,
        color: '#fff',
        opacity: 0.8
    },
    actionsContainer: {
        padding: 15
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold' as const,
        color: '#333',
        marginBottom: 15
    },
    actionButton: {
        marginBottom: 10
    },
    actionGradient: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
        padding: 15,
        borderRadius: 12
    },
    actionText: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: '#fff',
        flex: 1,
        marginLeft: 10
    },
    exportRow: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        marginBottom: 10
    },
    exportButton: {
        flex: 1,
        marginHorizontal: 2
    },
    exportGradient: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center' as const
    },
    exportText: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: '#fff'
    }
};
