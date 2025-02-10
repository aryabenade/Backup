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

export interface GroomingBookingData {
  id: number; // Add id field here
  name: string;
  email: string;
  date: Date;
  timeSlot: string;
  petType: string;
  petName: string;
  petBreed: string;
  petGender: string;
  petSize: string;
  petAggression: string;
  petAge: string;
  address: string;
  packageTitle: string;
  packagePrice: string;
  status: string;
}

export interface NewGroomingBookingData {
  name: string;
  email: string;
  date: Date;
  timeSlot: string;
  petType: string;
  petName: string;
  petBreed: string;
  petGender: string;
  petSize: string;
  petAggression: string;
  petAge: string;
  address: string;
  packageTitle: string;
  packagePrice: string;
}

// Adding Vet Booking Interfaces
export interface VetBookingData {
  id: number;
  name: string;
  email: string;
  date: Date;
  timeSlot: string;
  consultationType: string;
  petType: string;
  petIssues: string;
  medicalAttention: string;
  packageTitle: string;
  packagePrice: string;
  status: string;
}

export interface NewVetBookingData {
  name: string;
  email: string;
  date: Date;
  timeSlot: string;
  consultationType: string;
  petType: string;
  petIssues: string[];
  medicalAttention: string;
  packageTitle: string;
  packagePrice: string;
}
