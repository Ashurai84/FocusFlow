import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart, Microscope, Activity, ArrowLeft, ExternalLink, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Model3D {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: React.ComponentType<any>;
  color: string;
}

export function MedicalModels() {
  const [selectedModel, setSelectedModel] = useState<Model3D | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const models: Model3D[] = [
    {
      id: 'eye',
      title: 'Human Eye',
      description: 'Explore the anatomy of the human eye in interactive 3D',
      url: 'https://www.body3d.eu/3D/Auge/',
      icon: Eye,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'abdomen',
      title: 'Upper Abdomen',
      description: 'Interactive 3D model of the upper abdominal organs',
      url: 'https://www.body3d.eu/3D/Oberbauch/',
      icon: Activity,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'cells',
      title: 'Cell Structure',
      description: 'Detailed cellular anatomy and organelles in 3D',
      url: 'https://www.body3d.eu/3D/Zelle/',
      icon: Microscope,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'digestive',
      title: 'Gastrointestinal Tract',
      description: 'Complete digestive system anatomy visualization',
      url: 'https://www.body3d.eu/3D/Magendarmtrakt/',
      icon: Heart,
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const openModel = (model: Model3D) => {
    setSelectedModel(model);
  };

  const closeModel = () => {
    setSelectedModel(null);
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 overflow-y-auto">
      <div className="p-4 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center">
            <Link
              to="/"
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors mr-3"
            >
              <ArrowLeft className="text-white" size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">3D Medical Models</h1>
              <p className="text-white/80 text-sm">Interactive anatomy visualization</p>
            </div>
          </div>
        </motion.div>

        {!selectedModel ? (
          /* Model Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {models.map((model, index) => {
              const IconComponent = model.icon;
              return (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-br ${model.color} rounded-2xl p-6 cursor-pointer hover:scale-105 transition-all shadow-lg`}
                  onClick={() => openModel(model)}
                >
                  <div className="flex items-center mb-4">
                    <IconComponent className="text-white mr-3" size={32} />
                    <h3 className="text-xl font-bold text-white">{model.title}</h3>
                  </div>
                  <p className="text-white/90 mb-4">{model.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm">Click to explore</span>
                    <ExternalLink className="text-white/80" size={18} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Model Viewer */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden ${
              isFullscreen ? 'fixed inset-4 z-50' : 'h-96'
            }`}
          >
            {/* Model Header */}
            <div className="flex items-center justify-between p-4 bg-black/20">
              <div className="flex items-center">
                <selectedModel.icon className="text-white mr-3" size={24} />
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedModel.title}</h3>
                  <p className="text-white/80 text-sm">{selectedModel.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <Maximize2 className="text-white" size={18} />
                </button>
                <button
                  onClick={closeModel}
                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                >
                  <ArrowLeft className="text-white" size={18} />
                </button>
              </div>
            </div>

            {/* 3D Model Iframe */}
            <div className={`${isFullscreen ? 'h-[calc(100%-80px)]' : 'h-80'}`}>
              <iframe
                src={selectedModel.url}
                className="w-full h-full border-0"
                title={selectedModel.title}
                allow="fullscreen"
                loading="lazy"
              />
            </div>
          </motion.div>
        )}

        {/* Info Section */}
        {!selectedModel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-white/20 backdrop-blur-lg rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-3">About 3D Medical Models</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              These interactive 3D models are powered by Body3D and provide detailed anatomical 
              visualizations for medical students and healthcare professionals. Each model offers 
              multiple viewing angles, cross-sections, and detailed labeling to enhance your 
              understanding of human anatomy.
            </p>
            <div className="mt-4 flex items-center text-white/60 text-xs">
              <ExternalLink size={14} className="mr-2" />
              <span>Models provided by Body3D.eu</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}