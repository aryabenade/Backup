// types.ts in app/

export interface Pet {
  id?: number;
  name: string;
  breed: string;
  age: number;
  category: string;
  state: string;
  city: string;
  contact: string;
  image: string | null;
  userId: string; // Add this field
}
