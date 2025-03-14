// Path: app/services/payment/page.tsx
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { storeGroomingBooking } from '@/app/services/grooming/groomingBooking';
import { storeVetBooking } from '@/app/services/vet/vetBooking';
import { storeTrainingBooking } from '@/app/services/training/trainingBooking';
import { useUser } from '@clerk/nextjs';
import { BeatLoader } from 'react-spinners';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const Payment: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();

  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'PayAfterService' | 'Stripe'>('PayAfterService');

  useEffect(() => {
    const storedData = sessionStorage.getItem('formData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      console.log('Loaded formData from sessionStorage:', parsedData);
      setFormData(parsedData);
    } else {
      console.error('No formData found in sessionStorage');
      setError('No booking data found. Please start over.');
    }
  }, []);

  const handlePayAfterService = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData || !user) {
      setError('Missing form data or user information.');
      setLoading(false);
      return;
    }

    const dataWithUserId = { ...formData, userId: user.id };
    console.log('Processing PayAfterService with data:', dataWithUserId);

    try {
      let response;
      if (formData.bookingType === 'grooming') {
        response = await storeGroomingBooking(dataWithUserId);
        await axios.post('/api/sendGroomingEmail', { bookingId: response.id });
      } else if (formData.bookingType === 'vet') {
        response = await storeVetBooking(dataWithUserId);
        await axios.post('/api/sendVetEmail', { bookingId: response.id });
      } else if (formData.bookingType === 'training') {
        response = await storeTrainingBooking(dataWithUserId);
      }

      if (response) {
        console.log('PayAfterService booking stored:', response);
        sessionStorage.removeItem('formData');
        router.push(`/services/confirmation?packageTitle=${encodeURIComponent(formData.packageTitle)}&packagePrice=${encodeURIComponent(formData.packagePrice)}&paymentMethod=PayAfterService`);
      } else {
        setError('Failed to process the booking.');
      }
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      console.error('Error submitting booking:', err.message);
      setError('An error occurred while processing the booking.');
    } finally {
      setLoading(false);
    }
  };

  const handleStripePayment = async () => {
    setLoading(true);
    setError(null);

    if (!formData || !user) {
      setError('Missing form data or user information.');
      setLoading(false);
      return;
    }

    const dataWithUserId = { ...formData, userId: user.id };
    console.log('Sending formData to checkout_sessions:', dataWithUserId);

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const response = await fetch('/api/stripe/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData: dataWithUserId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create Stripe session: ${errorData.error}`);
      }

      const { id } = await response.json();
      console.log('Received Stripe session ID:', id);

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: id });
      if (stripeError) throw stripeError;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      console.error('Error initiating Stripe payment:', err.message);
      setError(`An error occurred while initiating payment: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex items-center justify-center">
      <div className="container max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-xl font-bold text-center mb-4">Payment</h2>
        {formData ? (
          <div className="max-w-lg mx-auto space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Package Details</label>
              <div className="mt-1 p-2 w-full border border-gray-300 rounded-md">
                <p>Package Name: {formData.packageTitle}</p>
                <p>Package Price: {formData.packagePrice}</p>
                <p>Tax: Inclusive in package</p>
                <p>Total: {formData.packagePrice}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as 'PayAfterService' | 'Stripe')}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              >
                <option value="PayAfterService">Pay After Service (Cash or UPI)</option>
                <option value="Stripe">Pay with Stripe (Card)</option>
              </select>
            </div>

            {error && <p className="text-red-500 text-xs italic">{error}</p>}

            <div className="flex items-center justify-between">
              {paymentMethod === 'PayAfterService' ? (
                <button
                  onClick={handlePayAfterService}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <BeatLoader color="white" size={8} margin={3} />
                      <span className="ml-2">Processing...</span>
                    </div>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              ) : (
                <button
                  onClick={handleStripePayment}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <BeatLoader color="white" size={8} margin={3} />
                      <span className="ml-2">Redirecting...</span>
                    </div>
                  ) : (
                    'Pay with Stripe'
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-red-500 text-center">Loading booking data...</p>
        )}
      </div>
    </div>
  );
};

export default Payment;

// // Path: pages/api/stripe/checkout_sessions.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.log('Non-POST request received:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { formData } = req.body;
    console.log('Received formData in checkout_sessions:', formData);

    if (!formData || !formData.packageTitle || !formData.packagePrice || !formData.bookingType || !formData.userId) {
      console.error('Invalid or missing formData:', formData);
      return res.status(400).json({ error: 'Missing required formData fields' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: formData.packageTitle,
            },
            unit_amount: parseInt(formData.packagePrice.replace('₹', '')) * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/services/confirmation?packageTitle=${encodeURIComponent(formData.packageTitle)}&packagePrice=${encodeURIComponent(formData.packagePrice)}&paymentMethod=Stripe`,
      cancel_url: `${req.headers.origin}/services/payment`,
      metadata: {
        bookingType: formData.bookingType,
        userId: formData.userId,
        formData: JSON.stringify(formData),
      },
    });

    console.log('Created Stripe session with ID:', session.id);
    return res.status(200).json({ id: session.id });
  } catch (error: unknown) {
    // Type assertion to Error or handle as unknown
    const err = error instanceof Error ? error : new Error('Unknown error occurred');
    console.error('Error creating Stripe session:', err.message);
    return res.status(500).json({ error: 'Failed to create payment session' });
  }
}

// // Path: pages/api/stripe/webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { storeGroomingBooking } from '@/app/services/grooming/groomingBooking';
import { storeVetBooking } from '@/app/services/vet/vetBooking';
import { storeTrainingBooking } from '@/app/services/training/trainingBooking';
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

    const formData = session.metadata?.formData ? JSON.parse(session.metadata.formData) : null;
    console.log('Parsed formData:', formData);

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

    try {
      let response;
      if (bookingType === 'vet') {
        console.log('Storing vet booking with data:', formData);
        response = await storeVetBooking(formData);
        console.log('Vet booking stored:', response);
        await axios.post('/api/sendVetEmail', { bookingId: response.id });
        console.log('Vet email sent for booking ID:', response.id);
      } else if (bookingType === 'grooming') {
        console.log('Storing grooming booking with data:', formData);
        response = await storeGroomingBooking(formData);
        console.log('Grooming booking stored:', response);
        await axios.post('/api/sendGroomingEmail', { bookingId: response.id });
        console.log('Grooming email sent for booking ID:', response.id);
      } else if (bookingType === 'training') {
        console.log('Storing training booking with data:', formData);
        response = await storeTrainingBooking(formData);
        console.log('Training booking stored:', response);
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
