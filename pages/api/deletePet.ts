// pages/api/deletePet.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    // Handle deleting a pet
    const { id } = req.body;
    try {
      await prisma.pet.delete({
        where: { id: parseInt(id, 10) },
      });
      res.status(200).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete pet" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
