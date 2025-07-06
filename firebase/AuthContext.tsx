// firebase/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, getDoc, setDoc, collection } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import NotificationService from './NotificationService';
import { logAction } from './LogService';

// Define the shape of your user profile data
export interface UserProfile {
  uid: string;
  email: string;
  username?: string; // Added username field
  role: 'patient' | 'caretaker' | 'doctor' | 'admin' | 'unverified';
  profileCompleted: boolean;
  // Add other profile fields here (e.g., firstName, lastName, etc.)
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  address?: string;
  phone?: string;
  // Prescribed insulin dosages (set by doctor for patients)
  prescribedShortActingDosage?: number;
  prescribedLongActingDosage?: number;
  prescribingDoctorId?: string; // Doctor who prescribed the dosages
  dosageUpdatedAt?: any; // When dosages were last updated
  // Added for consistent rule checks and initial profile creation
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

// Define the shape of your AuthContext value
interface AuthContextType {
  user: FirebaseUser | null | undefined; // undefined initially, null if not logged in, object if logged in
  userProfile: UserProfile | null | undefined; // undefined initially, null if no profile, object if profile exists
  loading: boolean; // Is Firebase auth state loading?
  loadingProfile: boolean; // Is user profile data loading?
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider Component
interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null | undefined>(undefined);
  const [userProfile, setUserProfile] = useState<UserProfile | null | undefined>(undefined);
  const [loading, setLoading] = useState(true); // True initially, becomes false after first auth state check
  const [loadingProfile, setLoadingProfile] = useState(true); // True initially, becomes false after profile loaded/checked

  // Get the app ID from environment variables
  const FIREBASE_APP_ID = process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'default-app-id';

  useEffect(() => {
    // 1. Listen to Firebase Auth State Changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser); // Update the user state
      setLoading(false); // Auth state is now known

      // Log authentication state changes
      if (firebaseUser) {
        await logAction(
          firebaseUser.uid,
          firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Unknown',
          firebaseUser.email || '',
          'unverified', // Will be updated when profile loads
          'AUTH_STATE_SIGNED_IN',
          'success',
          {
            authProvider: firebaseUser.providerData[0]?.providerId || 'unknown',
            timestamp: new Date().toISOString(),
            sessionStart: true
          }
        );
      } else {
        // Log sign out - we'll need to get user info from previous state if available
        console.log('User signed out - auth state changed to null');
      }

      if (firebaseUser) {
        // 2. Fetch User Profile if User is Logged In
        setLoadingProfile(true); // Start loading profile

        // Construct the correct path: artifacts/{appId}/users/{userId}
        // Corrected Firestore pathing for a document within a subcollection
const userDocRef = doc(db, 'artifacts', FIREBASE_APP_ID, 'users', firebaseUser.uid);

        const unsubscribeProfile = onSnapshot(userDocRef, async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            // Ensure UID and email from Firebase Auth are always available in userProfile
            const profileData = {
              ...data,
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
            };
            setUserProfile(profileData);
            
            // Log profile load success
            await logAction(
              firebaseUser.uid,
              profileData.username || profileData.email?.split('@')[0] || 'Unknown',
              profileData.email,
              profileData.role,
              'PROFILE_LOADED',
              'success',
              {
                profileCompleted: profileData.profileCompleted,
                role: profileData.role,
                hasUsername: !!profileData.username,
                timestamp: new Date().toISOString()
              }
            );
            
            // Initialize notification service for caretakers
            if (profileData.role === 'caretaker') {
              NotificationService.initialize(firebaseUser.uid, profileData.role)
                .then(async (success) => {
                  if (success) {
                    console.log('Notification service initialized for caretaker');
                    await logAction(
                      firebaseUser.uid,
                      profileData.username || profileData.email?.split('@')[0] || 'Unknown',
                      profileData.email,
                      profileData.role,
                      'NOTIFICATION_SERVICE_INITIALIZED',
                      'success',
                      {
                        role: profileData.role,
                        timestamp: new Date().toISOString()
                      }
                    );
                  }
                })
                .catch(async (error) => {
                  console.error('Error initializing notification service:', error);
                  await logAction(
                    firebaseUser.uid,
                    profileData.username || profileData.email?.split('@')[0] || 'Unknown',
                    profileData.email,
                    profileData.role,
                    'NOTIFICATION_SERVICE_INIT_FAILED',
                    'failure',
                    {
                      error: error.message,
                      role: profileData.role,
                      timestamp: new Date().toISOString()
                    }
                  );
                });
            }
          } else {
            // If no profile document, create a basic one immediately
            // This is for newly registered users who don't have a profile yet
            const defaultProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              role: 'unverified', // Default role for new users
              profileCompleted: false, // Mark as incomplete
              createdAt: new Date(), // Set a client-side date for creation
              updatedAt: new Date(), // Will be updated by serverTimestamp on subsequent updates
            };
            setDoc(userDocRef, defaultProfile) // Use userDocRef
              .then(async () => {
                console.log('Default user profile created for new user:', firebaseUser.uid);
                setUserProfile(defaultProfile); // Set state with the default profile
                
                // Log new profile creation
                await logAction(
                  firebaseUser.uid,
                  firebaseUser.email?.split('@')[0] || 'Unknown',
                  firebaseUser.email || '',
                  'unverified',
                  'PROFILE_CREATED',
                  'success',
                  {
                    isNewUser: true,
                    authProvider: firebaseUser.providerData[0]?.providerId || 'unknown',
                    timestamp: new Date().toISOString()
                  }
                );
              })
              .catch(async (error) => {
                console.error('Error creating default user profile:', error);
                // Even on error, set a basic profile to avoid infinite loading if profile can't be created
                setUserProfile(defaultProfile);
                
                // Log profile creation failure
                await logAction(
                  firebaseUser.uid,
                  firebaseUser.email?.split('@')[0] || 'Unknown',
                  firebaseUser.email || '',
                  'unverified',
                  'PROFILE_CREATION_FAILED',
                  'failure',
                  {
                    error: error.message,
                    isNewUser: true,
                    timestamp: new Date().toISOString()
                  }
                );
              });
          }
          setLoadingProfile(false); // Profile loading finished
        }, (error) => {
          console.error("Error fetching user profile:", error);
          setUserProfile(null); // Set to null on error
          setLoadingProfile(false);
          // Potentially alert the user or log this error more visibly
        });

        // Cleanup profile listener when user logs out or component unmounts
        return () => unsubscribeProfile();
      } else {
        // If user logs out, clear profile data
        setUserProfile(null);
        setLoadingProfile(false); // No profile to load if no user
      }
    });

    // Cleanup auth listener on component unmount
    return () => unsubscribeAuth();
  }, [FIREBASE_APP_ID]); // Add FIREBASE_APP_ID as dependency in case it changes
    // It's unlikely to change at runtime, but good practice if it's dynamic.

  // 3. Provide Context Value:
  // This object is passed down to all consumers of the AuthContext.
  const contextValue = { user, userProfile, loading, loadingProfile };

  // 4. Render Children:
  // All components wrapped by `AuthProvider` will have access to `contextValue`.
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}