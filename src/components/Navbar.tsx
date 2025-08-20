import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Users, BookOpen, Sun, Moon, Zap, LogOut, User, Heart, Crown } from 'lucide-react';
import { useThemeStore } from '../store/theme';
import { useAuthStore } from '../store/auth';
import { motion } from 'framer-motion';

export function Navbar() {
  const { theme, setTheme } = useThemeStore();
  const { user, logout } = useAuthStore();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 z-50"
    >
      <div className="w-full px-4">
        <div className="flex items-center justify-between py-3">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="hidden sm:block">
              {/* ✅ Fixed: Use correct property names with fallbacks */}
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.fullName || user?.username || user?.email || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.fieldOfStudy || 'Student'}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`
              }
            >
              <Home size={18} />
              <span className="text-xs mt-1">Home</span>
            </NavLink>
            
            <NavLink
              to="/planner"
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`
              }
            >
              <Calendar size={18} />
              <span className="text-xs mt-1">Plan</span>
            </NavLink>
            
            <NavLink
              to="/field-specific"
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`
              }
            >
              <Zap size={18} />
              <span className="text-xs mt-1">Tools</span>
            </NavLink>
            
            <NavLink
              to="/medical-models"
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`
              }
            >
              <Heart size={18} />
              <span className="text-xs mt-1">3D Models</span>
            </NavLink>
            
            <NavLink
              to="/community"
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`
              }
            >
              <Users size={18} />
              <span className="text-xs mt-1">Community</span>
            </NavLink>
            
            <NavLink
              to="/resources"
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`
              }
            >
              <BookOpen size={18} />
              <span className="text-xs mt-1">Resources</span>
            </NavLink>
            
            <NavLink
              to="/pro"
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                    : 'hover:bg-yellow-100 dark:hover:bg-yellow-800 text-yellow-600 dark:text-yellow-400'
                }`
              }
            >
              <Crown size={18} />
              <span className="text-xs mt-1">Pro</span>
            </NavLink>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-400"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all text-red-600 dark:text-red-400"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
        
        {/* Developer Attribution */}
        <div className="text-center py-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            🔧 Built & Designed by Ashutosh Pankaj Rai{' '}
            <a 
              href="https://github.com/Ashurai84" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </motion.nav>
  );
}
