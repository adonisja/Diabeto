// components/coreComponents/DoctorRequestReview.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ActivityIndicator,
    TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../firebase/AuthContext';
import { db } from '@/firebase/firebaseConfig';
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    doc, 
    updateDoc, 
    serverTimestamp,
    orderBy 
} from 'firebase/firestore';
import { logAction } from '../../firebase/LogService';
import { Ionicons } from '@expo/vector-icons';

interface DoctorRequest {
    id: string;
    userId: string;
    userEmail: string;
    userName: string;
    currentRole: string;
    requestedRole: string;
    medicalLicenseNumber: string;
    medicalSchool: string;
    graduationYear: string;
    specialization?: string;
    hospitalAffiliation?: string;
    yearsExperience: number;
    additionalInfo?: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: any;
    reviewedAt?: any;
    reviewedBy?: string;
    reviewNotes?: string;
}

export default function DoctorRequestReview() {
    const { user, userProfile } = useAuth();
    const [requests, setRequests] = useState<DoctorRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [reviewNotes, setReviewNotes] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        fetchDoctorRequests();
    }, []);

    const fetchDoctorRequests = async () => {
        try {
            const requestsRef = collection(
                db, 
                `artifacts/${process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'default-app-id'}/doctorRequests`
            );
            
            // Query for pending requests, ordered by submission date
            const q = query(
                requestsRef,
                where('status', '==', 'pending'),
                orderBy('submittedAt', 'desc')
            );
            
            const querySnapshot = await getDocs(q);
            const requestsList: DoctorRequest[] = [];
            
            querySnapshot.forEach((doc) => {
                requestsList.push({ 
                    id: doc.id, 
                    ...doc.data() 
                } as DoctorRequest);
            });
            
            setRequests(requestsList);
        } catch (error) {
            console.error('Error fetching doctor requests:', error);
            Alert.alert('Error', 'Failed to load doctor requests');
        } finally {
            setLoading(false);
        }
    };

    const handleReviewRequest = async (requestId: string, decision: 'approved' | 'rejected') => {
        const request = requests.find(r => r.id === requestId);
        if (!request) return;

        setProcessingId(requestId);

        try {
            const notes = reviewNotes[requestId] || '';
            
            // Update the doctor request status
            const requestDocRef = doc(
                db, 
                `artifacts/${process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'default-app-id'}/doctorRequests`,
                requestId
            );
            
            await updateDoc(requestDocRef, {
                status: decision,
                reviewedAt: serverTimestamp(),
                reviewedBy: user?.uid,
                reviewNotes: notes,
                updatedAt: serverTimestamp()
            });

            // If approved, update the user's role to doctor
            if (decision === 'approved') {
                const userDocRef = doc(
                    collection(db, `artifacts/${process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'default-app-id'}/users`),
                    request.userId
                );
                
                await updateDoc(userDocRef, {
                    role: 'doctor',
                    roleUpgradedFrom: 'caretaker',
                    roleUpgradedAt: serverTimestamp(),
                    roleUpgradedBy: user?.uid,
                    updatedAt: serverTimestamp()
                });
            }

            // Log the review action
            await logAction(
                user?.uid ?? 'unknown-admin',
                userProfile?.username ?? user?.email?.split('@')[0] ?? 'unknown-admin',
                user?.email ?? 'unknown-email',
                'admin',
                `DOCTOR_REQUEST_${decision.toUpperCase()}`,
                'success',
                {
                    requestId: requestId,
                    targetUserId: request.userId,
                    targetUserEmail: request.userEmail,
                    decision: decision,
                    reviewNotes: notes,
                    medicalLicenseNumber: request.medicalLicenseNumber,
                    timestamp: new Date().toISOString()
                }
            );

            Alert.alert(
                'Request Processed',
                `Doctor verification request has been ${decision}. ${decision === 'approved' ? 'User role has been updated to Doctor.' : 'User will be notified of the decision.'}`
            );

            // Refresh the requests list
            fetchDoctorRequests();

        } catch (error: any) {
            console.error('Error processing doctor request:', error);
            Alert.alert('Error', `Failed to process request: ${error.message}`);

            // Log the failed review
            await logAction(
                user?.uid ?? 'unknown-admin',
                userProfile?.username ?? user?.email?.split('@')[0] ?? 'unknown-admin',
                user?.email ?? 'unknown-email',
                'admin',
                'DOCTOR_REQUEST_REVIEW_FAILED',
                'failure',
                {
                    requestId: requestId,
                    decision: decision,
                    error: error.message,
                    timestamp: new Date().toISOString()
                }
            );
        } finally {
            setProcessingId(null);
        }
    };

    const updateReviewNotes = (requestId: string, notes: string) => {
        setReviewNotes(prev => ({
            ...prev,
            [requestId]: notes
        }));
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8B0000" />
                <Text style={styles.loadingText}>Loading doctor requests...</Text>
            </View>
        );
    }

    return (
        <LinearGradient
            colors={['#8B0000', '#DC143C', '#FF6347']}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.headerContainer}>
                    <Ionicons name="medical" size={40} color="#fff" />
                    <Text style={styles.title}>Doctor Verification Requests</Text>
                    <Text style={styles.subtitle}>
                        Review and approve medical credential submissions
                    </Text>
                </View>

                {requests.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="checkmark-circle" size={60} color="rgba(255,255,255,0.5)" />
                        <Text style={styles.emptyText}>No pending doctor requests</Text>
                        <Text style={styles.emptySubtext}>
                            All credential verification requests have been processed
                        </Text>
                    </View>
                ) : (
                    requests.map((request) => (
                        <View key={request.id} style={styles.requestCard}>
                            <View style={styles.requestHeader}>
                                <Text style={styles.requestTitle}>
                                    {request.userName}
                                </Text>
                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusText}>PENDING</Text>
                                </View>
                            </View>

                            <View style={styles.requestInfo}>
                                <Text style={styles.infoLabel}>Email:</Text>
                                <Text style={styles.infoValue}>{request.userEmail}</Text>
                            </View>

                            <View style={styles.requestInfo}>
                                <Text style={styles.infoLabel}>Medical License:</Text>
                                <Text style={styles.infoValue}>{request.medicalLicenseNumber}</Text>
                            </View>

                            <View style={styles.requestInfo}>
                                <Text style={styles.infoLabel}>Medical School:</Text>
                                <Text style={styles.infoValue}>{request.medicalSchool}</Text>
                            </View>

                            <View style={styles.requestInfo}>
                                <Text style={styles.infoLabel}>Graduation Year:</Text>
                                <Text style={styles.infoValue}>{request.graduationYear}</Text>
                            </View>

                            <View style={styles.requestInfo}>
                                <Text style={styles.infoLabel}>Experience:</Text>
                                <Text style={styles.infoValue}>{request.yearsExperience} years</Text>
                            </View>

                            {request.specialization && (
                                <View style={styles.requestInfo}>
                                    <Text style={styles.infoLabel}>Specialization:</Text>
                                    <Text style={styles.infoValue}>{request.specialization}</Text>
                                </View>
                            )}

                            {request.hospitalAffiliation && (
                                <View style={styles.requestInfo}>
                                    <Text style={styles.infoLabel}>Hospital/Clinic:</Text>
                                    <Text style={styles.infoValue}>{request.hospitalAffiliation}</Text>
                                </View>
                            )}

                            {request.additionalInfo && (
                                <View style={styles.requestInfo}>
                                    <Text style={styles.infoLabel}>Additional Info:</Text>
                                    <Text style={styles.infoValue}>{request.additionalInfo}</Text>
                                </View>
                            )}

                            <View style={styles.reviewSection}>
                                <Text style={styles.reviewLabel}>Review Notes (Optional):</Text>
                                <TextInput
                                    style={styles.reviewInput}
                                    placeholder="Add notes about your review decision..."
                                    placeholderTextColor="rgba(255,255,255,0.7)"
                                    value={reviewNotes[request.id] || ''}
                                    onChangeText={(text) => updateReviewNotes(request.id, text)}
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                />
                            </View>

                            <View style={styles.actionButtons}>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.approveButton, 
                                           processingId === request.id && styles.actionButtonDisabled]}
                                    onPress={() => handleReviewRequest(request.id, 'approved')}
                                    disabled={processingId === request.id}
                                >
                                    {processingId === request.id ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <>
                                            <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                            <Text style={styles.actionButtonText}>Approve</Text>
                                        </>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionButton, styles.rejectButton,
                                           processingId === request.id && styles.actionButtonDisabled]}
                                    onPress={() => handleReviewRequest(request.id, 'rejected')}
                                    disabled={processingId === request.id}
                                >
                                    {processingId === request.id ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <>
                                            <Ionicons name="close-circle" size={20} color="#fff" />
                                            <Text style={styles.actionButtonText}>Reject</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 30,
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginTop: 10,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginTop: 5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.8)',
        marginTop: 20,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        marginTop: 10,
    },
    requestCard: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    requestHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    requestTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
    },
    statusBadge: {
        backgroundColor: '#FFA500',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    requestInfo: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: 'bold',
        width: 120,
    },
    infoValue: {
        fontSize: 14,
        color: '#fff',
        flex: 1,
        flexWrap: 'wrap',
    },
    reviewSection: {
        marginTop: 20,
        marginBottom: 20,
    },
    reviewLabel: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    reviewInput: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: 10,
        padding: 15,
        color: '#fff',
        fontSize: 14,
        height: 80,
        textAlignVertical: 'top',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        minWidth: 120,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    actionButtonDisabled: {
        opacity: 0.6,
    },
    approveButton: {
        backgroundColor: '#32CD32',
    },
    rejectButton: {
        backgroundColor: '#FF6347',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});
