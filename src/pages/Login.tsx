import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Code, Stethoscope, Palette, Calculator, BookOpen, User, Mail, LogIn } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export function Login() {
  const [step, setStep] = useState<'login' | 'field'>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    field: ''
  });
  const { login } = useAuthStore();

  const fields = [
    { id: 'engineering', name: 'Engineering', icon: Code, color: 'from-blue-500 to-cyan-500' },
    { id: 'medical', name: 'Medical', icon: Stethoscope, color: 'from-red-500 to-pink-500' },
    { id: 'arts', name: 'Arts', icon: Palette, color: 'from-purple-500 to-indigo-500' },
    { id: 'commerce', name: 'Commerce', icon: Calculator, color: 'from-green-500 to-emerald-500' },
    { id: 'science', name: 'Science', icon: BookOpen, color: 'from-orange-500 to-yellow-500' },
    { id: 'general', name: 'General Studies', icon: GraduationCap, color: 'from-gray-500 to-slate-500' }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setStep('field');
    }
  };

  const handleFieldSelect = (fieldId: string) => {
    const selectedField = fields.find(f => f.id === fieldId);
    if (selectedField) {
      login({
        name: formData.name,
        email: formData.email,
        field: selectedField.name
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl"
      >
        {step === 'login' ? (
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
              <p className="text-white/80">Your Ultimate Study Companion</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm rounded-xl text-white placeholder-white/60 border border-white/30 focus:border-white/60 focus:outline-none transition-all"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm rounded-xl text-white placeholder-white/60 border border-white/30 focus:border-white/60 focus:outline-none transition-all"
                    required
                  />
                </div>
              </motion.div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center"
              >
                <LogIn className="mr-2" size={20} />
                Continue
              </motion.button>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your Field</h2>
              <p className="text-white/80">Select your area of study for personalized content</p>
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
                    className={`bg-gradient-to-br ${field.color} p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all`}
                  >
                    <IconComponent size={32} className="mx-auto mb-3" />
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