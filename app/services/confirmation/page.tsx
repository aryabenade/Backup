
// Path: app/confirmation/page.tsx
"use client";

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const Confirmation: React.FC = () => {
    const searchParams = useSearchParams();

    const [packageTitle, setPackageTitle] = useState<string | null>(null);
    const [packagePrice, setPackagePrice] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

    useEffect(() => {
        if (searchParams) {
            setPackageTitle(searchParams.get('packageTitle'));
            setPackagePrice(searchParams.get('packagePrice'));
            setPaymentMethod(searchParams.get('paymentMethod'));
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex items-center justify-center">
            <div className="container max-w-md bg-white shadow-md rounded-lg p-8">
                <div className="text-center mb-4">
                    <FontAwesomeIcon icon={faCheckCircle} className="h-16 w-16 text-green-500 mx-auto" />
                </div>
                <h2 className="text-xl font-bold text-center mb-4">Booking Confirmed</h2>
                <p className="text-center">Thank you for your booking! Here are the details:</p>
                <div className="mt-4 p-4 border rounded-lg shadow">
                    <p><strong>Package Name:</strong> {packageTitle}</p>
                    <p><strong>Package Price:</strong> ₹{packagePrice}</p>
                    <p><strong>Payment Method:</strong> {paymentMethod}</p>
                </div>
                <p className="text-center mt-4">You will receive a confirmation email shortly.</p>
                <div className="mt-4 text-center">
                    <Link href="/" className="text-blue-600 font-medium hover:underline">
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Confirmation;
