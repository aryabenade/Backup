 // pages/api/deletePet.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    // Handle deleting a pet and its associated adoption requests
    const { id } = req.body;
    try {
      await prisma.$transaction(async (prisma) => {
        // Delete associated adoption requests
        await prisma.adoptionRequest.deleteMany({
          where: { petId: parseInt(id, 10) },
        });

        // Delete the pet
        await prisma.pet.delete({
          where: { id: parseInt(id, 10) },
        });
      });
      
      res.status(200).json({ message: 'Pet and associated adoption requests deleted successfully' });
    } catch (error) {
      console.error('Failed to delete pet and adoption requests:', error);
      res.status(500).json({ error: 'Failed to delete pet and adoption requests' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
