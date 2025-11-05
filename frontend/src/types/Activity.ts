export interface Activity {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  time: string;
  slots: number;
  occupied?: number;
  organizer: string;
}
