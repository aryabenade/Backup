
// Path: pages/api/sendGroomingEmail.ts
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
    const { bookingId } = req.body;
    try {
      const booking = await prisma.groomingBooking.findUnique({
        where: { id: bookingId },
      });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      const message = `
        <p>Your grooming booking for <strong>${booking.petName}</strong> has been <strong>confirmed</strong>!</p>
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Date</strong>: ${booking.date}</li>
          <li><strong>Time Slot</strong>: ${booking.timeSlot}</li>
          <li><strong>Package</strong>: ${booking.packageTitle}</li>
          <li><strong>Pet Name</strong>: ${booking.petName}</li>
          <li><strong>Pet Breed</strong>: ${booking.petBreed}</li>
          <li><strong>Pet Gender</strong>: ${booking.petGender}</li>
          <li><strong>Pet Size</strong>: ${booking.petSize}</li>
          <li><strong>Pet Aggression Level</strong>: ${booking.petAggression}</li>
          <li><strong>Pet Age</strong>: ${booking.petAge}</li>
          <li><strong>Address</strong>: ${booking.address}</li>
        </ul>
        <h3>Preparation Tips:</h3>
        <ul>
          <li>Ensure your pet is calm and relaxed before the session.</li>
          <li>Provide a clean area for the groomer to work.</li>
          <li>Keep your pet's favorite treats handy to reward them during the session.</li>
        </ul>
        <p>If you have any questions or need further assistance, please contact us at <strong>7710986068</strong>. Thank you for choosing our grooming service!</p>
      `;

      const mailOptions = {
        from: 'testingforarya@gmail.com', // Your email
        to: booking.email, // Send email to the user's email
        subject: 'Grooming Booking Confirmed',
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
