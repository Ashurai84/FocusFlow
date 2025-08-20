import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  getCountFromServer,
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';
import { db, analytics, LoginLog, UserAnalytics, ToolUsage } from '../lib/firebase';

export interface DashboardStats {
  totalUsers: number;
  totalLogins: number;
  activeUsers: number;
  newUsersToday: number;
  averageSessionTime: number;
  topTools: Array<{ name: string; usage: number }>;
  loginTrends: Array<{ date: string; logins: number }>;
  userRetention: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export interface UserStats {
  totalLogins: number;
  totalStudyTime: number;
  sessionsCompleted: number;
  streakDays: number;
  toolsUsed: Record<string, number>;
  loginHistory: LoginLog[];
  studyPatterns: {
    peakHours: number[];
    preferredDays: string[];
    averageSessionLength: number;
  };
}

class AnalyticsService {
  // Get dashboard statistics for admin
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const usersCol = collection(db, 'users');
      const loginsCol = collection(db, 'loginLogs');

      // Use getCountFromServer for efficient counting
      const [usersCountSnap, loginsCountSnap] = await Promise.all([
        getCountFromServer(usersCol),
        getCountFromServer(loginsCol)
      ]);

      const totalUsers = usersCountSnap.data().count;
      const totalLogins = loginsCountSnap.data().count;

      // Active users (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const activeUsersQuery = query(usersCol, where('lastLogin', '>=', sevenDaysAgo));
      const activeUsersCountSnap = await getCountFromServer(activeUsersQuery);
      const activeUsers = activeUsersCountSnap.data().count;

      // New users today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const newUsersQuery = query(usersCol, where('createdAt', '>=', today));
      const newUsersCountSnap = await getCountFromServer(newUsersQuery);
      const newUsersToday = newUsersCountSnap.data().count;

