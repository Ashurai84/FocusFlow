import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Beaker, Stethoscope, Palette, Code, BookOpen, Play, Pause, Volume2 } from 'lucide-react';
import { EngineeringCalculator } from '../components/tools/EngineeringCalculator';
import { MedicalVitalsTracker } from '../components/tools/MedicalVitalsTracker';

export function FieldSpecific() {
  const [selectedField, setSelectedField] = useState<string>('engineering');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const fields = {
    engineering: {
      name: 'Engineering',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      tools: [
        {
          id: 'calculator',
          name: 'Engineering Calculator',
          description: 'Advanced scientific calculator with engineering functions, unit conversions, and calculation history',
          type: 'calculator'
        },
        {
          id: 'converter',
          name: 'Unit Converter',
          description: 'Convert between different units of measurement for engineering applications',
          type: 'converter'
        },
        {
          id: 'circuit',
          name: 'Circuit Analysis Tool',
          description: 'Analyze basic electrical circuits and calculate voltage, current, and resistance',
          type: 'circuit'
        }
      ]
    },
    medical: {
      name: 'Medical',
      icon: Stethoscope,
      color: 'from-red-500 to-pink-500',
      tools: [
        {
          id: 'anatomy',
          name: 'Vital Signs Tracker',
          description: 'Monitor and track patient vital signs with real-time analysis and alerts',
          type: 'anatomy'
        },
        {
          id: 'drug-calc',
          name: 'Drug Dosage Calculator',
          description: 'Calculate accurate drug dosages based on patient weight, age, and condition',
          type: 'drug-calc'
        },
        {
          id: 'bmi-calc',
          name: 'BMI & Health Calculator',
          description: 'Calculate BMI, body fat percentage, and other health metrics',
          type: 'bmi-calc'
        }
      ]
    },
    science: {
      name: 'Science',
      icon: Beaker,
      color: 'from-green-500 to-emerald-500',
      tools: [
        {
          id: 'periodic-table',
          name: 'Interactive Periodic Table',
          description: 'Explore elements and their properties',
          type: 'periodic-table'
        },
        {
          id: 'molecule-viewer',
          name: '3D Molecule Viewer',
          description: 'Visualize molecular structures in 3D',
          type: 'molecule'
        },
        {
          id: 'lab-simulator',
          name: 'Virtual Lab',
          description: 'Conduct virtual chemistry experiments',
          type: 'lab-simulator'
        }
      ]
    },
    arts: {
      name: 'Arts',
      icon: Palette,
      color: 'from-purple-500 to-indigo-500',
      tools: [
        {
          id: 'color-wheel',
          name: 'Color Theory Wheel',
          description: 'Explore color relationships and harmonies',
          type: 'color-wheel'
        },
        {
          id: 'sketch-pad',
          name: 'Digital Sketch Pad',
          description: 'Practice drawing and sketching digitally',
          type: 'sketch-pad'
        },
        {
          id: 'art-history',
          name: 'Art History Timeline',
          description: 'Interactive timeline of art movements',
          type: 'art-history'
        }
      ]
    }
  };

  const renderTool = (toolType: string) => {
    switch (toolType) {
      case 'calculator':
        return <EngineeringCalculator />;
      case 'anatomy':
        return <MedicalVitalsTracker />;
      default:
        return (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code size={32} className="text-white/60" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Tool Coming Soon</h3>
            <p className="text-white/60 max-w-md mx-auto">
              This advanced tool is currently under development. Check back soon for updates!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 overflow-y-auto">
      <div className="p-4 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Field-Specific Tools</h1>
          <p className="text-white/80 text-sm">Interactive tools for your field of study</p>
        </motion.div>

        {/* Field Selector */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {Object.entries(fields).map(([key, field]) => {
            const IconComponent = field.icon;
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedField(key);
                  setSelectedTool(null);
                }}
                className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  selectedField === key
                    ? 'bg-white/30 text-white shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <IconComponent size={16} className="mr-2" />
                {field.name}
              </button>
            );
          })}
        </div>

        {/* Tools Grid */}
        {!selectedTool ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields[selectedField as keyof typeof fields].tools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${fields[selectedField as keyof typeof fields].color} rounded-2xl p-6 cursor-pointer hover:scale-105 transition-all shadow-lg`}
                onClick={() => setSelectedTool(tool.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex-1">{tool.name}</h3>
                  <Play className="text-white/80 flex-shrink-0 ml-2" size={20} />
                </div>
                <p className="text-white/90 mb-4 text-sm leading-relaxed">{tool.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm font-medium">Click to launch →</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Tool View */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                {fields[selectedField as keyof typeof fields].tools.find(t => t.id === selectedTool)?.name}
              </h3>
              <button
                onClick={() => setSelectedTool(null)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-colors font-medium"
              >
                ← Back to Tools
              </button>
            </div>
            {renderTool(fields[selectedField as keyof typeof fields].tools.find(t => t.id === selectedTool)?.type || '')}
          </motion.div>
        )}
      </div>
    </div>
  );
}

