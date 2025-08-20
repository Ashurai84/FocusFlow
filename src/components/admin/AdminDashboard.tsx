import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Clock, 
  BarChart3, 
  UserCheck, 
  Calendar,
  Download,
  Filter,
  Search,
  Lock,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  getDoc,
  doc as firestoreDoc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

import toast from 'react-hot-toast';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardStats {
  totalUsers: number;
  newUsersToday: number;
  totalLogins: number;
  activeUsers: number;
  averageSessionTime: number;
  userRetention: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  loginTrends: Array<{ date: string; logins: number }>;
  topTools: Array<{ name: string; usage: number }>;
  recentActivity: Array<{ user: string; action: string; time: string }>;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];
    
    // Date ranges
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Initialize stats
    setStats({
      totalUsers: 0,
      newUsersToday: 0,
      totalLogins: 0,
      activeUsers: 0,
      averageSessionTime: 25,
      userRetention: { daily: 0.75, weekly: 0.50, monthly: 0.30 },
      loginTrends: [],
      topTools: [],
      recentActivity: []
    });

    try {
      // Listen to Users Collection
      const usersUnsubscribe = onSnapshot(
        collection(db, 'users'),
        (snapshot) => {
          let totalUsers = 0;
          let newUsersToday = 0;
          let activeUsers = 0;

          snapshot.forEach(doc => {
            const userData = doc.data();
            totalUsers++;

            // Check if user created today
            if (userData.createdAt) {
              const createdAt = userData.createdAt.toDate();
              if (createdAt >= today) {
                newUsersToday++;
              }
            }

            // Check if user is active (logged in within 7 days)
            if (userData.lastLogin) {
              const lastLogin = userData.lastLogin.toDate();
              if (lastLogin >= sevenDaysAgo) {
                activeUsers++;
              }
            }
          });

          setStats(prevStats => ({
            ...prevStats!,
            totalUsers,
            newUsersToday,
            activeUsers
          }));
          
          setIsConnected(true);
        },
        (error) => {
          console.error('Error listening to users:', error);
          setIsConnected(false);
        }
      );
      unsubscribers.push(usersUnsubscribe);

      // Listen to Login Logs
      const loginLogsQuery = query(
        collection(db, 'loginLogs'),
        where('loginTimestamp', '>=', thirtyDaysAgo),
        orderBy('loginTimestamp', 'asc')
      );

      const loginLogsUnsubscribe = onSnapshot(
        loginLogsQuery,
        (snapshot) => {
          const dailyCounts: Record<string, number> = {};
          let totalLogins = 0;

          snapshot.forEach(doc => {
            const logData = doc.data();
            totalLogins++;
            
            const loginDate = logData.loginTimestamp.toDate();
            const dateKey = loginDate.toISOString().split('T')[0];
            dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
          });

          const loginTrends = Object.entries(dailyCounts)
            .map(([date, logins]) => ({ date, logins }))
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(-7); // Last 7 days

          setStats(prevStats => ({
            ...prevStats!,
            totalLogins,
            loginTrends
          }));
        },
        (error) => {
          console.error('Error listening to login logs:', error);
          setIsConnected(false);
        }
      );
      unsubscribers.push(loginLogsUnsubscribe);

      // Listen to Tool Usage
      const toolUsageQuery = query(
        collection(db, 'toolUsage'),
        where('usageTimestamp', '>=', thirtyDaysAgo),
        orderBy('usageTimestamp', 'desc'),
        limit(1000)
      );

      const toolUsageUnsubscribe = onSnapshot(
        toolUsageQuery,
        (snapshot) => {
          const toolCounts: Record<string, number> = {};

          snapshot.forEach(doc => {
            const toolData = doc.data();
            const toolName = toolData.toolName;
            if (toolName) {
              toolCounts[toolName] = (toolCounts[toolName] || 0) + 1;
            }
          });

          const topTools = Object.entries(toolCounts)
            .map(([name, usage]) => ({ name, usage }))
            .sort((a, b) => b.usage - a.usage)
            .slice(0, 5);

          setStats(prevStats => ({
            ...prevStats!,
            topTools
          }));
        },
        (error) => {
          console.error('Error listening to tool usage:', error);
          setIsConnected(false);
        }
      );
      unsubscribers.push(toolUsageUnsubscribe);

      // ✅ FIXED: Listen to Recent Activity (Only ONE declaration)
      const recentActivityQuery = query(
        collection(db, 'loginLogs'),
        orderBy('loginTimestamp', 'desc'),
        limit(8)
      );

      const recentActivityUnsubscribe = onSnapshot(
        recentActivityQuery,
        async (snapshot) => {
          const activities: Array<{ user: string; action: string; time: string }> = [];
          
          for (const docSnapshot of snapshot.docs) {
            const logData = docSnapshot.data();
            
            try {
              // ✅ Use imported functions instead of dynamic import
              const userDoc = await getDoc(firestoreDoc(db, 'users', logData.userId));
              
              if (userDoc.exists()) {
                const userData = userDoc.data();
                const loginTime = logData.loginTimestamp.toDate();
                const timeAgo = getTimeAgo(loginTime);
                
                activities.push({
                  user: userData.fullName || userData.username || 'Unknown User',
                  action: 'Logged in to platform',
                  time: timeAgo
                });
              }
            } catch (error) {
              console.error('Error fetching user data for activity:', error);
            }
          }

          setStats(prevStats => ({
            ...prevStats!,
            recentActivity: activities
          }));
        },
        (error) => {
          console.error('Error listening to recent activity:', error);
          setIsConnected(false);
        }
      );
      unsubscribers.push(recentActivityUnsubscribe);

      setLoading(false);

    } catch (error) {
      console.error('Error setting up real-time listeners:', error);
      setLoading(false);
      setIsConnected(false);
      toast.error('Failed to connect to real-time data');
    }

    // Cleanup function
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [timeRange]);

  // Helper function to format time ago
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const exportReport = () => {
    if (!stats) return;
    
    const report = {
      generatedAt: new Date().toISOString(),
      timeRange,
      stats,
    };
    
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `admin-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Report exported successfully');
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    // Add your logout logic here
  };

  // Chart data
  const loginTrendsData = {
    labels: stats?.loginTrends.map(t => new Date(t.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Daily Logins',
        data: stats?.loginTrends.map(t => t.logins) || [],
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f620',
        tension: 0.4,
      },
    ],
  };

  const topToolsData = {
    labels: stats?.topTools.map(t => t.name) || [],
    datasets: [
      {
        label: 'Usage Count',
        data: stats?.topTools.map(t => t.usage) || [],
        backgroundColor: [
          '#ef4444',
          '#f97316',
          '#eab308',
          '#22c55e',
          '#06b6d4',
          '#8b5cf6',
          '#ec4899',
          '#6b7280',
        ],
      },
    ],
  };

  const retentionData = {
    labels: ['Daily', 'Weekly', 'Monthly'],
    datasets: [
      {
        label: 'User Retention (%)',
        data: stats ? [
          stats.userRetention.daily * 100,
          stats.userRetention.weekly * 100,
          stats.userRetention.monthly * 100
        ] : [],
        backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart' as const,
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading real-time dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header with Connection Status */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900 mr-4">Admin Dashboard</h1>
              <div className="flex items-center">
                {isConnected ? (
                  <Wifi size={20} className="text-green-500 mr-2" />
                ) : (
                  <WifiOff size={20} className="text-red-500 mr-2" />
                )}
                <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {isConnected ? 'Live Data' : 'Disconnected'}
                </span>
              </div>
            </div>
            <p className="text-gray-600">Real-time platform analytics and user activity</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            
            <button
              onClick={exportReport}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={16} className="mr-2" />
              Export Report
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Lock size={16} className="mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Real-time Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            key={`users-${stats?.totalUsers}`}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Users</p>
                <p className="text-3xl font-bold">{stats?.totalUsers?.toLocaleString() || 0}</p>
              </div>
              <Users size={32} className="text-blue-200" />
            </div>
            <div className="mt-4 flex items-center text-blue-100">
              <TrendingUp size={16} className="mr-1" />
              <span className="text-sm">+{stats?.newUsersToday || 0} today</span>
            </div>
          </motion.div>

          <motion.div
            key={`logins-${stats?.totalLogins}`}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Logins</p>
                <p className="text-3xl font-bold">{stats?.totalLogins?.toLocaleString() || 0}</p>
              </div>
              <Activity size={32} className="text-green-200" />
            </div>
            <div className="mt-4 flex items-center text-green-100">
              <UserCheck size={16} className="mr-1" />
              <span className="text-sm">{stats?.activeUsers?.toLocaleString() || 0} active users</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Avg Session</p>
                <p className="text-3xl font-bold">{stats?.averageSessionTime || 0}m</p>
              </div>
              <Clock size={32} className="text-purple-200" />
            </div>
            <div className="mt-4 flex items-center text-purple-100">
              <BarChart3 size={16} className="mr-1" />
              <span className="text-sm">Study time</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Retention Rate</p>
                <p className="text-3xl font-bold">
                  {stats ? Math.round(stats.userRetention.weekly * 100) : 0}%
                </p>
              </div>
              <TrendingUp size={32} className="text-orange-200" />
            </div>
            <div className="mt-4 flex items-center text-orange-100">
              <Calendar size={16} className="mr-1" />
              <span className="text-sm">Weekly retention</span>
            </div>
          </motion.div>
        </div>

        {/* Real-time Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Login Trends */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Login Trends (Live)
            </h3>
            <div className="h-64">
              <Line data={loginTrendsData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Top Tools */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Most Used Tools (Real-time)
            </h3>
            <div className="h-64">
              <Bar data={topToolsData} options={chartOptions} />
            </div>
          </motion.div>
        </div>

        {/* User Retention & Real-time Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Retention */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">User Retention</h3>
            <div className="h-64">
              <Doughnut data={retentionData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Real-time Activity Feed */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Live Activity Feed
            </h3>
            <div className="space-y-4 h-64 overflow-y-auto">
              {stats?.recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                    <div>
                      <p className="font-medium text-gray-800">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </motion.div>
              ))}
              
              {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Real-time User Analytics Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">User Analytics (Live Data)</h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter size={16} className="mr-2" />
                Filter
              </button>
            </div>
          </div>
          
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-blue-600" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">Real-time User Data</h4>
            <p className="text-gray-600 mb-4">
              Detailed user analytics table will populate as users interact with your platform.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Total Users: {stats?.totalUsers || 0}
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Active Today: {stats?.activeUsers || 0}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
