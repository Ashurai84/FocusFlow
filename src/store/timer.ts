import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TimerStore {
  time: number;
  isActive: boolean;
  isBreak: boolean;
  sessions: number;
  totalStudyTime: number;
  studyStreak: number;
  lastStudyDate: string | null;
  setTime: (time: number) => void;
  setIsActive: (active: boolean) => void;
  setIsBreak: (isBreak: boolean) => void;
  incrementSessions: () => void;
  addStudyTime: (minutes: number) => void;
  resetTimer: () => void;
  initializeTimer: () => void;
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      time: 25 * 60,
      isActive: false,
      isBreak: false,
      sessions: 0,
      totalStudyTime: 0,
      studyStreak: 0,
      lastStudyDate: null,
      setTime: (time) => set({ time }),
      setIsActive: (isActive) => set({ isActive }),
      setIsBreak: (isBreak) => set({ isBreak }),
      incrementSessions: () => {
        const state = get();
        const today = new Date().toDateString();
        let newStreak = state.studyStreak;
        
        if (state.lastStudyDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (state.lastStudyDate === yesterday.toDateString()) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }
        }
        
        set({
          sessions: state.sessions + 1,
          studyStreak: newStreak,
          lastStudyDate: today,
        });
      },
      addStudyTime: (minutes) => {
        set((state) => ({
          totalStudyTime: state.totalStudyTime + minutes,
        }));
      },
      resetTimer: () => {
        set({
          time: 25 * 60,
          isActive: false,
          isBreak: false,
        });
      },
      initializeTimer: () => {
        const today = new Date().toDateString();
        const state = get();
        
        if (state.lastStudyDate && state.lastStudyDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (state.lastStudyDate !== yesterday.toDateString()) {
            set({ studyStreak: 0 });
          }
        }
      },
    }),
    {
      name: 'timer-storage',
    }
  )
);