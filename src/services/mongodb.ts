// Firebase Integration Service for User Tracking & Analytics
// This service integrates with Firebase Firestore for data storage and analytics

import { logEvent } from 'firebase/analytics';
import { analytics } from '../lib/firebase';

interface SpotifyProfile {
  id: string;
  display_name: string;
  email: string;
  country: string;
  followers: number;
  images: Array<{ url: string }>;
  product: 'free' | 'premium'; // Spotify subscription type
}

interface UserBehavior {
  sessionId: string;
  userId: string;
  timestamp: Date;
  action: string;
  page: string;
  duration?: number;
  metadata?: Record<string, any>;
}

interface UserProfile {
  _id?: string;
  userId: string;
  email: string;
  name: string;
  field: string;
  createdAt: Date;
  lastActive: Date;
  
  // Spotify Integration
  spotifyProfile?: SpotifyProfile;
  spotifyConnectedAt?: Date;
  topArtists?: Array<{ id: string; name: string; genres: string[] }>;
  topTracks?: Array<{ id: string; name: string; artists: string[] }>;
  playlists?: Array<{ id: string; name: string; trackCount: number }>;
  
  // User Classification
  isPro: boolean;
  subscriptionType?: 'monthly' | 'yearly';
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  
  // Analytics
  totalStudyTime: number;
  sessionsCompleted: number;
  streakDays: number;
  preferredStudyTimes: string[];
  mostUsedFeatures: string[];
  
  // Behavior Tracking
  lastBehaviorSync: Date;
  behaviorPatterns?: {
    peakActivityHours: number[];
    preferredMusicGenres: string[];
    averageSessionLength: number;
    featuresUsageFrequency: Record<string, number>;
  };
}

