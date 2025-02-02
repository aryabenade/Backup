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
    const { bookingId, status, executiveDetails } = req.body;
    try {
      const booking = await prisma.groomingBooking.findUnique({
        where: { id: bookingId },
      });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      let message;
      if (status === 'Approved') {
        message = `Your grooming booking for ${booking.petName} has been approved. The executive will visit your home with the following details:
        Executive Name: ${executiveDetails.name}
        Executive Contact: ${executiveDetails.contact}
        Package: ${booking.packageTitle}
        Date: ${booking.date}
        Time Slot: ${booking.timeSlot}

        Please contact us at 7710986068 if you have any questions or need further assistance.`;
      } else {
        message = `Your grooming booking for ${booking.petName} has been cancelled. Possible reasons could be:
        - The form was not filled out properly with the correct details.
        - Our service is currently unavailable in your area.
        - Our all executives are busy at the moment.

        Please contact us at 7710986068 if you have any questions or need further assistance. We apologize for any inconvenience caused.`;
      }

      const mailOptions = {
        from: 'testingforarya@gmail.com', // Your email
        to: booking.email, // Send email to the user's email
        subject: `Grooming Booking ${status}`,
        text: message,
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
