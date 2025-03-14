// Path: app/profile/adoption-request/adoptionRequest.ts
"use server";

import { PrismaClient } from '@prisma/client';
import { AdoptionRequest,NewAdoptionRequest } from '@/app/types';
import { createNotification } from '../notifications/notifications';

const prisma = new PrismaClient();

// Action 1: Create an Adoption Request with Notification
export async function createAdoptionRequest(data: NewAdoptionRequest): Promise<AdoptionRequest> {
  const {
    petId,
    adopterId,
    fullName,
    phoneNumber,
    emailAddress,
    residenceType,
    state,
    city,
    profileImage,
    reasonForAdoption,
    hasOtherPets,
    otherPetsDescription, // Already works with string | null | undefined
    canCoverCosts,
  } = data;

  try {
    const adoptionRequest = await prisma.adoptionRequest.create({
      data: {
        petId,
        adopterId,
        fullName,
        phoneNumber,
        emailAddress,
        residenceType,
        state,
        city,
        profileImage,
        reasonForAdoption,
        hasOtherPets,
        otherPetsDescription: otherPetsDescription ?? null, // Optional: Normalize undefined to null
        canCoverCosts,
      },
    });

    const pet = await prisma.pet.findUnique({ where: { id: petId } });
    if (pet) {
      const notificationMessage = `You have a new adoption request for ${pet.name} from ${fullName}`;
      await createNotification(pet.userId, pet.id, notificationMessage);
    }

    return adoptionRequest;
  } catch (error) {
    throw new Error('Error creating adoption request');
  }
}

// Action 2: Fetch All Adoption Requests
export async function fetchAllAdoptionRequests(): Promise<AdoptionRequest[]> {
  try {
    const adoptionRequests = await prisma.adoptionRequest.findMany();
    return adoptionRequests;
  } catch (error) {
    throw new Error('Error fetching adoption requests');
  }
}

// Action 3: Fetch Adoption Requests by User ID
export async function fetchAdoptionRequestsByUserId(userId: string): Promise<AdoptionRequest[]> {
  try {
    const adoptionRequests = await prisma.adoptionRequest.findMany({
      where: {
        pet: {
          userId,
        },
      },
      include: {
        pet: true, // Include pet details
      },
    });
    return adoptionRequests;
  } catch (error) {
    throw new Error('Error fetching adoption requests by user ID');
  }
}

// Action 4: Fetch Adoption Request by ID
export async function fetchAdoptionRequestById(id: number): Promise<AdoptionRequest | null> {
  try {
    const adoptionRequest = await prisma.adoptionRequest.findUnique({
      where: { id },
      include: {
        pet: true, // Include pet details
      },
    });
    return adoptionRequest;
  } catch (error) {
    throw new Error('Error fetching adoption request by ID');
  }
}

// Action 5: Update an Adoption Request
export async function updateAdoptionRequest(id: number, data: Partial<AdoptionRequest>): Promise<AdoptionRequest> {
  const { fullName, phoneNumber, emailAddress, residenceType,state,city } = data;

  try {
    const updatedAdoptionRequest = await prisma.adoptionRequest.update({
      where: { id },
      data: {
        fullName,
        phoneNumber,
        emailAddress,
        residenceType,
        state,
        city,
      },
      // include: {
      //   pet: true, // Include pet details
      // },
    });

    return updatedAdoptionRequest;
  } catch (error) {
    throw new Error('Error updating adoption request');
  }
}

// Action 6: Delete an Adoption Request
export async function deleteAdoptionRequest(id: number): Promise<AdoptionRequest> {
  try {
    const deletedAdoptionRequest = await prisma.adoptionRequest.delete({
      where: { id },
    });
    return deletedAdoptionRequest;
  } catch (error) {
    throw new Error('Error deleting adoption request');
  }
}
