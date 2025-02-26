// Path: app/services/favorites/favoriteService.ts

"use server";

import { PrismaClient } from '@prisma/client';
import { Pet } from '@/app/types';

const prisma = new PrismaClient();

// Function to add a favorite entry
export async function addFavorite(userId: string, petId: number): Promise<void> {
    try {
        await prisma.favorite.create({
            data: {
                userId,
                petId,
            },
        });
    } catch (error) {
        throw new Error('Error adding favorite');
    }
}

// Function to fetch favorite pets for a user
export async function fetchFavoritesForUser(userId: string): Promise<Pet[]> {
    try {
        const favorites = await prisma.favorite.findMany({
            where: { userId },
            include: { pet: true }, // Including related pet data
        });
        return favorites.map(favorite => favorite.pet);
    } catch (error) {
        throw new Error('Error fetching favorites for user');
    }
}

// Function to remove a favorite entry
export async function removeFavorite(userId: string, petId: number): Promise<void> {
    try {
        await prisma.favorite.deleteMany({
            where: {
                userId,
                petId,
            },
        });
    } catch (error) {
        throw new Error('Error removing favorite');
    }
}
