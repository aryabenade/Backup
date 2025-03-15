// // Path: app/services/payment/page.tsx
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { storeGroomingBooking } from '@/app/services/grooming/groomingBooking';
import { storeVetBooking } from '@/app/services/vet/vetBooking';
import { storeTrainingBooking } from '@/app/services/training/trainingBooking';
import { storeWalkingBooking } from '@/app/services/walking/walkingBooking';
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
        // await axios.post('/api/sendGroomingEmail', { bookingId: response.id });
      } else if (formData.bookingType === 'vet') {
        response = await storeVetBooking(dataWithUserId);
        // await axios.post('/api/sendVetEmail', { bookingId: response.id });
      } else if (formData.bookingType === 'training') {
        response = await storeTrainingBooking(dataWithUserId);
      } else if (formData.bookingType === 'walking') {
        response = await storeWalkingBooking(dataWithUserId);
        // await axios.post('/api/sendWalkingEmail', { bookingId: response.id }); // Optional email
      } else {
        throw new Error('Unknown booking type');
      }

      if (response) {
        console.log('PayAfterService booking stored:', response);
        sessionStorage.removeItem('formData');
        router.push(`/services/confirmation?packageTitle=${encodeURIComponent(
          formData.packageTitle || 'Walking Package'
        )}&packagePrice=${encodeURIComponent(
          formData.totalCost || formData.packagePrice // Use totalCost for walking
        )}&paymentMethod=PayAfterService`);
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
                <p>Package Name: {formData.packageTitle || 'Walking Package'}</p>
                <p>Package Price: {formData.totalCost || formData.packagePrice}</p>
                <p>Tax: Inclusive in package</p>
                <p>Total: {formData.totalCost || formData.packagePrice}</p>
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