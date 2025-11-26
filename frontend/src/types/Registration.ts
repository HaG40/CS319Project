import type { Activity } from "./Activity";

export interface Registration {
  id: number;
  user_id: number;
  activity_id: number;
  registered_at: string;
  activity?: Activity;
}