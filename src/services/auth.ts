import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut, 
  sendPasswordResetEmail,
  updatePassword,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, analytics } from '../lib/firebase';
import { logEvent } from 'firebase/analytics';
import toast from 'react-hot-toast';

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// ✅ Complete interfaces with all required properties
export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  fieldOfStudy: string;
  name?: string;        // Optional for backward compatibility
  field?: string;       // Optional for backward compatibility
  createdAt: Date;
  updatedAt: Date;
  isPremium: boolean;
  isAdmin?: boolean;
  lastLogin?: Date;
  avatarUrl?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  fullName: string;
  fieldOfStudy: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginLog {
  id: string;
  userId: string;
  loginTimestamp: Date;
  ipAddress: string;
  deviceInfo: string;
  browserInfo: string;
  location: string;
}

class AuthService {
  // Create Admin User (for initial setup)
  async createAdminUser() {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        'admin@temp.com', 
        'admin123'
      );
      
      const user = userCredential.user;
      
      // Create Firestore user document
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        email: 'admin@temp.com',
        username: 'admin',
        fullName: 'Admin User',
        name: 'Admin User', // Add for compatibility
        fieldOfStudy: 'Administration',
        field: 'Administration', // Add for compatibility
        createdAt: new Date(),
        updatedAt: new Date(),
        isPremium: false,
        isAdmin: true,
      });

      // Create analytics document
      await setDoc(doc(db, 'userAnalytics', user.uid), {
        userId: user.uid,
        totalLogins: 0,
        totalStudyTime: 0,
        sessionsCompleted: 0,
        streakDays: 0,
        toolsUsed: {},
        lastActive: new Date(),
        preferredStudyTimes: [],
        mostUsedFeatures: [],
      });

      toast.success('Admin user created successfully!');
      return user;
      
    } catch (error: any) {
      console.error('Error creating admin user:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        toast.success('Admin user already exists');
        return;
      } else {
        toast.error('Failed to create admin user');
      }
      throw error;
    }
  }

  // Register new user
  async register(data: RegisterData) {
    try {
      this.validateRegistrationData(data);

      const sanitizedUsername = this.sanitizeUsername(data.username);
      if (!sanitizedUsername) {
        throw new Error('Username contains invalid characters');
      }

      await this.checkUsernameAvailability(sanitizedUsername);

      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );

      if (!userCredential.user) {
        throw new Error('User creation failed');
      }

      await this.createUserProfile(userCredential.user, data, sanitizedUsername);
      await this.initializeUserAnalytics(userCredential.user.uid);
      this.logAnalyticsEvent('sign_up', { method: 'email', field_of_study: data.fieldOfStudy });

      toast.success('Registration successful!');
      return userCredential.user;

    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = this.getFirebaseErrorMessage(error.code) || error.message || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    }
  }

  // Login user
  async login(data: LoginData) {
    try {
      if (!data.email || !data.password) {
        throw new Error('Email and password are required');
      }

      const userCredential = await signInWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );

      if (!userCredential.user) {
        throw new Error('Login failed');
      }

      // Update user data (non-blocking)
      this.updateUserLoginData(userCredential.user.uid);
      this.logAnalyticsEvent('login', { method: 'email' });

      toast.success('Login successful!');
      return userCredential.user;

    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = this.getFirebaseErrorMessage(error.code) || error.message || 'Login failed';
      toast.error(errorMessage);
      throw error;
    }
  }

  // Google Sign In
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user) {
        throw new Error('Google login failed');
      }

      // Check if user exists, create if not
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await this.createGoogleUserProfile(user);
      }

      // Update user data (non-blocking)
      this.updateUserLoginData(user.uid);
      this.logAnalyticsEvent('login', { method: 'google' });

      toast.success('Google login successful!');
      return user;

    } catch (error: any) {
      console.error('Google login error:', error);
      const errorMessage = this.getGoogleErrorMessage(error.code) || 'Google login failed';
      toast.error(errorMessage);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      await signOut(auth);
      this.logAnalyticsEvent('logout');
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Logout failed');
      throw error;
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<User | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) return null;

      const userData = userDoc.data();
      return {
        ...userData,
        createdAt: this.convertTimestamp(userData.createdAt),
        updatedAt: this.convertTimestamp(userData.updatedAt),
        lastLogin: this.convertTimestamp(userData.lastLogin),
      } as User;

    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Reset password
  async resetPassword(email: string) {
    try {
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      console.error('Password reset error:', error);
      const errorMessage = this.getFirebaseErrorMessage(error.code) || error.message || 'Failed to send reset email';
      toast.error(errorMessage);
      throw error;
    }
  }

  // Update password
  async updatePassword(newPassword: string) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');
      
      if (!newPassword || newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      await updatePassword(user, newPassword);
      toast.success('Password updated successfully!');
    } catch (error: any) {
      console.error('Password update error:', error);
      const errorMessage = this.getFirebaseErrorMessage(error.code) || error.message || 'Failed to update password';
      toast.error(errorMessage);
      throw error;
    }
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Private helper methods
  private validateRegistrationData(data: RegisterData) {
    if (!data.email || !data.password || !data.username || !data.fullName || !data.fieldOfStudy) {
      throw new Error('All fields are required');
    }
  }

  private async checkUsernameAvailability(username: string) {
    const usernameQuery = query(
      collection(db, 'users'), 
      where('username', '==', username)
    );
    const usernameSnapshot = await getDocs(usernameQuery);
    
    if (!usernameSnapshot.empty) {
      throw new Error('Username already exists');
    }
  }

  private async createUserProfile(user: FirebaseUser, data: RegisterData, username: string) {
    const userProfile = {
      id: user.uid,
      email: data.email,
      username,
      fullName: data.fullName,
      name: data.fullName, // Add for compatibility
      fieldOfStudy: data.fieldOfStudy,
      field: data.fieldOfStudy, // Add for compatibility
      createdAt: new Date(),
      updatedAt: new Date(),
      isPremium: false,
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
  }

  private async createGoogleUserProfile(user: FirebaseUser) {
    const baseUsername = this.generateUsernameFromGoogle(user);
    const uniqueUsername = await this.ensureUniqueUsername(baseUsername);

    const userProfile = {
      id: user.uid,
      email: user.email || '',
      username: uniqueUsername,
      fullName: user.displayName || '',
      name: user.displayName || '', // Add for compatibility
      fieldOfStudy: 'General',
      field: 'General', // Add for compatibility
      avatarUrl: user.photoURL || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPremium: false,
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
    await this.initializeUserAnalytics(user.uid);
  }

  private async initializeUserAnalytics(userId: string) {
    try {
      await setDoc(doc(db, 'userAnalytics', userId), {
        userId,
        totalLogins: 0,
        totalStudyTime: 0,
        sessionsCompleted: 0,
        streakDays: 0,
        toolsUsed: {},
        lastActive: new Date(),
        preferredStudyTimes: [],
        mostUsedFeatures: [],
      });
    } catch (error) {
      console.error('Failed to initialize user analytics:', error);
    }
  }

  private async updateUserLoginData(userId: string) {
    Promise.all([
      this.updateLastLogin(userId),
      this.updateLoginAnalytics(userId),
      this.logUserLogin(userId)
    ]).catch(error => {
      console.error('Failed to update user login data:', error);
    });
  }

  private async updateLastLogin(userId: string) {
    try {
      await setDoc(doc(db, 'users', userId), {
        lastLogin: new Date(),
        updatedAt: new Date(),
      }, { merge: true });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  private async updateLoginAnalytics(userId: string) {
    try {
      const analyticsDocRef = doc(db, 'userAnalytics', userId);
      const analyticsDoc = await getDoc(analyticsDocRef);
      
      if (analyticsDoc.exists()) {
        const currentData = analyticsDoc.data();
        await updateDoc(analyticsDocRef, {
          totalLogins: (currentData.totalLogins || 0) + 1,
          lastActive: new Date(),
        });
      } else {
        await this.initializeUserAnalytics(userId);
      }
    } catch (error) {
      console.error('Error updating login analytics:', error);
    }
  }

  private async logUserLogin(userId: string) {
    try {
      const deviceInfo = this.getDeviceInfo();
      const ipAddress = await this.getIPAddress();

      const loginLog = {
        userId,
        loginTimestamp: new Date(),
        ipAddress,
        deviceInfo: deviceInfo.device,
        browserInfo: deviceInfo.browser,
        location: deviceInfo.location,
      };

      await addDoc(collection(db, 'loginLogs'), loginLog);
    } catch (error) {
      console.error('Error logging user login:', error);
    }
  }

  private logAnalyticsEvent(eventName: string, parameters?: Record<string, any>) {
    try {
      logEvent(analytics, eventName, parameters);
    } catch (error) {
      console.error('Failed to log analytics event:', error);
    }
  }

  private convertTimestamp(timestamp: any): Date | undefined {
    if (!timestamp) return undefined;
    return timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  }

  private getDeviceInfo() {
    try {
      const userAgent = navigator.userAgent || 'Unknown';
      const platform = navigator.platform || 'Unknown';
      
      return {
        device: `${platform} - ${userAgent.substring(0, 100)}`,
        browser: this.getBrowserInfo(),
        location: 'Unknown',
      };
    } catch (error) {
      return { device: 'Unknown', browser: 'Unknown', location: 'Unknown' };
    }
  }

  private getBrowserInfo() {
    try {
      const userAgent = navigator.userAgent || '';
      
      if (userAgent.includes('Chrome')) return 'Chrome';
      if (userAgent.includes('Firefox')) return 'Firefox';
      if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
      if (userAgent.includes('Edge')) return 'Edge';
      if (userAgent.includes('Opera')) return 'Opera';
      
      return 'Unknown';
    } catch (error) {
      return 'Unknown';
    }
  }

  private async getIPAddress(): Promise<string> {
    const services = [
      'https://api.ipify.org?format=json',
      'https://ipapi.co/json/',
      'https://httpbin.org/ip'
    ];

    for (const service of services) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(service, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' },
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) continue;
        
        const data = await response.json();
        const ip = data.ip || data.origin;
        
        if (ip && typeof ip === 'string') {
          return ip;
        }
      } catch (error) {
        continue;
      }
    }
    
    return 'Unknown';
  }

  private sanitizeUsername(username: string): string {
    return username
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9_]/g, '')
      .substring(0, 30);
  }

  private generateUsernameFromGoogle(user: FirebaseUser): string {
    if (user.displayName) {
      return this.sanitizeUsername(user.displayName);
    } else if (user.email) {
      return this.sanitizeUsername(user.email.split('@')[0]);
    }
    
    return 'user' + Math.random().toString(36).substring(2, 8);
  }

  private async ensureUniqueUsername(baseUsername: string): Promise<string> {
    try {
      let username = baseUsername;
      let counter = 1;
      
      while (counter < 100) {
        const usernameQuery = query(
          collection(db, 'users'), 
          where('username', '==', username)
        );
        const usernameSnapshot = await getDocs(usernameQuery);
        
        if (usernameSnapshot.empty) {
          return username;
        }
        
        username = `${baseUsername}${counter}`;
        counter++;
      }
      
      return `${baseUsername}${Date.now().toString().slice(-4)}`;
    } catch (error) {
      return `${baseUsername}${Math.random().toString(36).substring(2, 6)}`;
    }
  }

  private getGoogleErrorMessage(errorCode: string): string {
    const messages: Record<string, string> = {
      'auth/popup-closed-by-user': 'Login cancelled',
      'auth/popup-blocked': 'Popup blocked. Please allow popups for this site.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
    };
    
    return messages[errorCode] || 'Google login failed';
  }

  private getFirebaseErrorMessage(errorCode: string): string | null {
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'This email is already registered. Please use a different email or try logging in.',
      'auth/weak-password': 'Password is too weak. Please use at least 6 characters.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-not-found': 'No account found with this email. Please check your email or register.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your internet connection.',
      'auth/requires-recent-login': 'Please log out and log back in to perform this action.',
      'auth/user-disabled': 'This account has been disabled. Please contact support.',
      'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
    };
    
    return errorMessages[errorCode] || null;
  }
}

export const authService = new AuthService();
