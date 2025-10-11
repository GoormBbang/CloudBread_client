import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, User } from '../api/types/user';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  signIn: (data: AuthResponse) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 초기 상태
      accessToken: null,
      refreshToken: null,
      user: null,
      // 상태 변경
      signIn: (data) => set({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      }),
      signOut: () => set({
        accessToken: null,
        refreshToken: null,
        user: null,
      }),
    }),
    {
      // 설정
      name: 'auth-storage', // AsyncStorage에 저장될 키 이름
      storage: createJSONStorage(() => AsyncStorage), // 사용할 스토리지
    }
  )
);