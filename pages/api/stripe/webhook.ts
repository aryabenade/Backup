// //pages/api/stripe/webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { storeGroomingBooking } from '@/app/services/grooming/groomingBooking';
import { storeVetBooking } from '@/app/services/vet/vetBooking';
import { storeTrainingBooking } from '@/app/services/training/trainingBooking';
import { storeWalkingBooking } from '@/app/services/walking/walkingBooking'; // Add walking import
import axios from 'axios';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.log('Non-POST request received:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Webhook request received');

  const sig = req.headers['stripe-signature'] as string;
  const buf = await buffer(req);

  let event: Stripe.Event;

  try {
    console.log('Verifying webhook signature...');
    event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
    console.log('Webhook verified. Event type:', event.type);
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown webhook error');
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook Error' });
  }

  if (event.type === 'checkout.session.completed') {
    console.log('Processing checkout.session.completed event...');
    const session = event.data.object as Stripe.Checkout.Session;

    console.log('Raw session metadata:', session.metadata);

    // Reconstruct formData from split metadata keys
    const formDataParts: string[] = [];
    let i = 1;
    while (session.metadata?.[`formData${i}`]) {
      formDataParts.push(session.metadata[`formData${i}`]);
      i++;
    }
    const formDataString = formDataParts.join('');
    const formData = formDataString ? JSON.parse(formDataString) : null;
    console.log('Reconstructed formData:', formData);

    const bookingType = formData?.bookingType || session.metadata?.bookingType;
    console.log('Determined bookingType:', bookingType);

    if (!bookingType) {
      console.error('No bookingType found in metadata:', session.metadata);
      return res.status(400).json({ error: 'Missing booking type in metadata' });
    }

    if (!formData) {
      console.error('No formData found in metadata:', session.metadata);
      return res.status(400).json({ error: 'Missing formData in metadata' });
    }

    // Define required fields based on bookingType
    let requiredFields: string[];
    if (bookingType === 'vet') {
      requiredFields = [
        'name',
        'phoneNumber',
        'email',
        'date',
        'timeSlot',
        'consultationType',
        'petType',
        'medicalAttention',
        'packageTitle',
        'packagePrice',
        'userId',
      ];
      if (formData.consultationType === 'Home Consultation') {
        requiredFields.push('city', 'address');
      }
    } else if (bookingType === 'grooming') {
      requiredFields = [
        'name',
        'phoneNumber',
        'email',
        'date',
        'timeSlot',
        'petType',
        'petName',
        'petBreed',
        'city',
        'address',
        'packageTitle',
        'packagePrice',
        'userId',
      ];
    } else if (bookingType === 'training') {
      requiredFields = [
        'name',
        'phoneNumber',
        'email',
        'startDate',
        'preferredDays',
        'petType',
        'petName',
        'petBreed',
        'city',
        'address',
        'packageTitle',
        'packagePrice',
        'userId',
        'sessionsPerWeek',
      ];
    } else if (bookingType === 'walking') {
      requiredFields = [
        'name',
        'phoneNumber',
        'email',
        'startDate',
        'endDate',
        'timeSlot',
        'daysOfWeek',
        'walkDuration',
        'petType',
        'petName',
        'petBreed',
        'city',
        'address',
        'totalWalks',
        'totalCost',
        'userId',
        'packageTitle',
      ];
    } else {
      requiredFields = [];
    }

    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    try {
      let response;
      if (bookingType === 'grooming') {
        console.log('Storing grooming booking with data:', formData);
        response = await storeGroomingBooking(formData);
        console.log('Grooming booking stored:', response);
        // await axios.post('/api/sendGroomingEmail', { bookingId: response.id });
        console.log('Grooming email sent for booking ID:', response.id);
      } else if (bookingType === 'vet') {
        console.log('Storing vet booking with data:', formData);
        response = await storeVetBooking(formData);
        console.log('Vet booking stored:', response);
        // await axios.post('/api/sendVetEmail', { bookingId: response.id });
        console.log('Vet email sent for booking ID:', response.id);
      } else if (bookingType === 'training') {
        console.log('Storing training booking with data:', formData);
        response = await storeTrainingBooking(formData);
        console.log('Training booking stored:', response);
        // Uncomment when training email API is implemented
        // await axios.post('/api/sendTrainingEmail', { bookingId: response.id });
      } else if (bookingType === 'walking') {
        console.log('Storing walking booking with data:', formData);
        response = await storeWalkingBooking(formData);
        console.log('Walking booking stored:', response);
        // Uncomment when walking email API is implemented
        // await axios.post('/api/sendWalkingEmail', { bookingId: response.id });
      } else {
        console.log('Unknown booking type:', bookingType);
        return res.status(400).json({ error: `Unknown booking type: ${bookingType}` });
      }

      console.log('Booking processed successfully for bookingType:', bookingType);
      return res.status(200).json({ received: true, bookingId: response?.id });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Unknown booking error');
      console.error('Error storing booking:', err.message);
      return res.status(500).json({ error: 'Failed to store booking' });
    }
  } else {
    console.log('Unhandled event type:', event.type);
  }

  return res.status(200).json({ received: true });
}