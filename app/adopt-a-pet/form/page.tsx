"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import toast, { Toaster } from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';
import FormReminder from '@/app/components/FormReminder';
import { createAdoptionRequest } from '../../profile/adoption-request/adoptionRequest';
import { NewAdoptionRequest } from '@/app/types';
import StateDropdown from '@/app/components/StateDropdown';
import CityDropdown from '@/app/components/CityDropdown';

const PetAdoptionForm: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();
  const [petId, setPetId] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [residenceType, setResidenceType] = useState('Apartment');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStateId, setSelectedStateId] = useState(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [reasonForAdoption, setReasonForAdoption] = useState('');
  const [hasOtherPets, setHasOtherPets] = useState<boolean>(false);
  const [otherPetsDescription, setOtherPetsDescription] = useState<string | null>(null); // Fixed
  const [canCoverCosts, setCanCoverCosts] = useState<boolean>(false);

  // Validation States
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [emailAddressError, setEmailAddressError] = useState<string | null>(null);
  const [residenceTypeError, setResidenceTypeError] = useState<string | null>(null);
  const [stateError, setStateError] = useState<string | null>(null);
  const [cityError, setCityError] = useState<string | null>(null);
  const [reasonError, setReasonError] = useState<string | null>(null);
  const [otherPetsError, setOtherPetsError] = useState<string | null>(null);
  const [costsError, setCostsError] = useState<string | null>(null);

  // Refs for scrolling
  const fullNameRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const emailAddressRef = useRef<HTMLInputElement>(null);
  const residenceTypeRef = useRef<HTMLSelectElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const reasonRef = useRef<HTMLTextAreaElement>(null);
  const otherPetsRef = useRef<HTMLSelectElement>(null);
  const costsRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      const userFullName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim();
      if (userFullName) setFullName(userFullName);
      const userEmail = user.primaryEmailAddress?.emailAddress;
      if (userEmail) setEmailAddress(userEmail);
      const userProfileImage = user.imageUrl;
      if (userProfileImage) setProfileImage(userProfileImage);
      const primaryPhone = user.phoneNumbers?.find(phone => phone.id === user.primaryPhoneNumberId)?.phoneNumber;
      const phone = primaryPhone || user.phoneNumbers?.[0]?.phoneNumber;
      if (phone) setPhoneNumber(phone.replace(/\D/g, '').slice(-10));
    }
  }, [user]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('petId');
    if (id) setPetId(id);
    else {
      setError('Pet ID is missing');
      toast.error('Pet ID is missing', { position: 'bottom-center' });
    }
  }, []);

  const handleStateChange = (stateName: string, stateId: number) => {
    setSelectedState(stateName);
    setSelectedStateId(stateId);
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhoneNumber = (number: string) => /^[0-9]{10}$/.test(number);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFullNameError(null);
    setPhoneNumberError(null);
    setEmailAddressError(null);
    setResidenceTypeError(null);
    setStateError(null);
    setCityError(null);
    setReasonError(null);
    setOtherPetsError(null);
    setCostsError(null);

    let isValid = true;

    if (!fullName) {
      setFullNameError('Full Name is required.');
      isValid = false;
      fullNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (!phoneNumber) {
      setPhoneNumberError('Phone Number is required.');
      isValid = false;
      if (!fullNameError) phoneNumberRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (!validatePhoneNumber(phoneNumber)) {
      setPhoneNumberError('Phone Number must be 10 digits.');
      isValid = false;
      if (!fullNameError) phoneNumberRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (!emailAddress) {
      setEmailAddressError('Email Address is required.');
      isValid = false;
      if (!fullNameError && !phoneNumberError) emailAddressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (!validateEmail(emailAddress)) {
      setEmailAddressError('Please enter a valid email address.');
      isValid = false;
      if (!fullNameError && !phoneNumberError) emailAddressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (!residenceType) {
      setResidenceTypeError('Type of Residence is required.');
      isValid = false;
      if (!fullNameError && !phoneNumberError && !emailAddressError) residenceTypeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (!selectedState) {
      setStateError('State is required.');
      isValid = false;
      if (!fullNameError && !phoneNumberError && !emailAddressError && !residenceTypeError) stateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (!selectedCity) {
      setCityError('City is required.');
      isValid = false;
      if (!fullNameError && !phoneNumberError && !emailAddressError && !residenceTypeError && !stateError) cityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (!reasonForAdoption) {
      setReasonError('Please explain why you want to adopt this pet.');
      isValid = false;
      if (!fullNameError && !phoneNumberError && !emailAddressError && !residenceTypeError && !stateError && !cityError) reasonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (hasOtherPets && !otherPetsDescription) {
      setOtherPetsError('Please describe your other pets.');
      isValid = false;
      if (!fullNameError && !phoneNumberError && !emailAddressError && !residenceTypeError && !stateError && !cityError && !reasonError) otherPetsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (!canCoverCosts) {
      setCostsError('You must agree to cover veterinary costs and ongoing care.');
      isValid = false;
      if (!fullNameError && !phoneNumberError && !emailAddressError && !residenceTypeError && !stateError && !cityError && !reasonError && !otherPetsError) costsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (!isValid) return;

    if (!user?.id || !petId) {
      setError('User is not authenticated or pet ID is missing');
      toast.error('User is not authenticated or pet ID is missing', { position: 'bottom-center' });
      return;
    }

    const adoptionRequest: NewAdoptionRequest = {
      petId: parseInt(petId, 10),
      adopterId: user.id,
      fullName,
      phoneNumber,
      emailAddress,
      residenceType,
      state: selectedState,
      city: selectedCity,
      profileImage,
      reasonForAdoption,
      hasOtherPets,
      otherPetsDescription: hasOtherPets ? otherPetsDescription : null,
      canCoverCosts,
    };

    try {
      setLoading(true);
      const newAdoptionRequest = await createAdoptionRequest(adoptionRequest);

      await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petId: newAdoptionRequest.petId,
          fullName: newAdoptionRequest.fullName,
          phoneNumber: newAdoptionRequest.phoneNumber,
          emailAddress: newAdoptionRequest.emailAddress,
          residenceType: newAdoptionRequest.residenceType,
          state: newAdoptionRequest.state,
          city: newAdoptionRequest.city,
          profileImage: newAdoptionRequest.profileImage,
          reasonForAdoption: newAdoptionRequest.reasonForAdoption,
          hasOtherPets: newAdoptionRequest.hasOtherPets,
          otherPetsDescription: newAdoptionRequest.otherPetsDescription,
          canCoverCosts: newAdoptionRequest.canCoverCosts,
        }),
      });

      setFormSubmitted(true);
      setError(null);
      toast.success('Adoption request submitted successfully!', { position: 'bottom-center' });
      setTimeout(() => router.push('/adopt-a-pet'), 2000);
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
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Adopt a Pet</h1>
        {formSubmitted ? (
          <div className="text-center text-green-600 text-lg mb-6">
            <BeatLoader color="#36D7B7" size={16} />
            <p className="mt-2">Your form has been submitted successfully! Redirecting...</p>
          </div>
        ) : (
          <>
            {profileImage && (
              <div className="flex justify-center mb-6">
                <img
                  src={profileImage}
                  alt="User Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                  onError={(e) => (e.target as HTMLImageElement).src = '/placeholder-profile.png'}
                />
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="text-center text-red-500 text-sm mb-4">{error}</div>}
              <div>
                <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
                  Full Name
                </label>
                <input
                  ref={fullNameRef}
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
                  ref={phoneNumberRef}
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
                  ref={emailAddressRef}
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
                  ref={residenceTypeRef}
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
              <div ref={stateRef}>
                <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
                  State
                </label>
                <StateDropdown selectedState={selectedState} onStateChange={handleStateChange} />
                {stateError && <p className="text-red-500 text-xs italic">{stateError}</p>}
              </div>
              <div ref={cityRef}>
                <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
                  City
                </label>
                <CityDropdown stateId={selectedStateId} selectedCity={selectedCity} onCityChange={setSelectedCity} />
                {cityError && <p className="text-red-500 text-xs italic">{cityError}</p>}
              </div>
              <div>
                <label htmlFor="reasonForAdoption" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
                  Why do you want to adopt this pet?
                </label>
                <textarea
                  ref={reasonRef}
                  id="reasonForAdoption"
                  value={reasonForAdoption}
                  onChange={(e) => setReasonForAdoption(e.target.value)}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${reasonError ? 'border-red-500' : ''}`}
                  placeholder="Tell us why you’re interested in this pet"
                  rows={4}
                />
                {reasonError && <p className="text-red-500 text-xs italic">{reasonError}</p>}
              </div>
              <div>
                <label htmlFor="hasOtherPets" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
                  Do you have other pets?
                </label>
                <select
                  ref={otherPetsRef}
                  id="hasOtherPets"
                  value={hasOtherPets ? 'Yes' : 'No'}
                  onChange={(e) => {
                    const hasPets = e.target.value === 'Yes';
                    setHasOtherPets(hasPets);
                    if (!hasPets) setOtherPetsDescription(null);
                  }}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${otherPetsError ? 'border-red-500' : ''}`}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
                {hasOtherPets && (
                  <textarea
                    value={otherPetsDescription || ''} // Handle null
                    onChange={(e) => setOtherPetsDescription(e.target.value)}
                    className={`mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${otherPetsError ? 'border-red-500' : ''}`}
                    placeholder="Please describe your other pets"
                    rows={3}
                  />
                )}
                {otherPetsError && <p className="text-red-500 text-xs italic">{otherPetsError}</p>}
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
                  Are you prepared to cover veterinary costs and ongoing care?
                </label>
                <div className="flex items-center">
                  <input
                    ref={costsRef}
                    type="checkbox"
                    id="canCoverCosts"
                    checked={canCoverCosts}
                    onChange={(e) => setCanCoverCosts(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="canCoverCosts" className="text-gray-700">Yes</label>
                </div>
                {costsError && <p className="text-red-500 text-xs italic">{costsError}</p>}
              </div>
              <FormReminder message="Your information will be sent to the pet owner, who will review your request. If the owner is interested, they will contact you for the next steps. Thank you for considering giving a pet a new loving home!" />
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
          </>
        )}
      </div>
    </div>
  );
};

export default PetAdoptionForm;