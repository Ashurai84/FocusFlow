import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Code, Stethoscope, Palette, Calculator, BookOpen, User, Mail, LogIn, Eye, EyeOff, AlertCircle, Shield } from 'lucide-react';
import { authService } from '../services/auth';
import toast, { Toaster } from 'react-hot-toast';

export function Login() {
  const [mode, setMode] = useState<'login' | 'register' | 'admin'>('login');
  const [step, setStep] = useState<'auth' | 'field'>('auth');
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    field: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fields = [
    { id: 'engineering', name: 'Engineering', icon: Code, color: 'from-blue-500 to-cyan-500' },
    { id: 'medical', name: 'Medical', icon: Stethoscope, color: 'from-red-500 to-pink-500' },
    { id: 'arts', name: 'Arts', icon: Palette, color: 'from-purple-500 to-indigo-500' },
    { id: 'commerce', name: 'Commerce', icon: Calculator, color: 'from-green-500 to-emerald-500' },
    { id: 'science', name: 'Science', icon: BookOpen, color: 'from-orange-500 to-yellow-500' },
    { id: 'general', name: 'General Studies', icon: GraduationCap, color: 'from-gray-500 to-slate-500' }
  ];

  // Admin credentials
  const ADMIN_EMAIL = "admin@temp.com";
  const ADMIN_PASSWORD = "admin123";

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (mode === 'register') {
      if (!formData.username) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }
      
      if (!formData.name) {
        newErrors.name = 'Full name is required';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (mode === 'login') {
        await authService.login({
          email: formData.email,
          password: formData.password,
        });
        // User will be redirected automatically by auth state change
      } else if (mode === 'admin') {
        // Admin login with Firebase Auth
        await authService.login({
          email: formData.email,
          password: formData.password,
        });
        toast.success('Admin login successful!');
        // Redirect to admin dashboard
        window.location.href = '/admin';
      } else {
        setStep('field');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await authService.loginWithGoogle();
      // User will be redirected automatically by auth state change
    } catch (error: any) {
      console.error('Google login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldSelect = async (fieldId: string) => {
    const selectedField = fields.find(f => f.id === fieldId);
    if (!selectedField) return;
    
    setLoading(true);
    
    try {
      await authService.register({
        email: formData.email,
        password: formData.password,
        username: formData.username,
        fullName: formData.name,
        fieldOfStudy: selectedField.name,
      });
      // User will be redirected automatically by auth state change
    } catch (error: any) {
      console.error('Registration error:', error);
      setStep('auth'); // Go back to auth form on error
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill admin credentials when switching to admin mode
  const switchToAdminMode = () => {
    setMode('admin');
    setFormData({
      ...formData,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4 relative">
      <Toaster position="top-right" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl relative"
      >
        {step === 'auth' ? (
          <>
            <div className="text-center mb-8">
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="flex items-center justify-center mb-4"
              >
                <GraduationCap className="text-white mr-3" size={40} />
                <h1 className="text-3xl font-bold text-white">FocusFlow</h1>
              </motion.div>
              <p className="text-white/80 mb-4">Your Ultimate Study Companion</p>
              
              {/* Mode Toggle */}
              <div className="flex bg-white/20 rounded-xl p-1">
                <button
                  onClick={() => {
                    setMode('login');
                    setFormData({ ...formData, email: '', password: '' });
                    setErrors({});
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    mode === 'login'
                      ? 'bg-white/30 text-white shadow-sm'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMode('register');
                    setFormData({ ...formData, email: '', password: '' });
                    setErrors({});
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    mode === 'register'
                      ? 'bg-white/30 text-white shadow-sm'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Register
                </button>
                <button
                  onClick={switchToAdminMode}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    mode === 'admin'
                      ? 'bg-white/30 text-white shadow-sm'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Shield size={16} className="inline mr-1" />
                  Admin
                </button>
              </div>
            </div>

            {/* Admin Credentials Display */}
            {mode === 'admin' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-600/20 border border-blue-400/30 rounded-xl p-4 mb-6"
              >
                <div className="flex items-center mb-2">
                  <Shield size={16} className="text-blue-300 mr-2" />
                  <h3 className="text-sm font-semibold text-blue-200">Admin Access</h3>
                </div>
                <div className="text-xs text-blue-100">
                  <p><strong>Email:</strong> admin@temp.com</p>
                  <p><strong>Password:</strong> admin123</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleAuth} className="space-y-6">
              {mode === 'register' && (
                <>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                      <input
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className={`w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm rounded-xl text-white placeholder-white/60 border ${
                          errors.username ? 'border-red-400' : 'border-white/30'
                        } focus:border-white/60 focus:outline-none transition-all`}
                      />
                    </div>
                    {errors.username && (
                      <div className="flex items-center mt-2 text-red-300 text-sm">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.username}
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm rounded-xl text-white placeholder-white/60 border ${
                          errors.name ? 'border-red-400' : 'border-white/30'
                        } focus:border-white/60 focus:outline-none transition-all`}
                      />
                    </div>
                    {errors.name && (
                      <div className="flex items-center mt-2 text-red-300 text-sm">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.name}
                      </div>
                    )}
                  </motion.div>
                </>
              )}

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: mode === 'register' ? 0.3 : 0.1 }}
              >
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm rounded-xl text-white placeholder-white/60 border ${
                      errors.email ? 'border-red-400' : 'border-white/30'
                    } focus:border-white/60 focus:outline-none transition-all`}
                    readOnly={mode === 'admin'}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center mt-2 text-red-300 text-sm">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.email}
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: mode === 'register' ? 0.4 : 0.2 }}
              >
                <div className="relative">
                  <LogIn className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full pl-12 pr-12 py-4 bg-white/20 backdrop-blur-sm rounded-xl text-white placeholder-white/60 border ${
                      errors.password ? 'border-red-400' : 'border-white/30'
                    } focus:border-white/60 focus:outline-none transition-all`}
                    readOnly={mode === 'admin'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center mt-2 text-red-300 text-sm">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.password}
                  </div>
                )}
              </motion.div>

              {mode === 'register' && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="relative">
                    <LogIn className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`w-full pl-12 pr-12 py-4 bg-white/20 backdrop-blur-sm rounded-xl text-white placeholder-white/60 border ${
                        errors.confirmPassword ? 'border-red-400' : 'border-white/30'
                      } focus:border-white/60 focus:outline-none transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="flex items-center mt-2 text-red-300 text-sm">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.confirmPassword}
                    </div>
                  )}
                </motion.div>
              )}

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: mode === 'register' ? 0.6 : 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full py-4 ${
                  mode === 'admin' 
                    ? 'bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                } disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === 'admin' ? <Shield className="mr-2" size={20} /> : <LogIn className="mr-2" size={20} />}
                    {mode === 'admin' ? 'Admin Login' : mode === 'login' ? 'Login' : 'Continue'}
                  </>
                )}
              </motion.button>
            </form>

            {/* Only show Google login for non-admin modes */}
            {mode !== 'admin' && (
              <>
                {/* Divider */}
                <div className="flex items-center my-6">
                  <div className="flex-1 border-t border-white/30"></div>
                  <span className="px-4 text-white/60 text-sm">or</span>
                  <div className="flex-1 border-t border-white/30"></div>
                </div>

                {/* Google Login Button */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: mode === 'register' ? 0.7 : 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-4 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-xl transition-all flex items-center justify-center border border-gray-300"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </motion.button>
              </>
            )}
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your Field</h2>
              <p className="text-white/80">Select your area of study for personalized content</p>
              
              <button
                onClick={() => setStep('auth')}
                className="mt-4 text-white/70 hover:text-white text-sm underline"
              >
                ← Back to registration
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {fields.map((field, index) => {
                const IconComponent = field.icon;
                return (
                  <motion.button
                    key={field.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFieldSelect(field.id)}
                    disabled={loading}
                    className={`bg-gradient-to-br ${field.color} p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all`}
                  >
                    {loading ? (
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    ) : (
                      <IconComponent size={32} className="mx-auto mb-3" />
                    )}
                    <h3 className="font-bold text-lg">{field.name}</h3>
                  </motion.button>
                );
              })}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
