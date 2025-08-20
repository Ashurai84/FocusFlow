import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Video, FileText, ExternalLink, Star, Search, Filter, Download } from 'lucide-react';

interface Resource {
  id: number;
  type: 'book' | 'video' | 'guide' | 'tool';
  title: string;
  description: string;
  rating: number;
  category: string;
  url: string;
  free: boolean;
}

export function Resources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const resources: Resource[] = [
    {
      id: 1,
      type: 'book',
      title: 'Deep Work: Rules for Focused Success',
      description: 'Learn how to develop your concentration skills and achieve more in less time.',
      rating: 4.8,
      category: 'Productivity',
      url: 'https://www.amazon.com/Deep-Work-Focused-Success-Distracted/dp/1455586692',
      free: false
    },
    {
      id: 2,
      type: 'video',
      title: 'Khan Academy - Mathematics',
      description: 'Free comprehensive math courses from basic to advanced levels.',
      rating: 4.9,
      category: 'Mathematics',
      url: 'https://www.khanacademy.org/math',
      free: true
    },
    {
      id: 3,
      type: 'guide',
      title: 'Cornell Note-Taking System',
      description: 'Master the most effective note-taking method used by top students.',
      rating: 4.7,
      category: 'Study Skills',
      url: 'https://lsc.cornell.edu/how-to-study/taking-notes/cornell-note-taking-system/',
      free: true
    },
    {
      id: 4,
      type: 'tool',
      title: 'Anki Flashcards',
      description: 'Spaced repetition software for efficient memorization.',
      rating: 4.6,
      category: 'Study Tools',
      url: 'https://apps.ankiweb.net/',
      free: true
    },
    {
      id: 5,
      type: 'video',
      title: 'Crash Course - Science',
      description: 'Engaging video series covering various science topics.',
      rating: 4.8,
      category: 'Science',
      url: 'https://www.youtube.com/user/crashcourse',
      free: true
    }
  ];

  const categories = ['All', 'Productivity', 'Mathematics', 'Study Skills', 'Study Tools', 'Science'];

  const getIcon = (type: string) => {
    switch (type) {
      case 'book':
        return <Book className="text-blue-400" size={20} />;
      case 'video':
        return <Video className="text-red-400" size={20} />;
      case 'guide':
        return <FileText className="text-green-400" size={20} />;
      case 'tool':
        return <Download className="text-purple-400" size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 dark:from-gray-900 dark:via-orange-900 dark:to-red-900 overflow-y-auto">
      <div className="p-4 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center mb-2">
            <Book className="text-orange-300 mr-2" size={24} />
            <h1 className="text-2xl font-bold text-white">Resources</h1>
          </div>
          <p className="text-white/80 text-sm">Curated learning materials</p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 mb-6 space-y-3"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={18} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white placeholder-white/60 border border-white/30 focus:border-white/60 focus:outline-none"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-white/60" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white border border-white/30 focus:border-white/60 focus:outline-none"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-gray-800">
                  {category}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Resources Grid */}
        <div className="space-y-4">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/20 backdrop-blur-lg rounded-2xl p-4"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-white/20">
                  {getIcon(resource.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white text-sm truncate">
                      {resource.title}
                    </h3>
                    {resource.free && (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                        Free
                      </span>
                    )}
                  </div>
                  
                  <p className="text-white/80 text-xs mb-3 line-clamp-2">
                    {resource.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center text-yellow-400">
                        <Star size={14} fill="currentColor" />
                        <span className="ml-1 text-xs text-white">{resource.rating}</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white/80">
                        {resource.category}
                      </span>
                    </div>
                    
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs transition-colors"
                    >
                      <ExternalLink size={12} className="mr-1" />
                      Open
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <Search className="text-white/40 mx-auto mb-3" size={48} />
            <p className="text-white/60">No resources found. Try a different search term.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}