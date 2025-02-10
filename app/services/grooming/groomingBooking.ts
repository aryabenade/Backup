
// Path: app/services/grooming/groomingBooking.ts

"use server";

import { PrismaClient } from '@prisma/client';
import { GroomingBookingData, NewGroomingBookingData } from '@/app/types'; // Import GroomingBookingData and NewGroomingBookingData interfaces

const prisma = new PrismaClient();

// Action 1: Store a Grooming Booking
export async function storeGroomingBooking(data: NewGroomingBookingData): Promise<GroomingBookingData> {
    const {
        name,
        email,
        date,
        timeSlot,
        petType,
        petName,
        petBreed,
        petGender,
        petSize,
        petAggression,
        petAge,
        address,
        packageTitle,
        packagePrice
    } = data;

    try {
        const groomingBooking = await prisma.groomingBooking.create({
            data: {
                name,
                email,
                date: new Date(date),
                timeSlot,
                petType,
                petName,
                petBreed,
                petGender,
                petSize,
                petAggression,
                petAge,
                address,
                packageTitle,
                packagePrice,
                status: 'Pending' // Default status
            }
        });

        return groomingBooking;
    } catch (error) {
        throw new Error('Error creating grooming booking');
    }
}

// Action 2: Fetch Grooming Bookings
export async function fetchGroomingBookings(): Promise<GroomingBookingData[]> {
    try {
        const groomingBookings = await prisma.groomingBooking.findMany();
        return groomingBookings;
    } catch (error) {
        throw new Error('Error fetching grooming bookings');
    }
}

// Action 3: Update Grooming Booking Status
export async function updateGroomingBookingStatus(id: number, status: string): Promise<GroomingBookingData> {
    try {
        const updatedBooking = await prisma.groomingBooking.update({
            where: { id },
            data: { status }
        });

        return updatedBooking;
    } catch (error) {
        throw new Error('Error updating grooming booking status');
    }
}
