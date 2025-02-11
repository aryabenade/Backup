 // PetAdoptionForm component in app/adopt-a-pet/adopt/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import toast, { Toaster } from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';
import FormReminder from '@/app/components/FormReminder';

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
  const [loading, setLoading] = useState(false);

  // Validation States
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [emailAddressError, setEmailAddressError] = useState<string | null>(null);
  const [residenceTypeError, setResidenceTypeError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('petId');
    if (id) {
      setPetId(id);
    } else {
      setError('Pet ID is missing');
      toast.error('Pet ID is missing', { position: 'bottom-center' });
    }
  }, []);

  // Validation functions
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhoneNumber = (number: string) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(number);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous errors
    setFullNameError(null);
    setPhoneNumberError(null);
    setEmailAddressError(null);
    setResidenceTypeError(null);
    setLocationError(null);
    setError(null);

    let isValid = true;

    // Full Name Validation
    if (!fullName) {
      setFullNameError('Full Name is required.');
      isValid = false;
    }

    // Phone Number Validation
    if (!phoneNumber) {
      setPhoneNumberError('Phone Number is required.');
      isValid = false;
    } else if (!validatePhoneNumber(phoneNumber)) {
      setPhoneNumberError('Phone Number must be 10 digits.');
      isValid = false;
    }

    // Email Address Validation
    if (!emailAddress) {
      setEmailAddressError('Email Address is required.');
      isValid = false;
    } else if (!validateEmail(emailAddress)) {
      setEmailAddressError('Please enter a valid email address.');
      isValid = false;
    }

    // Residence Type Validation
    if (!residenceType) {
      setResidenceTypeError('Type of Residence is required.');
      isValid = false;
    }

    // Location Validation
    if (!location) {
      setLocationError('Location is required.');
      isValid = false;
    }

    if (!isValid) {
      return; // Stop submission if there are validation errors
    }

    if (!user?.id || !petId) {
      setError('User is not authenticated or pet ID is missing');
      toast.error('User is not authenticated or pet ID is missing', { position: 'bottom-center' });
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
      setLoading(true);
      const response = await fetch('/api/adoptionRequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adoptionRequest),
      });

      if (response.ok) {
        // Call the sendEmail API after the data is stored in the database
        await fetch('/api/sendEmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            petId: parseInt(petId, 10),
            fullName,
            phoneNumber,
            emailAddress,
            residenceType,
            location,
          }),
        });

        setFormSubmitted(true);
        setError(null);
        toast.success('Adoption request submitted successfully!', { position: 'bottom-center' });
        setTimeout(() => {
          router.push('/adopt-a-pet');
        }, 2000);
      } else {
        const errorMessage = await response.text();
        setError(`Failed to submit adoption request: ${errorMessage}`);
        toast.error(`Failed to submit adoption request: ${errorMessage}`, { position: 'bottom-center' });
      }
    } catch (err: any) {
      setError(`Failed to submit adoption request: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
      toast.error(`Failed to submit adoption request: ${err instanceof Error ? err.message : 'An unknown error occurred'}`, { position: 'bottom-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex items-center justify-center">
      <Toaster position="top-center" />
      <div className="container max-w-md bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Adopt a Pet
        </h1>
        {formSubmitted ? (
          <div className="text-center text-green-600 text-lg mb-6">
            <BeatLoader color="#36D7B7" size={16} />
            <p className="mt-2">Your form has been submitted successfully! Redirecting...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-center text-red-500 text-sm mb-4">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${fullNameError ? 'border-red-500' : ''}`}
                placeholder="Enter your full name"
              />
              {fullNameError && <p className="text-red-500 text-xs italic">{fullNameError}</p>}
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${phoneNumberError ? 'border-red-500' : ''}`}
                placeholder="Enter your phone number"
              />
              {phoneNumberError && <p className="text-red-500 text-xs italic">{phoneNumberError}</p>}
            </div>
            <div>
              <label htmlFor="emailAddress" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
                Email Address
              </label>
              <input
                type="email"
                id="emailAddress"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${emailAddressError ? 'border-red-500' : ''}`}
                placeholder="Enter your email address"
              />
              {emailAddressError && <p className="text-red-500 text-xs italic">{emailAddressError}</p>}
            </div>
            <div>
              <label htmlFor="residenceType" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
                Type of Residence
              </label>
              <select
                id="residenceType"
                value={residenceType}
                onChange={(e) => setResidenceType(e.target.value)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${residenceTypeError ? 'border-red-500' : ''}`}
              >
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Flat">Flat</option>
              </select>
              {residenceTypeError && <p className="text-red-500 text-xs italic">{residenceTypeError}</p>}
            </div>
            <div>
              <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
                Location (City, State)
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${locationError ? 'border-red-500' : ''}`}
                placeholder="Enter your city and state"
              />
              {locationError && <p className="text-red-500 text-xs italic">{locationError}</p>}
            </div>
            <FormReminder message="Your information will be sent to the pet owner, who will review your request.
             If the owner is interested, they will contact you for the next steps. 
             Thank you for considering giving a pet a new loving home!"/>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <BeatLoader color="white" size={8} margin={3} />
                    <span className="ml-2">Submitting...</span>
                  </div>
                ) : (
                  'Submit Adoption Request'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PetAdoptionForm;
