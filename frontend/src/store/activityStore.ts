/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import axios from "axios";
import type { Activity } from "../types/Activity";

interface ActivityState {
  activities: Activity[];
  registeredActivities: Activity[];
  isLoading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  fetchByCategory: (category: string) => Promise<void>;
  getRegisteredActivity: (userId: string) => Promise<Activity[]>;
  cancelRegistration: (userId: string, activityId: string) => Promise<boolean>;
}

export const useActivityStore = create<ActivityState>((set) => ({
  activities: [],
  registeredActivities: [],
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
      const res = await axios.get(`http://localhost:3000/api/act/category/${category}`);
      set({ activities: res.data });
    } catch (err) {
        set({ error: "โหลดข้อมูลล้มเหลว" });
    } finally {
      set({ isLoading: false });
    }
  },

  getRegisteredActivity: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.get(`http://localhost:3000/api/act/registered/${userId}`);
      set({ registeredActivities: res.data });
      return res.data as Activity[];
    } catch (err) {
      set({ error: "โหลดกิจกรรมที่สมัครล้มเหลว" });
      return [];
    } finally {
      set({ isLoading: false });
    }
  },

  cancelRegistration: async (userId: string, activityId: string) => {
    try {
      set({ isLoading: true, error: null });
      await axios.delete(`http://localhost:3000/api/act/registered/cancel/${userId}/${activityId}`);
      return true;
    } catch (err) {
      set({ error: "ยกเลิกการสมัครล้มเหลว" });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
