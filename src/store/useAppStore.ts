import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, CoupletResponse, FortuneCard } from '../types';

interface AppStore extends AppState {
  setPage: (page: AppState['currentPage']) => void;
  addCoupletHistory: (couplet: CoupletResponse) => void;
  addFortuneHistory: (fortune: FortuneCard) => void;
  toggleSound: () => void;
  toggleAnimation: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      currentPage: 'home',
      coupletHistory: [],
      fortuneHistory: [],
      settings: {
        soundEnabled: true,
        animationEnabled: true,
      },
      setPage: (page) => set({ currentPage: page }),
      addCoupletHistory: (couplet) =>
        set((state) => ({ coupletHistory: [couplet, ...state.coupletHistory] })),
      addFortuneHistory: (fortune) =>
        set((state) => ({ fortuneHistory: [fortune, ...state.fortuneHistory] })),
      toggleSound: () =>
        set((state) => ({
          settings: { ...state.settings, soundEnabled: !state.settings.soundEnabled },
        })),
      toggleAnimation: () =>
        set((state) => ({
          settings: { ...state.settings, animationEnabled: !state.settings.animationEnabled },
        })),
    }),
    {
      name: 'ai-new-year-storage',
    }
  )
);
