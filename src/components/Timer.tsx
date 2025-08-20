import React, { useEffect } from 'react';
import { Play, Pause, RefreshCw, Plus, Minus, Coffee, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimerStore } from '../store/timer';

export function Timer() {
  const {
    time,
    isActive,
    isBreak,
    sessions,
    setTime,
    setIsActive,
    setIsBreak,
    incrementSessions,
    addStudyTime,
    resetTimer
  } = useTimerStore();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;  // ✅ Fixed: Correct type declaration

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      if (!isBreak) {
        incrementSessions();
        addStudyTime(25);
        setIsBreak(true);
        setTime(5 * 60);
      } else {
        setIsBreak(false);
        setTime(25 * 60);
      }
    }

    return () => {
      if (interval) {  // ✅ Added safety check
        clearInterval(interval);
      }
    };
  }, [isActive, time, isBreak, setTime, setIsActive, setIsBreak, incrementSessions, addStudyTime]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const adjustTime = (minutes: number) => {
    if (!isActive) {
      setTime(Math.max(60, time + minutes * 60));
    }
  };

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const progress = isBreak 
    ? ((5 * 60 - time) / (5 * 60)) * 100
    : ((25 * 60 - time) / (25 * 60)) * 100;

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex items-center justify-center mb-4"
      >
        <Target className="text-white/80 mr-2" size={20} />
        <span className="text-white/80 text-sm">Sessions: {sessions}</span>
      </motion.div>

      <div className="relative mb-6">
        <motion.div
          className="w-32 h-32 mx-auto rounded-full border-4 border-white/20 flex items-center justify-center relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            className={`absolute inset-0 rounded-full border-4 ${
              isBreak ? 'border-green-400' : 'border-blue-400'
            }`}
            style={{
              background: `conic-gradient(${
                isBreak ? '#4ade80' : '#60a5fa'
              } ${progress * 3.6}deg, transparent 0deg)`
            }}
            animate={{ rotate: isActive ? 360 : 0 }}
            transition={{ duration: 2, repeat: isActive ? Infinity : 0, ease: "linear" }}
          />
          
          <div className="relative z-10 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${minutes}-${seconds}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-2xl font-bold text-white tabular-nums"
              >
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </motion.div>
            </AnimatePresence>
            <div className="text-white/60 text-xs mt-1">
              {isBreak ? 'Break Time' : 'Focus Time'}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-center space-x-3 mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => adjustTime(-5)}
          disabled={isActive}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Minus size={18} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTimer}
          className={`p-4 rounded-full text-white shadow-lg transition-all ${
            isBreak 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isActive ? <Pause size={24} /> : <Play size={24} />}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => adjustTime(5)}
          disabled={isActive}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Plus size={18} />
        </motion.button>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={resetTimer}
        className="flex items-center justify-center mx-auto px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-all"
      >
        <RefreshCw size={16} className="mr-2" />
        Reset
      </motion.button>

      <AnimatePresence>
        {isBreak && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 flex items-center justify-center text-green-300"
          >
            <Coffee size={16} className="mr-2" />
            <span className="text-sm">Take a break! You've earned it.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Timer;
