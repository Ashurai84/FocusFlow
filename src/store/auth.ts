import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User as FirebaseUser } from 'firebase/auth';
import { authService } from '../services/auth';
import { User } from '../lib/firebase';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  needsFieldSelection: boolean;
  initialize: () => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  setNeedsFieldSelection: (needs: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: true,
      needsFieldSelection: false,
      
      initialize: async () => {
        try {
          // Listen for auth state changes
          authService.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
              const profile = await authService.getCurrentUser();
              if (profile) {
                set({ 
                  user: profile,
                  isAuthenticated: true,
                  needsFieldSelection: profile.fieldOfStudy === 'General' && !profile.fieldOfStudy
                });
              }
            } else {
              set({ user: null, isAuthenticated: false, needsFieldSelection: false });
            }
            set({ loading: false });
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ loading: false });
        }
      },
      
      logout: async () => {
        try {
          await authService.logout();
          set({ user: null, isAuthenticated: false, needsFieldSelection: false });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },
      
      updateProfile: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
      
      setNeedsFieldSelection: (needs) => {
        set({ needsFieldSelection: needs });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Only persist essential data, not sensitive info
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);