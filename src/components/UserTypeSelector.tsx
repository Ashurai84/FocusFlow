import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Palette, BookOpen, Code, Stethoscope, Calculator } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { authService } from '../services/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

interface UserTypeSelectorProps {
  onSelect?: (type: string) => void;
}

export function UserTypeSelector({ onSelect }: UserTypeSelectorProps) {
  const { user, updateProfile, setNeedsFieldSelection } = useAuthStore();

  const userTypes = [
    {
      id: 'engineering',
      title: 'Engineering',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      description: 'Tech & Innovation'
    },
    {
      id: 'medical',
      title: 'Medical',
      icon: Stethoscope,
      color: 'from-red-500 to-pink-500',
      description: 'Health & Care'
    },
    {
      id: 'arts',
      title: 'Arts',
      icon: Palette,
      color: 'from-purple-500 to-indigo-500',
      description: 'Creative & Design'
    },
    {
      id: 'science',
      title: 'Science',
      icon: Calculator,
      color: 'from-green-500 to-emerald-500',
      description: 'Research & Discovery'
    },
    {
      id: 'commerce',
      title: 'Commerce',
      icon: GraduationCap,
      color: 'from-orange-500 to-yellow-500',
      description: 'Business & Finance'
    },
    {
      id: 'undergraduate',
      title: 'General',
      icon: BookOpen,
      color: 'from-gray-500 to-slate-500',
      description: 'All Fields'
    }
  ];

  const handleFieldSelect = async (fieldId: string) => {
    const selectedField = userTypes.find(f => f.id === fieldId);
    if (!selectedField || !user) return;

    try {
      // Update user profile in Firestore
      await updateDoc(doc(db, 'users', user.id), {
        fieldOfStudy: selectedField.title,
        updatedAt: new Date(),
      });

      // Update local state
      updateProfile({ fieldOfStudy: selectedField.title });
      setNeedsFieldSelection(false);
      
      toast.success(`Welcome to ${selectedField.title}!`);
      
      if (onSelect) {
        onSelect(fieldId);
      }
    } catch (error) {
      console.error('Error updating field:', error);
      toast.error('Failed to update field selection');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to FocusFlow!</h1>
        <p className="text-white/80">Choose your field of study</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 pb-20">
        {userTypes.map((type, index) => {
          const IconComponent = type.icon;
          return (
            <motion.button
              key={type.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFieldSelect(type.id)}
              className={`bg-gradient-to-br ${type.color} p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all`}
            >
              <IconComponent size={32} className="mx-auto mb-2" />
              <h3 className="font-bold text-lg">{type.title}</h3>
              <p className="text-sm opacity-90">{type.description}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}