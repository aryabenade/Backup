//app/services/walking/walkingBooking.ts
"use server";

import { PrismaClient } from "@prisma/client";
import { WalkingBookingData, NewWalkingBookingData } from "@/app/types";

const prisma = new PrismaClient();

export async function storeWalkingBooking(data: NewWalkingBookingData): Promise<WalkingBookingData> {
  const { name, phoneNumber, email, startDate, endDate, timeSlot, daysOfWeek, walkDuration, petType, petName, petBreed, petGender, energyLevel, leashBehavior, petAge, city, address, totalWalks, totalCost, userId, packageTitle } = data;

  try {
    const walkingBooking = await prisma.walkingBooking.create({
      data: {
        name,
        phoneNumber,
        email,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        timeSlot,
        daysOfWeek: daysOfWeek.join(","),
        walkDuration,
        petType: "Dog", // Hardcoded to Dog
        petName,
        petBreed,
        petGender,
        energyLevel,
        leashBehavior,
        petAge,
        city,
        address,
        totalWalks,
        walksCompleted: 0,
        totalCost,
        status: "Scheduled",
        userId,
        packageTitle, // Added
      },
    });

    return { ...walkingBooking, daysOfWeek: walkingBooking.daysOfWeek.split(",") };
  } catch (error) {
    console.error("Error creating walking booking:", error);
    throw new Error("Error creating walking booking");
  }
}

// No changes needed for other functions since they fetch all fields dynamically
export async function fetchWalkingBookings(): Promise<WalkingBookingData[]> {
  try {
    const walkingBookings = await prisma.walkingBooking.findMany();
    return walkingBookings.map((booking) => ({
      ...booking,
      daysOfWeek: booking.daysOfWeek.split(","),
    }));
  } catch (error) {
    throw new Error("Error fetching walking bookings");
  }
}

export async function fetchWalkingBookedDays(startDate: Date, city: string): Promise<{ [key: string]: string[] }> {
  try {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const bookings = await prisma.walkingBooking.findMany({
      where: { city: { equals: city }, startDate: { gte: start, lte: end } },
      select: { startDate: true, daysOfWeek: true },
    });

    const bookedDays: { [key: string]: string[] } = {};
    bookings.forEach((booking) => {
      const dateKey = booking.startDate.toISOString().split("T")[0];
      const days = booking.daysOfWeek.split(",");
      if (bookedDays[dateKey]) bookedDays[dateKey] = [...new Set([...bookedDays[dateKey], ...days])];
      else bookedDays[dateKey] = days;
    });

    return bookedDays;
  } catch (error) {
    throw new Error("Error fetching booked days");
  }
}

export async function updateWalkingBookingStatus(id: number, status: string): Promise<WalkingBookingData> {
  try {
    const updatedBooking = await prisma.walkingBooking.update({
      where: { id },
      data: { status },
    });
    return { ...updatedBooking, daysOfWeek: updatedBooking.daysOfWeek.split(",") };
  } catch (error) {
    throw new Error("Error updating walking booking status");
  }
}

export async function updateWalkingSessionsCompleted(id: number, walksCompleted: number): Promise<WalkingBookingData> {
  try {
    const updatedBooking = await prisma.walkingBooking.update({
      where: { id },
      data: { walksCompleted },
    });
    return { ...updatedBooking, daysOfWeek: updatedBooking.daysOfWeek.split(",") };
  } catch (error) {
    throw new Error("Error updating walks completed");
  }
}

export async function fetchWalkingBookingsForUser(userId: string): Promise<WalkingBookingData[]> {
  try {
    const walkingBookings = await prisma.walkingBooking.findMany({ where: { userId } });
    return walkingBookings.map((booking) => ({
      ...booking,
      daysOfWeek: booking.daysOfWeek.split(","),
    }));
  } catch (error) {
    throw new Error("Error fetching walking bookings for user");
  }
}

export async function deleteWalkingBooking(id: number): Promise<WalkingBookingData> {
  try {
    const deletedBooking = await prisma.walkingBooking.delete({ where: { id } });
    return { ...deletedBooking, daysOfWeek: deletedBooking.daysOfWeek.split(",") };
  } catch (error) {
    throw new Error("Error deleting walking booking");
  }
}