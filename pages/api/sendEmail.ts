// Path: pages/api/sendEmail.ts
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

      const message = `
        <p>You have a new adoption request for your pet, <strong>${pet.name}</strong>.</p>
        <h3>Adopter Details:</h3>
        <ul>
          <li><strong>Full Name</strong>: ${fullName}</li>
          <li><strong>Phone Number</strong>: ${phoneNumber}</li>
          <li><strong>Email Address</strong>: ${emailAddress}</li>
          <li><strong>Residence Type</strong>: ${residenceType}</li>
          <li><strong>Location</strong>: ${location}</li>
        </ul>
        <h3>Next Steps:</h3>
        <ol>
          <li>Review the adopter's details to ensure they meet your criteria for adoption.</li>
          <li>Reach out to the potential adopter via phone or email to discuss further and arrange a meeting.</li>
          <li>If you decide to proceed with the adoption, arrange a visit to the adopter's residence to ensure it is suitable for the pet.</li>
          <li>If your listed pet gets adopted, delete your pet from the List A Pet section so that you don't receive any adoption requests for that pet.</li>
        </ol>
        <p>Please respond to this email if you have any questions or need further assistance.</p>
      `;

      const mailOptions = {
        from: 'testingforarya@gmail.com', // Your email
        to: pet.contact, // Send email to the lister's contact (email)
        subject: 'New Adoption Request',
        html: message,
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
