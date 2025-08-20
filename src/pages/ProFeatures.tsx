import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Music, 
  RefreshCw, 
  BarChart3, 
  Wifi, 
  Bell, 
  Palette, 
  Download, 
  Brain, 
  Headphones,
  Check,
  Star,
  Zap
} from 'lucide-react';

export function ProFeatures() {
  const proFeatures = [
    {
      icon: Music,
      title: 'Unlimited In-Browser Playback',
      description: 'Remove preview length limits and enjoy full tracks while studying',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: RefreshCw,
      title: 'Auto-Refresh Playlists',
      description: 'Playlists automatically update based on your mood and time of day',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BarChart3,
      title: 'Advanced Listening Analytics',
      description: 'Detailed heatmaps and time-of-day listening pattern charts',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Wifi,
      title: 'Offline Mode',
      description: 'Access cached tracks during network outages for uninterrupted study',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Bell,
      title: 'Smart Study Reminders',
      description: 'Personalized notifications based on your optimal study times',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Palette,
      title: 'Custom Themes & Colors',
      description: 'Personalize your UI with custom color schemes and themes',
      color: 'from-teal-500 to-green-500'
    },
    {
      icon: Download,
      title: 'Exclusive Resource Downloads',
      description: 'Access premium flashcards, study guides, and educational materials',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Brain,
      title: 'AI-Powered Study Coach',
      description: 'Get personalized study insights and session recommendations',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Headphones,
      title: 'Priority Support',
      description: 'Get priority customer support and early access to new features',
      color: 'from-gray-500 to-slate-500'
    }
  ];

  const pricingPlans = [
    {
      name: 'Monthly Pro',
      price: '₹49',
      period: '/month',
      description: 'Perfect for trying out Pro features',
      popular: false
    },
    {
      name: 'Yearly Pro',
      price: '₹200',
      period: '/year',
      description: 'Best value - Save ₹388 annually!',
      popular: true,
      savings: 'Save 66%'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 dark:from-gray-900 dark:via-yellow-900 dark:to-orange-900 overflow-y-auto">
      <div className="p-4 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Crown className="text-yellow-300 mr-3" size={32} />
            <h1 className="text-3xl font-bold text-white">FocusFlow Pro</h1>
          </div>
          <p className="text-white/90 text-lg mb-2">Unlock Your Full Study Potential</p>
          <div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 rounded-full">
            <Star className="text-yellow-300 mr-2" size={16} />
            <span className="text-yellow-100 text-sm font-medium">Coming Soon</span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white/20 backdrop-blur-lg rounded-2xl p-6 ${
                plan.popular ? 'ring-2 ring-yellow-400 shadow-2xl' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/70 ml-1">{plan.period}</span>
                </div>
                {plan.savings && (
                  <div className="inline-block bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-medium mb-3">
                    {plan.savings}
                  </div>
                )}
                <p className="text-white/80 text-sm mb-4">{plan.description}</p>
                <button
                  disabled
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-50 cursor-not-allowed text-white font-semibold rounded-xl transition-all"
                >
                  Coming Soon
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Pro Features</h2>
          
          {proFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/20 backdrop-blur-lg rounded-2xl p-4"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} flex-shrink-0`}>
                    <IconComponent className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                      <Check className="text-black" size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-6"
        >
          <Zap className="text-yellow-300 mx-auto mb-4" size={48} />
          <h3 className="text-2xl font-bold text-white mb-3">Ready to Supercharge Your Studies?</h3>
          <p className="text-white/80 mb-6">
            Join thousands of students who have transformed their study experience with FocusFlow Pro.
          </p>
          <div className="flex items-center justify-center space-x-4 text-white/70 text-sm">
            <div className="flex items-center">
              <Check className="text-green-400 mr-2" size={16} />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center">
              <Check className="text-green-400 mr-2" size={16} />
              <span>Cancel anytime</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}