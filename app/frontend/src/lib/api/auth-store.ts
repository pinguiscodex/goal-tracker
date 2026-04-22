import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "./client";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (username: string, password: string) => {
        const response = await api.post<{ accessToken: string; user: User }>(
          "auth/login",
          { identifier: username, password }
        );
        set({
          user: response.user,
          token: response.accessToken,
          isAuthenticated: true,
        });
      },

      register: async (username: string, email: string, password: string) => {
        const response = await api.post<{ accessToken: string; user: User }>(
          "auth/register",
          { username, email, password }
        );
        set({
          user: response.user,
          token: response.accessToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) return false;

        try {
          const user = await api.get<User>("auth/me", token);
          set({ user, isAuthenticated: true });
          return true;
        } catch {
          set({ user: null, token: null, isAuthenticated: false });
          return false;
        }
      },
    }),
    {
      name: "goal-tracker-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
