// pages/api/pets/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const pet = await prisma.pet.findUnique({
        where: { id: parseInt(id as string, 10) },
      });
      if (pet) {
        res.status(200).json(pet);
      } else {
        res.status(404).json({ error: "Pet not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pet" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
