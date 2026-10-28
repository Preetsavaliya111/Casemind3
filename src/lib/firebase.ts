import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  onSnapshot, 
  query, 
  limit 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Incident, UserProfile, AuditLogEntry, UserRole } from '../types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Must pass firebaseConfig.firestoreDatabaseId as per skill guidelines
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on Boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network unavailable.');
    }
    return false;
  }
}

// Google Sign-In Popup
export async function signInWithGoogle(): Promise<UserProfile | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    
    // Auto-derive initial profile
    const profile: UserProfile = {
      id: fbUser.uid,
      name: fbUser.displayName || 'Google Operator',
      email: fbUser.email || 'operator@casemind.internal',
      avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.uid}`,
      role: (fbUser.email === 'preetsavaliya077@gmail.com') ? 'ADMIN' : 'AGENT',
      team: 'Core Reliability Eng',
      activeSince: 'Just now',
    };

    // Sync to Firestore
    await syncUserProfile(profile);
    return profile;
  } catch (error) {
    console.error('Google Sign-in failed:', error);
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  await fbSignOut(auth);
}

// Sync user profile in Firestore
export async function syncUserProfile(profile: UserProfile): Promise<void> {
  const userDocPath = `users/${profile.id}`;
  try {
    await setDoc(doc(db, 'users', profile.id), profile, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, userDocPath);
  }
}

// Save or Update an Incident in Firestore
export async function saveIncidentToFirestore(incident: Incident): Promise<void> {
  const path = `incidents/${incident.id}`;
  try {
    await setDoc(doc(db, 'incidents', incident.id), incident, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Log an Audit Entry in Firestore
export async function logAuditToFirestore(entry: AuditLogEntry): Promise<void> {
  const path = `auditLogs/${entry.id}`;
  try {
    await setDoc(doc(db, 'auditLogs', entry.id), entry);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Subscribe to real-time incidents from Firestore with callback
export function subscribeToIncidents(
  onUpdate: (incidents: Incident[]) => void,
  onError?: (error: Error) => void
): () => void {
  const path = 'incidents';
  try {
    const q = query(collection(db, path), limit(50));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const incidents: Incident[] = [];
        snapshot.forEach((docSnap) => {
          incidents.push(docSnap.data() as Incident);
        });
        if (incidents.length > 0) {
          onUpdate(incidents);
        }
      },
      (error) => {
        console.warn('Incident subscription note:', error.message);
        if (onError) onError(error);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Failed to attach snapshot listener:', err);
    return () => {};
  }
}
