// firebase.ts - Complete Firebase Setup for FocusFlow
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase Configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Fallback configuration for development (using your actual values)
const fallbackConfig = {
  apiKey: "AIzaSyBX5ezCWOWAzG_7_mNWW97mOrzhvrHLbMo",
  authDomain: "procastination-599b5.firebaseapp.com",
  databaseURL: "https://procastination-599b5-default-rtdb.firebaseio.com",
  projectId: "procastination-599b5",
  storageBucket: "procastination-599b5.firebasestorage.app",
  messagingSenderId: "1040433879171",
  appId: "1:1040433879171:web:db26dc4424832329e263b6",
  measurementId: "G-HM6NRPKZZM"
};

// Use environment variables if available, otherwise use fallback
const config = firebaseConfig.apiKey ? firebaseConfig : fallbackConfig;

console.log('🔥 Firebase Configuration loaded:', {
  projectId: config.projectId,
  authDomain: config.authDomain,
  environment: firebaseConfig.apiKey ? 'Environment Variables' : 'Fallback Config'
});

// Initialize Firebase
const app = initializeApp(config);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Connection Test Function
export const testFirebaseConnection = async (): Promise<boolean> => {
  try {
    console.log('🔥 Testing Firebase connection...');
    console.log('📊 Project ID:', config.projectId);
    console.log('🗄️ Database URL:', config.databaseURL);
    console.log('🔐 Auth Domain:', config.authDomain);
    
    // Test Firestore connection
    const testRef = doc(db, 'system', 'connection-test');
    await setDoc(testRef, {
      timestamp: new Date(),
      status: 'connected',
      message: 'FocusFlow Firebase connection successful!',
      projectId: config.projectId,
      version: '1.0.0'
    });
    
    const testDoc = await getDoc(testRef);
    
    if (testDoc.exists()) {
      const data = testDoc.data();
      console.log('✅ Firebase connected successfully!');
      console.log('📄 Test document data:', data);
      console.log('🎉 FocusFlow is ready to rock!');
      return true;
    } else {
      console.error('❌ Firebase connection failed: Document not found');
      return false;
    }
  } catch (error) {
    console.error('❌ Firebase connection error:', error);
    console.log('💡 Check your Firebase configuration and internet connection');
    return false;
  }
};

// Initialize connection test on import
testFirebaseConnection();

// Export app as default
export default app;

// Database Types for TypeScript
export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  fieldOfStudy: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isPremium: boolean;
  subscriptionType?: 'monthly' | 'yearly';
  subscriptionEndDate?: Date;
}

export interface LoginLog {
  id: string;
  userId: string;
  loginTimestamp: Date;
  ipAddress?: string;
  deviceInfo?: string;
  browserInfo?: string;
  location?: string;
  sessionDuration?: number;
}

export interface UserAnalytics {
  userId: string;
  totalLogins: number;
  totalStudyTime: number;
  sessionsCompleted: number;
  streakDays: number;
  toolsUsed: Record<string, number>;
  lastActive: Date;
  preferredStudyTimes: number[];
  mostUsedFeatures: string[];
}

export interface ToolUsage {
  id: string;
  userId: string;
  toolName: string;
  toolCategory: string;
  usageTimestamp: Date;
  sessionDuration: number;
  dataProcessed?: any;
}
