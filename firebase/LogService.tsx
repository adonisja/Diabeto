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