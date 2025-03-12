//pages/api/pets.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      name,
      age,
      ageUnit,
      petType,
      petBreed,
      state,
      city,
      contact,
      image,
      userId,
      gender,
      isVaccinated,
      shotsUpToDate,
      isNeutered,
      isSpayed,
      goodWithDogs,
      goodWithCats,
      goodWithKids,
      reasonForRehoming,
    } = req.body;

    try {
      // Validate required fields
      if (!name || !age || !ageUnit || !petType || !petBreed || !state || !city || !contact || !userId || !gender || isVaccinated === undefined || !reasonForRehoming) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const newPet = await prisma.pet.create({
        data: {
          name,
          age: parseInt(age, 10), // Ensure age is an integer
          ageUnit,
          petType,
          petBreed,
          state,
          city,
          contact,
          image,
          userId,
          gender,
          isVaccinated,
          shotsUpToDate,
          isNeutered,
          isSpayed,
          goodWithDogs,
          goodWithCats,
          goodWithKids,
          reasonForRehoming,
        },
      });

      return res.status(201).json(newPet);
    } catch (error) {
      // Type guard to narrow error to Error type
      if (error instanceof Error) {
        console.error('Error creating pet:', error.message);
        return res.status(500).json({ error: 'Failed to create pet', details: error.message });
      } else {
        console.error('Unexpected error creating pet:', error);
        return res.status(500).json({ error: 'Failed to create pet', details: 'Unknown error occurred' });
      }
    }
  } else if (req.method === 'GET') {
    // Fetch all pets from the database
    try {
      const pets = await prisma.pet.findMany();
      return res.status(200).json(pets);
    } catch (error) {
      // Type guard for GET error
      if (error instanceof Error) {
        console.error('Error fetching pets:', error.message);
        return res.status(500).json({ error: 'Failed to fetch pets', details: error.message });
      } else {
        console.error('Unexpected error fetching pets:', error);
        return res.status(500).json({ error: 'Failed to fetch pets', details: 'Unknown error occurred' });
      }
    }
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
}