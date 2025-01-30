//pages/api/adoptionRequest.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { petId, adopterId, fullName, phoneNumber, emailAddress, residenceType, location } = req.body;
    try {
      const adoptionRequest = await prisma.adoptionRequest.create({
        data: {
          petId,
          adopterId,
          fullName,
          phoneNumber,
          emailAddress,
          residenceType,
          location,
        },
      });
      res.status(201).json(adoptionRequest);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error creating adoption request:', error.message);
        res.status(500).json({ error: `Failed to create adoption request: ${error.message}` });
      } else {
        console.error('Error creating adoption request:', error);
        res.status(500).json({ error: 'Failed to create adoption request' });
      }
    }
  } else if (req.method === 'GET') {
    try {
      const adoptionRequests = await prisma.adoptionRequest.findMany();
      res.status(200).json(adoptionRequests);
    } catch (error) {
      console.error('Error fetching adoption requests:', error);
      res.status(500).json({ error: 'Failed to fetch adoption requests' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
