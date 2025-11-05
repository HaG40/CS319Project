export interface User {
  id: number;
  name: string;
  email: string;
  role: 'volunteer' | 'organizer';
  created_at: string;
}