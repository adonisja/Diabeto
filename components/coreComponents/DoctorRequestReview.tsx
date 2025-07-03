// components/coreComponents/DoctorRequestReview.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
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
import doctorRequestReviewStyles from '../../assets/styles/componentStyles/doctorRequestReviewStyles';

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
            <View style={doctorRequestReviewStyles.loadingContainer}>
                <ActivityIndicator size="large" color="#8B0000" />
                <Text style={doctorRequestReviewStyles.loadingText}>Loading doctor requests...</Text>
            </View>
        );
    }

    return (
        <LinearGradient
            colors={['#8B0000', '#DC143C', '#FF6347']}
            style={doctorRequestReviewStyles.container}
        >
            <ScrollView contentContainerStyle={doctorRequestReviewStyles.scrollContainer}>
                <View style={doctorRequestReviewStyles.headerContainer}>
                    <Ionicons name="medical" size={40} color="#fff" />
                    <Text style={doctorRequestReviewStyles.title}>Doctor Verification Requests</Text>
                    <Text style={doctorRequestReviewStyles.subtitle}>
                        Review and approve medical credential submissions
                    </Text>
                </View>

                {requests.length === 0 ? (
                    <View style={doctorRequestReviewStyles.emptyContainer}>
                        <Ionicons name="checkmark-circle" size={60} color="rgba(255,255,255,0.5)" />
                        <Text style={doctorRequestReviewStyles.emptyText}>No pending doctor requests</Text>
                        <Text style={doctorRequestReviewStyles.emptySubtext}>
                            All credential verification requests have been processed
                        </Text>
                    </View>
                ) : (
                    requests.map((request) => (
                        <View key={request.id} style={doctorRequestReviewStyles.requestCard}>
                            <View style={doctorRequestReviewStyles.requestHeader}>
                                <Text style={doctorRequestReviewStyles.requestTitle}>
                                    {request.userName}
                                </Text>
                                <View style={doctorRequestReviewStyles.statusBadge}>
                                    <Text style={doctorRequestReviewStyles.statusText}>PENDING</Text>
                                </View>
                            </View>

                            <View style={doctorRequestReviewStyles.requestInfo}>
                                <Text style={doctorRequestReviewStyles.infoLabel}>Email:</Text>
                                <Text style={doctorRequestReviewStyles.infoValue}>{request.userEmail}</Text>
                            </View>

                            <View style={doctorRequestReviewStyles.requestInfo}>
                                <Text style={doctorRequestReviewStyles.infoLabel}>Medical License:</Text>
                                <Text style={doctorRequestReviewStyles.infoValue}>{request.medicalLicenseNumber}</Text>
                            </View>

                            <View style={doctorRequestReviewStyles.requestInfo}>
                                <Text style={doctorRequestReviewStyles.infoLabel}>Medical School:</Text>
                                <Text style={doctorRequestReviewStyles.infoValue}>{request.medicalSchool}</Text>
                            </View>

                            <View style={doctorRequestReviewStyles.requestInfo}>
                                <Text style={doctorRequestReviewStyles.infoLabel}>Graduation Year:</Text>
                                <Text style={doctorRequestReviewStyles.infoValue}>{request.graduationYear}</Text>
                            </View>

                            <View style={doctorRequestReviewStyles.requestInfo}>
                                <Text style={doctorRequestReviewStyles.infoLabel}>Experience:</Text>
                                <Text style={doctorRequestReviewStyles.infoValue}>{request.yearsExperience} years</Text>
                            </View>

                            {request.specialization && (
                                <View style={doctorRequestReviewStyles.requestInfo}>
                                    <Text style={doctorRequestReviewStyles.infoLabel}>Specialization:</Text>
                                    <Text style={doctorRequestReviewStyles.infoValue}>{request.specialization}</Text>
                                </View>
                            )}

                            {request.hospitalAffiliation && (
                                <View style={doctorRequestReviewStyles.requestInfo}>
                                    <Text style={doctorRequestReviewStyles.infoLabel}>Hospital/Clinic:</Text>
                                    <Text style={doctorRequestReviewStyles.infoValue}>{request.hospitalAffiliation}</Text>
                                </View>
                            )}

                            {request.additionalInfo && (
                                <View style={doctorRequestReviewStyles.requestInfo}>
                                    <Text style={doctorRequestReviewStyles.infoLabel}>Additional Info:</Text>
                                    <Text style={doctorRequestReviewStyles.infoValue}>{request.additionalInfo}</Text>
                                </View>
                            )}

                            <View style={doctorRequestReviewStyles.reviewSection}>
                                <Text style={doctorRequestReviewStyles.reviewLabel}>Review Notes (Optional):</Text>
                                <TextInput
                                    style={doctorRequestReviewStyles.reviewInput}
                                    placeholder="Add notes about your review decision..."
                                    placeholderTextColor="rgba(255,255,255,0.7)"
                                    value={reviewNotes[request.id] || ''}
                                    onChangeText={(text) => updateReviewNotes(request.id, text)}
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                />
                            </View>

                            <View style={doctorRequestReviewStyles.actionButtons}>
                                <TouchableOpacity
                                    style={[doctorRequestReviewStyles.actionButton, doctorRequestReviewStyles.approveButton, 
                                           processingId === request.id && doctorRequestReviewStyles.actionButtonDisabled]}
                                    onPress={() => handleReviewRequest(request.id, 'approved')}
                                    disabled={processingId === request.id}
                                >
                                    {processingId === request.id ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <>
                                            <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                            <Text style={doctorRequestReviewStyles.actionButtonText}>Approve</Text>
                                        </>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[doctorRequestReviewStyles.actionButton, doctorRequestReviewStyles.rejectButton,
                                           processingId === request.id && doctorRequestReviewStyles.actionButtonDisabled]}
                                    onPress={() => handleReviewRequest(request.id, 'rejected')}
                                    disabled={processingId === request.id}
                                >
                                    {processingId === request.id ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <>
                                            <Ionicons name="close-circle" size={20} color="#fff" />
                                            <Text style={doctorRequestReviewStyles.actionButtonText}>Reject</Text>
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


