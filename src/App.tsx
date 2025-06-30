import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { StudyPlanner } from './pages/StudyPlanner';
import { Community } from './pages/Community';
import { Resources } from './pages/Resources';
import { FieldSpecific } from './pages/FieldSpecific';
import { Login } from './pages/Login';
import { Navbar } from './components/Navbar';
import { AnimatePresence } from 'framer-motion';
import { useThemeStore } from './store/theme';
import { useAuthStore } from './store/auth';
import { useTimerStore } from './store/timer';

function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/planner" element={<StudyPlanner />} />
            <Route path="/community" element={<Community />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/field-specific" element={<FieldSpecific />} />
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

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    initializeTimer();
  }, [initializeTimer]);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;