class MongoDBService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    // In production, these should come from environment variables
    // and be handled by a secure backend service
    this.baseUrl = process.env.VITE_MONGODB_API_URL || '';
    this.apiKey = process.env.VITE_MONGODB_API_KEY || '';
  }

  // User Profile Management
  async createUserProfile(userData: Omit<UserProfile, '_id' | 'createdAt' | 'lastActive'>): Promise<UserProfile> {
    const profile: UserProfile = {
      ...userData,
      createdAt: new Date(),
      lastActive: new Date(),
      totalStudyTime: 0,
      sessionsCompleted: 0,
      streakDays: 0,
      preferredStudyTimes: [],
      mostUsedFeatures: [],
      lastBehaviorSync: new Date(),
      isPro: false
    };

    // In production, this would be a secure API call to your backend
    return this.apiRequest('/users', 'POST', profile);
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const updateData = {
      ...updates,
      lastActive: new Date()
    };

    return this.apiRequest(`/users/${userId}`, 'PATCH', updateData);
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      return await this.apiRequest(`/users/${userId}`, 'GET');
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  }

  // Spotify Integration
  async updateSpotifyProfile(userId: string, spotifyData: SpotifyProfile): Promise<void> {
    const updates = {
      spotifyProfile: spotifyData,
      spotifyConnectedAt: new Date(),
      isPro: spotifyData.product === 'premium' // Auto-detect premium users
    };

    await this.updateUserProfile(userId, updates);
  }

  async updateSpotifyData(userId: string, data: {
    topArtists?: UserProfile['topArtists'];
    topTracks?: UserProfile['topTracks'];
    playlists?: UserProfile['playlists'];
  }): Promise<void> {
    await this.updateUserProfile(userId, data);
  }

  // Behavior Tracking
  async logUserBehavior(behavior: Omit<UserBehavior, 'timestamp'>): Promise<void> {
    const behaviorData: UserBehavior = {
      ...behavior,
      timestamp: new Date()
    };

    // In production, this would batch behaviors and send periodically
    await this.apiRequest('/behaviors', 'POST', behaviorData);
  }

  async getUserBehaviors(userId: string, limit: number = 100): Promise<UserBehavior[]> {
    return this.apiRequest(`/behaviors/${userId}?limit=${limit}`, 'GET');
  }

  // Analytics & Insights
  async updateBehaviorPatterns(userId: string): Promise<void> {
    const behaviors = await this.getUserBehaviors(userId, 1000);
    
    const patterns = this.analyzeBehaviorPatterns(behaviors);
    
    await this.updateUserProfile(userId, {
      behaviorPatterns: patterns,
      lastBehaviorSync: new Date()
    });
  }

  private analyzeBehaviorPatterns(behaviors: UserBehavior[]) {
    // Analyze peak activity hours
    const hourCounts = new Array(24).fill(0);
    behaviors.forEach(b => {
      const hour = b.timestamp.getHours();
      hourCounts[hour]++;
    });
    const peakActivityHours = hourCounts
      .map((count, hour) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(item => item.hour);

    // Calculate average session length
    const sessionDurations = behaviors
      .filter(b => b.duration)
      .map(b => b.duration!);
    const averageSessionLength = sessionDurations.length > 0 
      ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length 
      : 0;

    // Feature usage frequency
    const featuresUsageFrequency: Record<string, number> = {};
    behaviors.forEach(b => {
      if (b.action) {
        featuresUsageFrequency[b.action] = (featuresUsageFrequency[b.action] || 0) + 1;
      }
    });

    return {
      peakActivityHours,
      preferredMusicGenres: [], // Would be populated from Spotify data
      averageSessionLength,
      featuresUsageFrequency
    };
  }

  // Pro User Management
  async upgradeUserToPro(userId: string, subscriptionType: 'monthly' | 'yearly'): Promise<void> {
    const subscriptionEndDate = new Date();
    if (subscriptionType === 'monthly') {
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
    } else {
      subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
    }

    await this.updateUserProfile(userId, {
      isPro: true,
      subscriptionType,
      subscriptionStartDate: new Date(),
      subscriptionEndDate
    });
  }

  async getProUsers(): Promise<UserProfile[]> {
    return this.apiRequest('/users?isPro=true', 'GET');
  }

  async getFreeUsers(): Promise<UserProfile[]> {
    return this.apiRequest('/users?isPro=false', 'GET');
  }

  // Analytics Dashboard Data
  async getAnalyticsSummary(): Promise<{
    totalUsers: number;
    proUsers: number;
    freeUsers: number;
    spotifyConnectedUsers: number;
    averageStudyTime: number;
    topFeatures: Array<{ feature: string; usage: number }>;
  }> {
    return this.apiRequest('/analytics/summary', 'GET');
  }

  // Private helper method for API requests
  private async apiRequest(endpoint: string, method: string, data?: any): Promise<any> {
    // In production, this would make secure API calls to your backend
    // which would then interact with MongoDB using proper authentication
    
    const url = `${this.baseUrl}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
    };

    if (data && (method === 'POST' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  }
}

// Proposed MongoDB Schema (for backend implementation)
export const mongoSchemas = {
  users: {
    _id: "ObjectId",
    userId: "String (unique)",
    email: "String (unique)",
    name: "String",
    field: "String",
    createdAt: "Date",
    lastActive: "Date",
    
    // Spotify Integration
    spotifyProfile: {
      id: "String",
      display_name: "String",
      email: "String",
      country: "String",
      followers: "Number",
      images: ["Object"],
      product: "String (enum: free, premium)"
    },
    spotifyConnectedAt: "Date",
    topArtists: ["Object"],
    topTracks: ["Object"],
    playlists: ["Object"],
    
    // Subscription
    isPro: "Boolean",
    subscriptionType: "String (enum: monthly, yearly)",
    subscriptionStartDate: "Date",
    subscriptionEndDate: "Date",
    
    // Analytics
    totalStudyTime: "Number",
    sessionsCompleted: "Number",
    streakDays: "Number",
    preferredStudyTimes: ["String"],
    mostUsedFeatures: ["String"],
    
    // Behavior Patterns
    lastBehaviorSync: "Date",
    behaviorPatterns: {
      peakActivityHours: ["Number"],
      preferredMusicGenres: ["String"],
      averageSessionLength: "Number",
      featuresUsageFrequency: "Object"
    }
  },
  
  behaviors: {
    _id: "ObjectId",
    sessionId: "String",
    userId: "String (indexed)",
    timestamp: "Date (indexed)",
    action: "String",
    page: "String",
    duration: "Number",
    metadata: "Object"
  }
};

export const mongoDBService = new MongoDBService();
export type { UserProfile, UserBehavior, SpotifyProfile };