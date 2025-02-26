
// Path: app/payment/page.tsx

"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { storeGroomingBooking } from '@/app/services/grooming/groomingBooking';
import { storeVetBooking } from '@/app/services/vet/vetBooking'; // Import storeVetBooking
import { useUser } from '@clerk/nextjs'; // Import Clerk's useUser hook
import { BeatLoader } from 'react-spinners';
import axios from 'axios';

const Payment: React.FC = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useUser(); // Use Clerk's useUser hook to get the authenticated user

    const [formData, setFormData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedData = sessionStorage.getItem('formData');
        if (storedData) {
            setFormData(JSON.parse(storedData));
        }
    }, []);

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        if (formData && user) {
            // Add userId to formData
            const dataWithUserId = { ...formData, userId: user.id };

            try {
                let response;
                if (formData.bookingType === 'grooming') {
                    response = await storeGroomingBooking(dataWithUserId);
                } else if (formData.bookingType === 'vet') {
                    response = await storeVetBooking(dataWithUserId);
                }

                console.log("API Response:", response); // Add debug log

                if (response) {
                    // Call the appropriate email API to send the confirmation email
                    if (formData.bookingType === 'grooming') {
                        await axios.post('/api/sendGroomingEmail', {
                            bookingId: response.id,
                        });
                    } else if (formData.bookingType === 'vet') {
                        await axios.post('/api/sendVetEmail', {
                            bookingId: response.id,
                        });
                    }

                    router.push(`/services/confirmation?packageTitle=${encodeURIComponent(formData.packageTitle)}&packagePrice=${encodeURIComponent(formData.packagePrice)}&paymentMethod=PayAfterService`);
                } else {
                    setError('Failed to process the booking.');
                }
            } catch (error) {
                console.error('Error submitting booking:', error);
                setError('An error occurred while processing the booking.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex items-center justify-center">
            <div className="container max-w-md bg-white shadow-md rounded-lg p-8">
                <h2 className="text-xl font-bold text-center mb-4">Payment</h2>
                {formData && (
                    <form onSubmit={handlePaymentSubmit} className="max-w-lg mx-auto space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Package Details</label>
                            <div className="mt-1 p-2 w-full border border-gray-300 rounded-md">
                                <p>Package Name: {formData.packageTitle}</p>
                                <p>Package Price: ₹{formData.packagePrice}</p>
                                <p>Tax: Inclusive in package</p>
                                <p>Total: ₹{formData.packagePrice}</p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                            <div className="p-2 w-full border rounded-md bg-gray-100 border-gray-300">
                                Pay After Service (Cash or UPI)
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-xs italic">{error}</p>}
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
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
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Payment;
