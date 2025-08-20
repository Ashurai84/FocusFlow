import React from 'react';
import Timer from '../components/Timer';        // ✅ Default import
import MusicPlayer from '../components/MusicPlayer'; // ✅ Default import  
import QuoteCard from '../components/QuoteCard';     // ✅ Default import
import { motion } from 'framer-motion';
import { Sparkles, Target, Clock, TrendingUp } from 'lucide-react'; // ✅ Removed Music
import { useAuthStore } from '../store/auth';
import { useTimerStore } from '../store/timer';

export function Dashboard() {
  const { user } = useAuthStore();
  const { sessions, totalStudyTime, studyStreak } = useTimerStore();

  const todayStudyTime = Math.floor(totalStudyTime % 1440); // Reset daily

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 p-4 pb-24">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-2">
            <Sparkles className="text-yellow-300 mr-2" size={24} />
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user?.fullName || user?.username || user?.email || 'User'}!
            </h1>
            <Sparkles className="text-yellow-300 ml-2" size={24} />
          </div>
          <p className="text-white/80">Ready to focus and achieve your goals?</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-center"
          >
            <Target className="text-green-300 mx-auto mb-2" size={32} />
            <div className="text-3xl font-bold text-white">{studyStreak}</div>
            <div className="text-white/80 text-sm">Day Streak</div>
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-center"
          >
            <Clock className="text-blue-300 mx-auto mb-2" size={32} />
            <div className="text-3xl font-bold text-white">{todayStudyTime}m</div>
            <div className="text-white/80 text-sm">Today</div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-center"
          >
            <TrendingUp className="text-purple-300 mx-auto mb-2" size={32} />
            <div className="text-3xl font-bold text-white">{sessions}</div>
            <div className="text-white/80 text-sm">Sessions</div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-center"
          >
            <Sparkles className="text-yellow-300 mx-auto mb-2" size={32} />
            <div className="text-3xl font-bold text-white">{Math.floor(totalStudyTime / 60)}h</div>
            <div className="text-white/80 text-sm">Total Time</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quote Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <QuoteCard userType={user?.fieldOfStudy?.toLowerCase() || 'general'} />
          </motion.div>

          {/* Timer */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/20 backdrop-blur-lg rounded-2xl p-6"
          >
            <Timer />
          </motion.div>
        </div>

        {/* Spotify Player */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <MusicPlayer />
        </motion.div>
      </div>
    </div>
  );
}
