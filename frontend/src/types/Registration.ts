import type { Activity } from "./Activity";

export interface Registration {
  id: number;
  user_id: number;
  activity_id: number;
  status: 'pending' | 'approved' | 'cancelled';
  registered_at: string;
  activity?: Activity;
}