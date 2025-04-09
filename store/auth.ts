import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  phone: string | null;
  setPhone: (phone: string) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      phone: null,
      setPhone: (phone: string) => set({ phone }),
      clear: () => set({ phone: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);