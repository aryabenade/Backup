// Path: app/services/vet/vetBooking.ts

"use server";

import { PrismaClient } from '@prisma/client';
import { VetBookingData, NewVetBookingData } from '@/app/types';

const prisma = new PrismaClient();

// Action 1: Store a Vet Booking
export async function storeVetBooking(data: NewVetBookingData): Promise<VetBookingData> {
    const {
        name,
        email,
        date,
        timeSlot,
        consultationType,
        petType,
        petIssues,
        medicalAttention,
        packageTitle,
        packagePrice
    } = data;

    try {
        const vetBooking = await prisma.vetBooking.create({
            data: {
                name,
                email,
                date: new Date(date),
                timeSlot,
                consultationType,
                petType,
                petIssues: petIssues.join(', '), // Store issues as a comma-separated string
                medicalAttention,
                packageTitle,
                packagePrice,
                status: 'Pending' // Default status
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
