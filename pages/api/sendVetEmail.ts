
// Path: pages/api/sendVetEmail.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'testingforarya@gmail.com', // Your email
    pass: 'sjad glzn hniu nihg', // Your email password or app-specific password
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { bookingId } = req.body;
    try {
      const booking = await prisma.vetBooking.findUnique({
        where: { id: bookingId },
      });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

     
       const message = `
        <p>Your vet consultation booking for <strong>${booking.petType}</strong> has been <strong>approved</strong>!</p>
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Date</strong>: ${booking.date}</li>
          <li><strong>Time Slot</strong>: ${booking.timeSlot}</li>
          <li><strong>Consultation Type</strong>: ${booking.consultationType}</li>
          <li><strong>Package</strong>: ${booking.packageTitle}</li>
          <li><strong>Pet Type</strong>: ${booking.petType}</li>
          <li><strong>Pet Issues</strong>: ${booking.petIssues}</li>
          <li><strong>Medical Attention</strong>: ${booking.medicalAttention}</li>
        </ul>
        <h3>Preparation Tips:</h3>
        <ul>
          <li>Ensure your pet is calm and relaxed before the consultation.</li>
          <li>Provide a clean, quiet area for the consultation.</li>
          <li>Have your pet's medical history, current medications, and any relevant information ready.</li>
          <li>Keep your pet's favorite treats handy to reward them during the consultation.</li>
        </ul>
        <p>If you have any questions or need further assistance, please contact us at <strong>7710986068</strong>. Thank you for choosing our vet consultation service!</p>
        `;
      
      const mailOptions = {
        from: 'testingforarya@gmail.com', // Your email
        to: booking.email, // Send email to the user's email
        subject: `Vet Consultation Booking Confirmed`,
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
