export interface Participant {
  userId: string;
  participants: {
    fullname: string;
    email: string;
    phone: string;
    line: string;
    age: number;
  };
}
