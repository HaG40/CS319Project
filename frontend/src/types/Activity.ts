export interface Activity {
  id: number;
  title: string;
  description: string;
  category: string;           // เช่น "สิ่งแวดล้อม", "เด็ก", "สัตว์", ฯลฯ
  location: string;
  date: string;               // ISO date string (ex: "2025-11-05")
  time: string;               // ex: "09:00 - 15:00"
  slots: number;              // จำนวนอาสาที่เปิดรับ
  organizer_id: number;       // FK → users.id
  created_at: string;         // timestamp
  organizer?: {
    id: number;
    name: string;
    email?: string;
  };                          // optional: ข้อมูลผู้จัดกิจกรรม (สำหรับหน้า detail)
  registrations_count?: number; // จำนวนผู้สมัคร (optional)
}
