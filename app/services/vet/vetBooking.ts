// Path: app/services/vet/vetBooking.ts

"use server";

import { PrismaClient } from '@prisma/client';
import { VetBookingData, NewVetBookingData } from '@/app/types';

const prisma = new PrismaClient();

// Action 1: Store a Vet Booking
export async function storeVetBooking(data: NewVetBookingData): Promise<VetBookingData> {
    const {
        name,
        phoneNumber,
        email,
        date,
        timeSlot,
        consultationType,
        petType,
        petIssues,
        medicalAttention, 
        city,
        address,
        packageTitle,
        packagePrice,
        userId, // Include userId in the data
    } = data;

    try {
        const vetBooking = await prisma.vetBooking.create({
            data: {
                name,
                phoneNumber,
                email,
                date: new Date(date),
                timeSlot,
                consultationType,
                petType,
                petIssues: petIssues.join(', '), // Store issues as a comma-separated string
                medicalAttention,
                city,
                address,
                packageTitle,
                packagePrice,
                status: 'Scheduled', // Default status
                userId, // Include userId in the data

            }
        });

        return vetBooking;
    } catch (error) {
        throw new Error('Error creating vet booking');
    }
}

// Action 2: Fetch Vet Bookings
export async function fetchVetBookings(): Promise<VetBookingData[]> {
    try {
        const vetBookings = await prisma.vetBooking.findMany();
        return vetBookings;
    } catch (error) {
        throw new Error('Error fetching vet bookings');
    }
}

// Action 3: Update Vet Booking Status
export async function updateVetBookingStatus(id: number, status: string): Promise<VetBookingData> {
    try {
        const updatedBooking = await prisma.vetBooking.update({
            where: { id },
            data: { status }
        });

        return updatedBooking;
    } catch (error) {
        throw new Error('Error updating vet booking status');
    }
}

// Fetch booked slots for a specific date and city
export async function fetchBookedSlots(date: Date, city: string): Promise<string[]> {
    try {
        const bookings = await prisma.vetBooking.findMany({
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

// Action 4: Fetch Vet Bookings for a Specific User
export async function fetchVetBookingsForUser(userId: string): Promise<VetBookingData[]> {
    try {
        const vetBookings = await prisma.vetBooking.findMany({
            where: { userId } // Filter by userId
        });
        return vetBookings;
    } catch (error) {
        throw new Error('Error fetching vet bookings for user');
    }
}

// Action 5: Delete a Vet Booking
export async function deleteVetBooking(id: number): Promise<VetBookingData> {
    try {
        const deletedBooking = await prisma.vetBooking.delete({
            where: { id }
        });
        return deletedBooking;
    } catch (error) {
        throw new Error('Error deleting vet booking');
    }
}