import { create } from "zustand";
import axios from "axios";
import type { Activity } from "../types/Activity";

interface ActivityState {
  activities: Activity[];
  isLoading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  fetchByCategory: (category: string) => Promise<void>;
}

export const useActivityStore = create<ActivityState>((set) => ({
  activities: [],
  isLoading: false,
  error: null,

  // ✅ ดึงกิจกรรมทั้งหมด
  fetchAll: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.get("http://localhost:3000/api/act");
      set({ activities: res.data });
    } catch (err) {
      set({ error: "โหลดข้อมูลล้มเหลว" });
    } finally {
      set({ isLoading: false });
    }
  },

  // ✅ ดึงตามหมวดหมู่
  fetchByCategory: async (category: string) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.get(`http://localhost:3000/api/act/${category}`);
      set({ activities: res.data });
    } catch (err) {
      set({ error: "โหลดข้อมูลล้มเหลว" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
