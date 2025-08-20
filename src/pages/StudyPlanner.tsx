import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, Clock, CheckCircle, Circle, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  timeEstimate: number;
}

export function StudyPlanner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [timeEstimate, setTimeEstimate] = useState(25);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask,
        completed: false,
        timeEstimate
      };
      setTasks([...tasks, task]);
      setNewTask('');
      setTimeEstimate(25);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTime = tasks.reduce((sum, task) => sum + task.timeEstimate, 0);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 dark:from-gray-900 dark:via-green-900 dark:to-blue-900 overflow-y-auto">
      <div className="p-4 pb-20 space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-white mb-2">Study Planner</h1>
          <p className="text-white/80 text-sm">Plan your study sessions</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/20 backdrop-blur-lg rounded-xl p-3 text-center"
          >
            <Target className="text-blue-300 mx-auto mb-1" size={20} />
            <div className="text-lg font-bold text-white">{tasks.length}</div>
            <div className="text-white/80 text-xs">Tasks</div>
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/20 backdrop-blur-lg rounded-xl p-3 text-center"
          >
            <CheckCircle className="text-green-300 mx-auto mb-1" size={20} />
            <div className="text-lg font-bold text-white">{completedTasks}</div>
            <div className="text-white/80 text-xs">Done</div>
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/20 backdrop-blur-lg rounded-xl p-3 text-center"
          >
            <Clock className="text-yellow-300 mx-auto mb-1" size={20} />
            <div className="text-lg font-bold text-white">{totalTime}m</div>
            <div className="text-white/80 text-xs">Total</div>
          </motion.div>
        </div>

        {/* Add Task Form */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/20 backdrop-blur-lg rounded-2xl p-4"
        >
          <form onSubmit={addTask} className="space-y-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What do you want to study?"
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white placeholder-white/60 border border-white/30 focus:border-white/60 focus:outline-none"
            />
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 flex-1">
                <Clock className="text-white/60" size={16} />
                <input
                  type="number"
                  value={timeEstimate}
                  onChange={(e) => setTimeEstimate(parseInt(e.target.value) || 25)}
                  min="5"
                  max="120"
                  className="w-16 px-2 py-1 bg-white/20 rounded-lg text-white text-center text-sm border border-white/30 focus:border-white/60 focus:outline-none"
                />
                <span className="text-white/80 text-sm">min</span>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Add
              </button>
            </div>
          </form>
        </motion.div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white/20 backdrop-blur-lg rounded-xl p-4 flex items-center space-x-3 ${
                task.completed ? 'opacity-75' : ''
              }`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className="text-white hover:text-green-300 transition-colors"
              >
                {task.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
              </button>
              
              <div className="flex-1 min-w-0">
                <p className={`text-white ${task.completed ? 'line-through opacity-75' : ''}`}>
                  {task.text}
                </p>
                <div className="flex items-center text-white/60 text-xs mt-1">
                  <Clock size={12} className="mr-1" />
                  {task.timeEstimate} min
                </div>
              </div>
              
              <button
                onClick={() => deleteTask(task.id)}
                className="text-white/60 hover:text-red-300 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <Target className="text-white/40 mx-auto mb-3" size={48} />
            <p className="text-white/60">No tasks yet. Add your first study goal!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}