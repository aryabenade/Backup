// pages/api/updatePet.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    // Handle updating a pet
    const { id, name, age, category, breed, state, city, contact, image } = req.body;
    try {
      const pet = await prisma.pet.update({
        where: { id: parseInt(id, 10) },
        data: {
          name,
          age: parseInt(age, 10),
          category,
          breed,
          state,
          city,
          contact,
          image,
        },
      });
      res.status(200).json(pet);
    } catch (error) {
      res.status(500).json({ error: "Failed to update pet" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
