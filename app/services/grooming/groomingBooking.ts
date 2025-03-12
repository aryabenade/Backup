
// Path: app/services/grooming/groomingBooking.ts
"use server";
import { PrismaClient } from '@prisma/client';
import { GroomingBookingData, NewGroomingBookingData } from '@/app/types'; // Import GroomingBookingData and NewGroomingBookingData interfaces

const prisma = new PrismaClient();

// Action 1: Store a Grooming Booking
export async function storeGroomingBooking(data: NewGroomingBookingData): Promise<GroomingBookingData> {
    const {
        name,
        phoneNumber,
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
        city,
        address,
        packageTitle,
        packagePrice,
        userId, // Include userId in the data
    } = data;

    try {
        const groomingBooking = await prisma.groomingBooking.create({
            data: {
                name,
                phoneNumber,
                email,
                date: new Date(date), // No time zone adjustment
                timeSlot,
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
                status: 'Scheduled', // Default status
                userId, // Include userId in the data
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

// Fetch booked slots for a specific date and city
export async function fetchBookedSlots(date: Date, city: string): Promise<string[]> {
    try {
        const bookings = await prisma.groomingBooking.findMany({
            where: { 
                date: { equals: date },
                city: { equals: city } // Adding city filter
            },
            select: { timeSlot: true }
        });
        return bookings.map(booking => booking.timeSlot);
    } catch (error) {
        throw new Error('Error fetching booked slots');
    }
}

// Action 4: Fetch Grooming Bookings for a Specific User
export async function fetchGroomingBookingsForUser(userId: string): Promise<GroomingBookingData[]> {
    try {
        const groomingBookings = await prisma.groomingBooking.findMany({
            where: { userId } // Filter by userId
        });
        return groomingBookings;
    } catch (error) {
        throw new Error('Error fetching grooming bookings for user');
    }
}

// Action 5: Delete a Grooming Booking
export async function deleteGroomingBooking(id: number): Promise<GroomingBookingData> {
    try {
        const deletedBooking = await prisma.groomingBooking.delete({
            where: { id }
        });
        return deletedBooking;
    } catch (error) {
        throw new Error('Error deleting grooming booking');
    }
}