      // Fetch login trends data (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const [loginTrendsSnap, toolUsageSnap] = await Promise.all([
        getDocs(query(
          loginsCol,
          where('loginTimestamp', '>=', thirtyDaysAgo),
          orderBy('loginTimestamp', 'asc')
        )),
        getDocs(query(
          collection(db, 'toolUsage'),
          where('usageTimestamp', '>=', thirtyDaysAgo)
        ))
      ]);

      // Process login trends
      const loginTrends = this.processLoginTrends(loginTrendsSnap);

      // Process top tools
      const topTools = this.processTopTools(toolUsageSnap);

      // Mock data for now (can be calculated from actual data)
      const averageSessionTime = 25;
      const userRetention = {
        daily: 0.75,
        weekly: 0.45,
        monthly: 0.25,
      };

      return {
        totalUsers,
        totalLogins,
        activeUsers,
        newUsersToday,
        averageSessionTime,
        topTools,
        loginTrends,
        userRetention,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Get user-specific statistics
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      // Get user analytics document
      const analyticsDoc = await getDoc(doc(db, 'userAnalytics', userId));
      const analyticsData = analyticsDoc.exists() ? analyticsDoc.data() : null;

      // Get recent login history
      const loginHistorySnap = await getDocs(query(
        collection(db, 'loginLogs'),
        where('userId', '==', userId),
        orderBy('loginTimestamp', 'desc'),
        limit(50)
      ));

      const loginHistory = loginHistorySnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        loginTimestamp: (doc.data().loginTimestamp as Timestamp).toDate()
      })) as LoginLog[];

      // Get tool usage data
      const toolUsageSnap = await getDocs(query(
        collection(db, 'toolUsage'),
        where('userId', '==', userId),
        limit(100)
      ));

      const toolUsageData = toolUsageSnap.docs.map(doc => doc.data());

      // Process study patterns
      const studyPatterns = this.processStudyPatterns(loginHistory, toolUsageData);

      return {
        totalLogins: analyticsData?.totalLogins || 0,
        totalStudyTime: analyticsData?.totalStudyTime || 0,
        sessionsCompleted: analyticsData?.sessionsCompleted || 0,
        streakDays: analyticsData?.streakDays || 0,
        toolsUsed: analyticsData?.toolsUsed || {},
        loginHistory,
        studyPatterns,
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  // Log tool usage
  async logToolUsage(
    userId: string, 
    toolName: string, 
    toolCategory: string, 
    sessionDuration: number, 
    dataProcessed?: any
  ) {
    try {
      // Create tool usage document
      await addDoc(collection(db, 'toolUsage'), {
        userId,
        toolName,
        toolCategory,
        usageTimestamp: new Date(),
        sessionDuration,
        dataProcessed,
      });

      // Update user analytics
      await this.updateUserToolUsage(userId, toolName);

      // Log analytics event
      this.logAnalyticsEvent('tool_usage', {
        tool_name: toolName,
        tool_category: toolCategory,
        session_duration: sessionDuration
      });

    } catch (error) {
      console.error('Error logging tool usage:', error);
    }
  }

  // Update study session
  async updateStudySession(userId: string, sessionDuration: number) {
    try {
      const analyticsRef = doc(db, 'userAnalytics', userId);
      const analyticsDoc = await getDoc(analyticsRef);
      
      if (analyticsDoc.exists()) {
        const currentData = analyticsDoc.data();
        await updateDoc(analyticsRef, {
          totalStudyTime: (currentData.totalStudyTime || 0) + sessionDuration,
          sessionsCompleted: (currentData.sessionsCompleted || 0) + 1,
          lastActive: new Date(),
        });
      }

      this.logAnalyticsEvent('study_session_completed', {
        session_duration: sessionDuration
      });

    } catch (error) {
      console.error('Error updating study session:', error);
    }
  }

  // Get field-specific analytics
  async getFieldAnalytics(fieldOfStudy: string) {
    try {
      const usersSnap = await getDocs(query(
        collection(db, 'users'),
        where('fieldOfStudy', '==', fieldOfStudy)
      ));

      if (usersSnap.empty) return null;

      const userIds = usersSnap.docs.map(doc => doc.data().id);

      // Get aggregated data for this field
      const toolUsageSnap = await getDocs(query(
        collection(db, 'toolUsage'),
        where('userId', 'in', userIds.slice(0, 10)) // Firestore 'in' query limit
      ));

      const analyticsPromises = userIds.slice(0, 10).map(userId => 
        getDoc(doc(db, 'userAnalytics', userId))
      );
      const analyticsSnaps = await Promise.all(analyticsPromises);
      
      const analytics = analyticsSnaps
        .filter(snap => snap.exists())
        .map(snap => snap.data());

      return {
        totalUsers: usersSnap.size,
        totalStudyTime: analytics.reduce((sum, a) => sum + (a.totalStudyTime || 0), 0),
        totalSessions: analytics.reduce((sum, a) => sum + (a.sessionsCompleted || 0), 0),
        popularTools: this.processTopTools(toolUsageSnap),
      };

    } catch (error) {
      console.error('Error fetching field analytics:', error);
      return null;
    }
  }

  // Private helper methods
  private processLoginTrends(loginTrendsSnap: any): Array<{ date: string; logins: number }> {
    const dailyCounts: Record<string, number> = {};
    
    loginTrendsSnap.docs.forEach((doc: any) => {
      const timestamp = doc.data().loginTimestamp as Timestamp;
      const date = timestamp.toDate().toISOString().split('T')[0];
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    return Object.entries(dailyCounts)
      .map(([date, logins]) => ({ date, logins }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private processTopTools(toolUsageSnap: any): Array<{ name: string; usage: number }> {
    const toolCounts: Record<string, number> = {};
    
    toolUsageSnap.docs.forEach((doc: any) => {
      const toolName = doc.data().toolName;
      toolCounts[toolName] = (toolCounts[toolName] || 0) + 1;
    });

    return Object.entries(toolCounts)
      .map(([name, usage]) => ({ name, usage }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 10);
  }

  private processStudyPatterns(
    loginHistory: LoginLog[], 
    toolUsage: Array<{ sessionDuration?: number }>
  ) {
    const hourCounts: Record<number, number> = {};
    const dayCounts: Record<string, number> = {};
    
    loginHistory.forEach(log => {
      const date = new Date(log.loginTimestamp);
      const hour = date.getHours();
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });

    const avgSessionLength = toolUsage.length > 0
      ? toolUsage
          .filter(usage => usage.sessionDuration)
          .reduce((sum, usage) => sum + (usage.sessionDuration || 0), 0) / toolUsage.length
      : 0;

    return {
      peakHours: Object.entries(hourCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([hour]) => parseInt(hour)),
      preferredDays: Object.entries(dayCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([day]) => day),
      averageSessionLength: Math.round(avgSessionLength),
    };
  }

  private async updateUserToolUsage(userId: string, toolName: string) {
    try {
      const analyticsRef = doc(db, 'userAnalytics', userId);
      const analyticsDoc = await getDoc(analyticsRef);
      
      if (analyticsDoc.exists()) {
        const currentData = analyticsDoc.data();
        const updatedToolsUsed = {
          ...currentData.toolsUsed,
          [toolName]: (currentData.toolsUsed?.[toolName] || 0) + 1,
        };

        await updateDoc(analyticsRef, {
          toolsUsed: updatedToolsUsed,
          lastActive: new Date(),
        });
      }
    } catch (error) {
      console.error('Error updating user tool usage:', error);
    }
  }

  private logAnalyticsEvent(eventName: string, parameters?: Record<string, any>) {
    try {
      logEvent(analytics, eventName, parameters);
    } catch (error) {
      console.error('Failed to log analytics event:', error);
    }
  }
}

export const analyticsService = new AnalyticsService();
