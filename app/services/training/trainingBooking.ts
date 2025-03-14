//app/services/training/trainingBooking.ts
"use server";

import { PrismaClient } from "@prisma/client";
import { TrainingBookingData, NewTrainingBookingData } from "@/app/types";

const prisma = new PrismaClient();

// Action 1: Store a Training Booking
export async function storeTrainingBooking(
  data: NewTrainingBookingData
): Promise<TrainingBookingData> {
  const {
    name,
    phoneNumber,
    email,
    startDate,
    preferredDays,
    petType,
    petName,
    petBreed,
    petGender,
    petSize,
    petAggression,
    petAge,
    city,
    address,
    packageTitle,
    packagePrice,
    userId,
    sessionsPerWeek, // Added
  } = data;

  try {
    const trainingBooking = await prisma.trainingBooking.create({
      data: {
        name,
        phoneNumber,
        email,
        startDate: new Date(startDate),
        preferredDays: preferredDays.join(","), // Store as comma-separated string
        petType,
        petName,
        petBreed,
        petGender,
        petSize,
        petAggression,
        petAge,
        city,
        address,
        packageTitle,
        packagePrice,
        status: "Scheduled",
        userId,
        sessionsPerWeek,           // Added
        sessionsCompleted: 0,      // Default value
      },
    });

    return {
      ...trainingBooking,
      preferredDays: trainingBooking.preferredDays.split(","), // Convert back to array
    };
  } catch (error) {
    console.error("Error creating training booking:", error);
    throw new Error("Error creating training booking");
  }
}

// Action 2: Fetch Training Bookings
export async function fetchTrainingBookings(): Promise<TrainingBookingData[]> {
  try {
    const trainingBookings = await prisma.trainingBooking.findMany();
    return trainingBookings.map((booking) => ({
      ...booking,
      preferredDays: booking.preferredDays.split(","), // Convert back to array
    }));
  } catch (error) {
    throw new Error("Error fetching training bookings");
  }
}

// Action 3: Fetch Booked Days for a Specific Start Date and City
export async function fetchTrainingBookedDays(
  startDate: Date,
  city: string
): Promise<{ [key: string]: string[] }> {
  try {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1); // Look ahead one month

    const bookings = await prisma.trainingBooking.findMany({
      where: {
        city: { equals: city },
        startDate: {
          gte: start,
          lte: end,
        },
      },
      select: { startDate: true, preferredDays: true },
    });

    const bookedDays: { [key: string]: string[] } = {};
    bookings.forEach((booking) => {
      const dateKey = booking.startDate.toISOString().split("T")[0];
      const days = booking.preferredDays.split(",");
      if (bookedDays[dateKey]) {
        bookedDays[dateKey] = [...new Set([...bookedDays[dateKey], ...days])];
      } else {
        bookedDays[dateKey] = days;
      }
    });

    return bookedDays;
  } catch (error) {
    throw new Error("Error fetching booked days");
  }
}

// Action 4: Update Training Booking Status
export async function updateTrainingBookingStatus(
  id: number,
  status: string
): Promise<TrainingBookingData> {
  try {
    const updatedBooking = await prisma.trainingBooking.update({
      where: { id },
      data: { status },
    });
    return {
      ...updatedBooking,
      preferredDays: updatedBooking.preferredDays.split(","),
    };
  } catch (error) {
    throw new Error("Error updating training booking status");
  }
}

// New Action: Update Sessions Completed
export async function updateTrainingSessionsCompleted(
  id: number,
  sessionsCompleted: number
): Promise<TrainingBookingData> {
  try {
    const updatedBooking = await prisma.trainingBooking.update({
      where: { id },
      data: { sessionsCompleted },
    });
    return {
      ...updatedBooking,
      preferredDays: updatedBooking.preferredDays.split(","),
    };
  } catch (error) {
    console.error("Error updating sessions completed:", error);
    throw new Error("Error updating sessions completed");
  }
}

// Action 5: Fetch Training Bookings for a Specific User
export async function fetchTrainingBookingsForUser(
  userId: string
): Promise<TrainingBookingData[]> {
  try {
    const trainingBookings = await prisma.trainingBooking.findMany({
      where: { userId },
    });
    return trainingBookings.map((booking) => ({
      ...booking,
      preferredDays: booking.preferredDays.split(","),
    }));
  } catch (error) {
    throw new Error("Error fetching training bookings for user");
  }
}

// Action 6: Delete a Training Booking
export async function deleteTrainingBooking(id: number): Promise<TrainingBookingData> {
  try {
    const deletedBooking = await prisma.trainingBooking.delete({
      where: { id },
    });
    return {
      ...deletedBooking,
      preferredDays: deletedBooking.preferredDays.split(","),
    };
  } catch (error) {
    throw new Error("Error deleting training booking");
  }
}