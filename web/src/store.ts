import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, ModuleId } from './types';

interface AppState {
  user: User | null;
  token: string | null;
  activeModule: ModuleId;
  viewMode: '2D' | '3D';
  epochIndex: number;
  login: (user: User, token: string) => void;
  logout: () => void;
  setModule: (m: ModuleId) => void;
  setView: (v: '2D' | '3D') => void;
  setEpoch: (i: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      activeModule: 'M5',
      viewMode: '3D',
      epochIndex: 5,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      setModule: (activeModule) => set({ activeModule }),
      setView: (viewMode) => set({ viewMode }),
      setEpoch: (epochIndex) => set({ epochIndex }),
    }),
    { name: 'sanjaya-store', partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);
