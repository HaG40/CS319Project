import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import type { User } from "../types/User";

interface UserState {
  user: User | null;
  isAuthenticated: boolean;

  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string,fname: string,lname: string,email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      // ✅ LOGIN
      login: async (username, password) => {
        try {
          const res = await axios.post(
            "http://localhost:3000/api/user/login",
            { username, password },
            { withCredentials: true }
          );

          set({
            user: res.data.user,
            isAuthenticated: true,
          });

          return true;
        } catch {
          return false;
        }
      },
      
      register: async (username, fname, lname, email, password) => {
        try {
          const res = await axios.post(
            "http://localhost:3000/api/user/register",
            { username, fname, lname, email, password },
            { withCredentials: true }
          );
          set({
            user: res.data.user,
            isAuthenticated: true,
          });
          return true;
        } catch {
          return false;
        }
      },

      // ✅ LOGOUT
      logout: async () => {
        await axios.post(
          "http://localhost:3000/api/user/logout",
          {},
          { withCredentials: true }
        );
        set({ user: null, isAuthenticated: false });
      },

      // ✅ CHECK AUTH
      checkAuth: async () => {
        try {
          const res = await axios.get("http://localhost:3000/api/user/me", {
            withCredentials: true,
          });

          set({
            user: res.data,
            isAuthenticated: true,
          });
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "user-store",
    }
  )
);
