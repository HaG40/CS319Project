export interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  start_date: string;
  end_date: string;
  slots: number;
  occupied?: number;
  organizer: string;
  image?: string;
}
