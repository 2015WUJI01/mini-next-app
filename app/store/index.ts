import { create } from 'zustand';
import { Problem, User, UserSettings, Submission } from '../types';
import { saveUser, getUser } from '../lib/storage';

interface AppState {
  // 用户相关
  user: User | null;
  setUser: (user: User) => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  
  // 问题相关
  currentProblem: Problem | null;
  setCurrentProblem: (problem: Problem | null) => void;
  
  // 提交相关
  currentSubmission: Submission | null;
  setCurrentSubmission: (submission: Submission | null) => void;
  
  // 主题相关
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // 用户相关
  user: null,
  setUser: (user) => {
    saveUser(user);
    set({ user });
  },
  updateUserSettings: (settings) => {
    set((state) => {
      if (!state.user) return state;
      const newUser = {
        ...state.user,
        settings: { ...state.user.settings, ...settings },
      };
      saveUser(newUser);
      return { user: newUser };
    });
  },
  
  // 问题相关
  currentProblem: null,
  setCurrentProblem: (problem) => set({ currentProblem: problem }),
  
  // 提交相关
  currentSubmission: null,
  setCurrentSubmission: (submission) => set({ currentSubmission: submission }),
  
  // 主题相关
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
})); 