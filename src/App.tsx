import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Dashboard } from './pages/Dashboard';
import { StudyPlanner } from './pages/StudyPlanner';
import { Community } from './pages/Community';
import { Resources } from './pages/Resources';
import { FieldSpecific } from './pages/FieldSpecific';
import { MedicalModels } from './pages/MedicalModels';
import { ProFeatures } from './pages/ProFeatures';
import { Login } from './pages/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import { Navbar } from './components/Navbar';
import { AnimatePresence } from 'framer-motion';
import { useThemeStore } from './store/theme';
import { useAuthStore } from './store/auth';
import { useTimerStore } from './store/timer';
import { useSpotifyStore } from './store/spotify';
import { UserTypeSelector } from './components/UserTypeSelector';
import { spotifyService } from './services/spotify';
import toast from 'react-hot-toast';

function AppContent() {
  const location = useLocation();
  const { isAuthenticated, loading, needsFieldSelection } = useAuthStore();
  const { isAuthenticated: spotifyAuthenticated, fetchUserData } = useSpotifyStore();

  // ✅ Handle Spotify OAuth callback
  useEffect(() => {
    const handleSpotifyCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      
      if (code && state) {
        try {
          console.log('🎵 Processing Spotify OAuth callback...');
          
          // Show loading toast
          const loadingToast = toast.loading('Connecting to Spotify...');
          
          // Exchange code for tokens
          await spotifyService.exchangeCodeForToken(code, state);
          
          // Fetch user data after successful authentication
          await fetchUserData();
          
          console.log('✅ Spotify connected successfully!');
          
          // Clean up URL parameters without page reload
          const newUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, document.title, newUrl);
          
          // Success notification
          toast.success('🎵 Spotify connected successfully!', { id: loadingToast });
          
        } catch (error) {
          console.error('❌ Spotify connection failed:', error);
          toast.error('Failed to connect to Spotify. Please try again.');
        }
      }
    };

    // Only handle callback if we have the required parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('code') && urlParams.has('state')) {
      handleSpotifyCallback();
    }
  }, [fetchUserData]);

  // Show loading screen while initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading FocusFlow...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  // Show field selection for Google login users
  if (needsFieldSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 w-full max-w-2xl">
          <UserTypeSelector />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-right" />
      <div className="w-full">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/planner" element={<StudyPlanner />} />
            <Route path="/community" element={<Community />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/field-specific" element={<FieldSpecific />} />
            <Route path="/medical-models" element={<MedicalModels />} />
            <Route path="/pro" element={<ProFeatures />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </AnimatePresence>
        <Navbar />
      </div>
    </div>
  );
}

function App() {
  const { theme } = useThemeStore();
  const { initializeTimer } = useTimerStore();
  const { initialize } = useAuthStore();
  const { isAuthenticated: spotifyAuthenticated, fetchUserData } = useSpotifyStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    initialize();
    initializeTimer();
  }, [initialize, initializeTimer]);

  useEffect(() => {
    // Check if user is already authenticated with Spotify on app load
    if (spotifyAuthenticated) {
      fetchUserData();
    }
  }, [spotifyAuthenticated, fetchUserData]);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
