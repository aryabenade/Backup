// //sendGroomingEmail.ts in pages/api
// import { NextApiRequest, NextApiResponse } from 'next';
// import { PrismaClient } from '@prisma/client';
// import nodemailer from 'nodemailer';

// const prisma = new PrismaClient();

// const transporter = nodemailer.createTransport({
//   service: 'Gmail', // You can use other email services as well
//   auth: {
//     user: 'testingforarya@gmail.com', // Your email
//     pass: 'sjad glzn hniu nihg', // Your email password or app-specific password
//   },
// });

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { bookingId, status, executiveDetails } = req.body;
//     try {
//       const booking = await prisma.groomingBooking.findUnique({
//         where: { id: bookingId },
//       });

//       if (!booking) {
//         return res.status(404).json({ error: 'Booking not found' });
//       }

//       let message;
//       if (status === 'Approved') {
//         // message = `Your grooming booking for ${booking.petName} has been approved. The executive will visit your home with the following details:
//         // Executive Name: ${executiveDetails.name}
//         // Executive Contact: ${executiveDetails.contact}
//         // Package: ${booking.packageTitle}
//         // Date: ${booking.date}
//         // Time Slot: ${booking.timeSlot}`
//         message=`Your grooming booking for ${booking.petName} has been approved. 

//         Booking Details:
//         - Date: ${booking.date}
//         - Time Slot: ${booking.timeSlot}
//         - Package: ${booking.packageTitle}
//         - Pet Name: ${booking.petName}
//         - Pet Breed: ${booking.petBreed}
//         - Pet Gender: ${booking.petGender}
//         - Pet Size: ${booking.petSize}
//         - Pet Aggression Level: ${booking.petAggression}
//         - Pet Age: ${booking.petAge}
//         - Address: ${booking.address}

//         Preparation Tips:
//         - Ensure your pet is calm and relaxed before the session.
//         - Provide a clean area for the groomer to work.
//         - Keep your pet's favorite treats handy to reward them during the session.

//         If you have any questions or need further assistance, please contact us at 7710986068. Thank you for choosing our grooming service!`;

//         // message=`Please contact us at 7710986068 if you have any questions or need further assistance.`;
//       } else {
//         // message = `Your grooming booking for ${booking.petName} has been cancelled. Possible reasons could be:
//         // - The form was not filled out properly with the correct details.
//         // - Our service is currently unavailable in your area.
//         // - Our all executives are busy at the moment.

//         // Please contact us at 7710986068 if you have any questions or need further assistance. We apologize for any inconvenience caused.`;

        
//           message = `We regret to inform you that your grooming booking for ${booking.petName} has been rejected. 
  
//           **Possible Reasons for Rejection:**
//           - The booking form was not filled out properly with the correct details.
//           - Our service is currently unavailable in your area.
//           - All our grooming executives are fully booked at the moment.
  
//           **What You Can Do:**
//           - Review the booking details and make sure all information is accurate.
//           - Check back later for availability in your area.
//           - Contact our support team for assistance or to explore alternative options.
  
//           If you have any questions or need further assistance, please contact us at 7710986068. We apologize for any inconvenience caused and hope to serve you and your pet in the future.`;
//       }

//       const mailOptions = {
//         from: 'testingforarya@gmail.com', // Your email
//         to: booking.email, // Send email to the user's email
//         subject: `Grooming Booking ${status}`,
//         text: message,
//       };

//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.error('Error sending email:', error);
//           return res.status(500).json({ error: 'Failed to send email' });
//         }
//         console.log('Email sent:', info.response);
//         res.status(200).json({ message: 'Email sent successfully' });
//       });
//     } catch (error) {
//       if (error instanceof Error) {
//         console.error('Error sending email:', error.message);
//         res.status(500).json({ error: `Failed to send email: ${error.message}` });
//       } else {
//         console.error('Error sending email:', error);
//         res.status(500).json({ error: 'Failed to send email' });
//       }
//     }
//   } else {
//     res.status(405).end(); // Method Not Allowed
//   }
// }

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
        message = `
        <p>Your grooming booking for <strong>${booking.petName}</strong> has been <strong>approved</strong>!</p>
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
      } else {
        message = `
        <p>We regret to inform you that your grooming booking for <strong>${booking.petName}</strong> has been <strong>rejected</strong>.</p>
        <h3>Possible Reasons for Rejection:</h3>
        <ul>
          <li>The booking form was not filled out properly with the correct details.</li>
          <li>Our service is currently unavailable in your area.</li>
          <li>All our grooming executives are fully booked at the moment.</li>
        </ul>
        <h3>What You Can Do:</h3>
        <ul>
          <li>Review the booking details and make sure all information is accurate.</li>
          <li>Check back later for availability in your area.</li>
          <li>Contact our support team for assistance or to explore alternative options.</li>
        </ul>
        <p>If you have any questions or need further assistance, please contact us at <strong>7710986068</strong>. We apologize for any inconvenience caused and hope to serve you and your pet in the future.</p>
        `;
      }

      const mailOptions = {
        from: 'testingforarya@gmail.com', // Your email
        to: booking.email, // Send email to the user's email
        subject: `Grooming Booking ${status}`,
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

