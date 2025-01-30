// // PetAdoptionForm component in app/adopt-a-pet/adopt/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

const PetAdoptionForm: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();
  const [petId, setPetId] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [residenceType, setResidenceType] = useState('');
  const [location, setLocation] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('petId');
    if (id) {
      setPetId(id);
    } else {
      setError('Pet ID is missing');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id || !petId) {
      setError('User is not authenticated or pet ID is missing');
      return;
    }

    const adoptionRequest = {
      petId: parseInt(petId, 10),  // Ensure petId is sent as an integer
      adopterId: user.id,
      fullName,
      phoneNumber,
      emailAddress,
      residenceType,
      location,
    };

    try {
      const response = await fetch('/api/adoptionRequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adoptionRequest),
      });

      if (response.ok) {
        setFormSubmitted(true);
        setError(null);
        setTimeout(() => {
          router.push('/adopt-a-pet');
        }, 2000);
      } else {
        const errorMessage = await response.text();
        setError(`Failed to submit adoption request: ${errorMessage}`);
      }
    } catch (err) {
      setError(`Failed to submit adoption request: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mt-10">Adopt a Pet</h1>
      {formSubmitted ? (
        <div className="text-center text-green-500 text-lg mt-6">
          Your form has been submitted successfully!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8">
          {error && (
            <div className="text-center text-red-500 text-lg mb-4">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-lg mb-2" htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg mb-2" htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg mb-2" htmlFor="emailAddress">Email Address</label>
            <input
              type="email"
              id="emailAddress"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg mb-2" htmlFor="residenceType">Type of Residence</label>
            <select
              id="residenceType"
              value={residenceType}
              onChange={(e) => setResidenceType(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select...</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Flat">Flat</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-lg mb-2" htmlFor="location">Location (City, State)</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="text-center">
            <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-600">
              Submit Adoption Request
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PetAdoptionForm;
