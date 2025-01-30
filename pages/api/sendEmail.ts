//pages/api/sendEmail.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use other email services as well
  auth: {
    user: 'testingforarya@gmail.com', // Your email
    pass: 'sjad glzn hniu nihg', // Your email password or app-specific password
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { petId, fullName, phoneNumber, emailAddress, residenceType, location } = req.body;
    try {
      const pet = await prisma.pet.findUnique({
        where: { id: petId },
      });

      if (!pet) {
        return res.status(404).json({ error: 'Pet not found' });
      }

      const mailOptions = {
        from: 'testingforarya@gmail.com', // Your email
        to: pet.contact, // Send email to the lister's contact (email)
        subject: 'New Adoption Request',
        text: `You have a new adoption request for your pet, ${pet.name}.
        Adopter Details:
        Full Name: ${fullName}
        Phone Number: ${phoneNumber}
        Email Address: ${emailAddress}
        Residence Type: ${residenceType}
        Location: ${location}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ error: 'Failed to send email' });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Email sent successfully' });
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error sending email:', error.message);
        res.status(500).json({ error: `Failed to send email: ${error.message}` });
      } else {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
      }
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
