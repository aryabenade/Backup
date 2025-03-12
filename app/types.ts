// types.ts in app/

// export interface Pet {
//   id?: number;
//   name: string;
//   petBreed: string;
//   age: number;
//   ageUnit: string;
//   petType: string;
//   state: string;
//   city: string;
//   contact: string;
//   image: string | null;
//   userId: string;
//   createdAt?: Date;  // Add this field
// }

// app/types.ts
export interface Pet {
  id?: number; // Optional, as it’s assigned by the database
  name: string;
  age: number;
  ageUnit: string;
  petType: string;
  petBreed: string;
  state: string;
  city: string;
  contact: string;
  image: string | null; // Nullable if no image is uploaded
  userId: string;
  gender: 'Male' | 'Female'; // Restrict to these values
  isVaccinated: boolean;
  shotsUpToDate: string; // Could be a date string or details
  isNeutered: boolean | null; // Nullable for non-dogs
  isSpayed: boolean | null; // Nullable for non-cats
  goodWithDogs: boolean | null; // Nullable
  goodWithCats: boolean | null; // Nullable
  goodWithKids: boolean | null; // Nullable
  reasonForRehoming: string;
  createdAt?: Date; // Optional, set by the database
  updatedAt?: Date; // Optional, set by the database
}

export interface GroomingBookingData {
  id: number; // Add id field here
  name: string;
  phoneNumber:string;
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
  city: string;
  address: string;
  packageTitle: string;
  packagePrice: string;
  status: string;
  userId: string; // Add this field
}

export interface NewGroomingBookingData {
  name: string;
  phoneNumber:string;
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
  city: string;
  address: string;
  packageTitle: string;
  packagePrice: string;
  userId: string; // Add this field
}

// Adding Vet Booking Interfaces
export interface VetBookingData {
  id: number;
  name: string;
  phoneNumber:string;
  email: string;
  date: Date;
  timeSlot: string;
  consultationType: string;
  petType: string;
  petIssues: string;
  medicalAttention: string;
  city: string;
  address: string;
  packageTitle: string;
  packagePrice: string;
  status: string;
  userId: string; // Add this field
}

export interface NewVetBookingData {
  name: string;
  phoneNumber:string;
  email: string;
  date: Date;
  timeSlot: string;
  consultationType: string;
  petType: string;
  petIssues: string[];
  medicalAttention: string;
  city: string;
  address: string;
  packageTitle: string;
  packagePrice: string;
  userId: string; // Add this field
}

// Path: app/types.ts
export interface AdoptionRequest {
  id: number;
  petId: number;
  adopterId: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  residenceType: string;
  state: string;
  city: string;
  createdAt: Date; // Change from string to Date
  updatedAt: Date; // Change from string to Date
  profileImage?: string|null// Add this field
  pet?: {
    userId: string;
    name:string,
  };
}

export interface NewAdoptionRequest {
  petId: number;
  adopterId: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  residenceType: string;
  state: string;
  city: string;
  profileImage?: string|null // Add this field
}

// app/types.ts
export interface State {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
}

// app/types.ts
export interface Notification {
  id: number;
  message: string;
  userId: string;
  petId: number;
  createdAt: Date;
  read: boolean; // Add this field
}

export interface TrainingBookingData {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  startDate: Date;
  preferredDays: string[];
  petType: string;
  petName: string;
  petBreed: string;
  petGender: string;
  petSize: string;
  petAggression: string;
  petAge: string;
  city: string;
  address: string;
  packageTitle: string;
  packagePrice: string;
  status: string;
  userId: string;
  sessionsPerWeek: number;   // Added
  sessionsCompleted: number; // Added
}

export interface NewTrainingBookingData {
  name: string;
  phoneNumber: string;
  email: string;
  startDate: Date;
  preferredDays: string[];
  petType: string;
  petName: string;
  petBreed: string;
  petGender: string;
  petSize: string;
  petAggression: string;
  petAge: string;
  city: string;
  address: string;
  packageTitle: string;
  packagePrice: string;
  userId: string;
  sessionsPerWeek: number;   // Added
}