// app/list-a-pet/form/page.tsx
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Pet } from '../../types';
import toast, { Toaster } from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';
import FormReminder from '@/app/components/FormReminder';
import { catBreeds } from '@/app/data/catBreeds';
import { dogBreeds } from '@/app/data/dogBreeds';
import Select from 'react-select';
import StateDropdown from '@/app/components/StateDropdown';
import CityDropdown from '@/app/components/CityDropdown';

const PetListingForm: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1); // Step 1: Pet Details, Step 2: Owner Details

  // Form state
  const [petName, setPetName] = useState('');
  const [ownerName, setOwnerName] = useState(user?.fullName || '');
  const [age, setAge] = useState('');
  const [ageUnit, setAgeUnit] = useState('weeks');
  const [contact, setContact] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [petType, setPetType] = useState('Dog');
  const [petBreed, setPetBreed] = useState('');
  const [breedOptions, setBreedOptions] = useState<{ label: string; value: string }[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedStateId, setSelectedStateId] = useState(0);
  const [selectedCity, setSelectedCity] = useState('');
  const [petGender, setPetGender] = useState<'Male' | 'Female'>('Male');
  const [isVaccinated, setIsVaccinated] = useState<boolean | null>(null);
  const [shotsUpToDate, setShotsUpToDate] = useState('');
  const [isNeutered, setIsNeutered] = useState<boolean | null>(null);
  const [isSpayed, setIsSpayed] = useState<boolean | null>(null);
  const [goodWithDogs, setGoodWithDogs] = useState<boolean | null>(null);
  const [goodWithCats, setGoodWithCats] = useState<boolean | null>(null);
  const [goodWithKids, setGoodWithKids] = useState<boolean | null>(null);
  const [reasonForRehoming, setReasonForRehoming] = useState('');

  // Validation states
  const [petNameError, setPetNameError] = useState<string | null>(null);
  const [ownerNameError, setOwnerNameError] = useState<string | null>(null);
  const [ageError, setAgeError] = useState<string | null>(null);
  const [petBreedError, setPetBreedError] = useState<string | null>(null);
  const [stateError, setStateError] = useState<string | null>(null);
  const [cityError, setCityError] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [genderError, setGenderError] = useState<string | null>(null);
  const [vaccinationError, setVaccinationError] = useState<string | null>(null);
  const [neuteredError, setNeuteredError] = useState<string | null>(null);
  const [spayedError, setSpayedError] = useState<string | null>(null);
  const [reasonError, setReasonError] = useState<string | null>(null);

  // Refs for scrolling to errors
  const petNameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const petBreedRef = useRef<HTMLDivElement>(null);
  const genderRef = useRef<HTMLDivElement>(null);
  const vaccinationRef = useRef<HTMLDivElement>(null);
  const neuteredRef = useRef<HTMLDivElement>(null);
  const spayedRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const reasonRef = useRef<HTMLTextAreaElement>(null);
  const ownerNameRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);

  const handleStateChange = (stateName: string, stateId: number) => {
    setSelectedState(stateName);
    setSelectedStateId(stateId);
  };

  useEffect(() => {
    if (petType === 'Cat') {
      setBreedOptions(catBreeds.map(breed => ({ label: breed, value: breed })));
    } else if (petType === 'Dog') {
      setBreedOptions(dogBreeds.map(breed => ({ label: breed, value: breed })));
    }
  }, [petType]);

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'my_upload_preset');
      const response = await fetch('/api/uploadImage', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Image upload failed with status: ${response.status}`);
      const data = await response.json();
      return data.url;
    } catch (uploadError: any) {
      toast.error(`Image upload failed: ${uploadError.message}`);
      throw uploadError;
    }
  };

  const validateStep1 = () => {
    setPetNameError(null);
    setAgeError(null);
    setPetBreedError(null);
    setGenderError(null);
    setVaccinationError(null);
    setNeuteredError(null);
    setSpayedError(null);
    setImageError(null);
    setReasonError(null);

    let isValid = true;

    if (!petName) {
      setPetNameError('Pet Name is required.');
      isValid = false;
      petNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (!age) {
      setAgeError('Age is required.');
      isValid = false;
      if (!petNameError) ageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (isNaN(Number(age)) || parseInt(age, 10) <= 0) {
      setAgeError('Age must be a valid positive number.');
      isValid = false;
      if (!petNameError) ageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      const ageNumber = parseInt(age, 10);
      if (petType === 'Dog' && (ageNumber > 30 || (ageUnit === 'years' && ageNumber > 20))) {
        setAgeError('Please enter a valid age for a dog (up to 20 years).');
        isValid = false;
        if (!petNameError) ageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (petType === 'Cat' && (ageNumber > 30 || (ageUnit === 'years' && ageNumber > 20))) {
        setAgeError('Please enter a valid age for a cat (up to 20 years).');
        isValid = false;
        if (!petNameError) ageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    if (!petBreed) {
      setPetBreedError('Pet Breed is required.');
      isValid = false;
      if (!petNameError && !ageError) petBreedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (!petGender) {
      setGenderError('Pet gender is required.');
      isValid = false;
      if (!petNameError && !ageError && !petBreedError) genderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (isVaccinated === null) {
      setVaccinationError('Please specify if the pet is vaccinated.');
      isValid = false;
      if (!petNameError && !ageError && !petBreedError && !genderError) vaccinationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (isVaccinated && !shotsUpToDate) {
      setVaccinationError('Please specify if shots are up to date.');
      isValid = false;
      if (!petNameError && !ageError && !petBreedError && !genderError) vaccinationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (petType === 'Dog' && isNeutered === null) {
      setNeuteredError('Please specify if the dog is neutered.');
      isValid = false;
      if (!petNameError && !ageError && !petBreedError && !genderError && !vaccinationError) neuteredRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (petType === 'Cat' && isSpayed === null) {
      setSpayedError('Please specify if the cat is spayed.');
      isValid = false;
      if (!petNameError && !ageError && !petBreedError && !genderError && !vaccinationError) spayedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (!image) {
      setImageError('Image is required.');
      isValid = false;
      if (!petNameError && !ageError && !petBreedError && !genderError && !vaccinationError && !neuteredError && !spayedError) imageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (!reasonForRehoming) {
      setReasonError('Please provide a reason for rehoming.');
      isValid = false;
      if (!petNameError && !ageError && !petBreedError && !genderError && !vaccinationError && !neuteredError && !spayedError && !imageError) reasonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return isValid;
  };

  const validateStep2 = () => {
    setOwnerNameError(null);
    setStateError(null);
    setCityError(null);
    setContactError(null);

    let isValid = true;

    if (!ownerName) {
      setOwnerNameError('Owner Name is required.');
      isValid = false;
      ownerNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (!selectedState) {
      setStateError('State is required.');
      isValid = false;
      if (!ownerNameError) stateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (!selectedCity) {
      setCityError('City is required.');
      isValid = false;
      if (!ownerNameError && !stateError) cityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (!contact) {
      setContactError('Contact information is required.');
      isValid = false;
      if (!ownerNameError && !stateError && !cityError) contactRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
      setContactError('Please enter a valid email address.');
      isValid = false;
      if (!ownerNameError && !stateError && !cityError) contactRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return isValid;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 2 || !validateStep2()) return;

    let imageUrl: string | null = null;
    try {
      setLoading(true);
      if (image) { imageUrl = await handleImageUpload(image); }
      if (!user?.id) { setError('User is not authenticated'); return; }

      const newPet: Pet = {
        name: petName,
        age: parseInt(age, 10),
        ageUnit,
        petType,
        petBreed,
        state: selectedState,
        city: selectedCity,
        contact,
        image: imageUrl,
        userId: user.id,
        gender: petGender,
        isVaccinated: isVaccinated!,
        shotsUpToDate,
        isNeutered,
        isSpayed,
        goodWithDogs,
        goodWithCats,
        goodWithKids,
        reasonForRehoming,
      };

      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPet),
      });

      if (response.ok) {
        setFormSubmitted(true);
        setError(null);
        toast.success('Pet posted successfully!', { position: 'bottom-center' });
        setTimeout(() => router.push('/list-a-pet'), 2000);
      } else {
        const errorMessage = await response.text();
        setError(`Failed to post pet: ${errorMessage}`);
        toast.error(`Failed to post pet: ${errorMessage}`, { position: 'bottom-center' });
      }
    } catch (err: any) {
      setError(`Failed to post pet: ${err.message}`);
      toast.error(`Failed to post pet: ${err.message}`, { position: 'bottom-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex items-center justify-center">
      <Toaster position="top-center" />
      <div className="container max-w-lg bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Rehome a Pet</h1>
        {formSubmitted ? (
          <div className="text-center text-green-600 text-lg mb-6">
            <BeatLoader color="#36D7B7" size={16} />
            <p className="mt-2">Your pet has been posted successfully! Redirecting...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-center text-red-500 text-sm mb-4">{error}</div>}

            {/* Step 1: Pet Details */}
            {step === 1 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Pet Details</h2>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="petName" className="block text-gray-700 text-sm font-bold mb-2">
                      Pet's Name?
                    </label>
                    <input
                      ref={petNameRef}
                      type="text"
                      id="petName"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${petNameError ? 'border-red-500' : ''}`}
                      placeholder="Please enter your pet's name..."
                    />
                    {petNameError && <p className="text-red-500 text-xs italic">{petNameError}</p>}
                  </div>
                  <div>
                    <label htmlFor="petType" className="block text-gray-700 text-sm font-bold mb-2">
                      Pet Type?
                    </label>
                    <select
                      id="petType"
                      value={petType}
                      onChange={(e) => setPetType(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                    </select>
                  </div>
                  <div ref={petBreedRef}>
                    <label htmlFor="petBreed" className="block text-gray-700 text-sm font-bold mb-2">
                      Pet Breed?
                    </label>
                    <Select
                      id="petBreed"
                      value={breedOptions.find(option => option.value === petBreed)}
                      onChange={(option) => setPetBreed(option?.value || '')}
                      options={breedOptions}
                      className={petBreedError ? 'border-red-500' : 'border-gray-300'}
                      placeholder="Select or search breed..."
                    />
                    {petBreedError && <p className="text-red-500 text-xs italic">{petBreedError}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Age of your Pet?
                    </label>
                    <div className="flex space-x-2">
                      <input
                        ref={ageRef}
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className={`shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${ageError ? 'border-red-500' : ''}`}
                        placeholder="Enter pet age"
                      />
                      <select
                        value={ageUnit}
                        onChange={(e) => setAgeUnit(e.target.value)}
                        className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                      </select>
                    </div>
                    {ageError && <p className="text-red-500 text-xs italic">{ageError}</p>}
                  </div>
                  <div ref={genderRef}>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Pet Gender?
                    </label>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setPetGender('Male')}
                        className={`px-4 py-2 border rounded ${petGender === 'Male' ? 'bg-orange-500 text-white' : 'bg-white'}`}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => setPetGender('Female')}
                        className={`px-4 py-2 border rounded ${petGender === 'Female' ? 'bg-orange-500 text-white' : 'bg-white'}`}
                      >
                        Female
                      </button>
                    </div>
                    {genderError && <p className="text-red-500 text-xs italic">{genderError}</p>}
                  </div>
                  <div ref={vaccinationRef}>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Pet Vaccinated?
                    </label>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsVaccinated(true)}
                        className={`px-4 py-2 border rounded ${isVaccinated === true ? 'bg-orange-500 text-white' : 'bg-white'}`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsVaccinated(false)}
                        className={`px-4 py-2 border rounded ${isVaccinated === false ? 'bg-orange-500 text-white' : 'bg-white'}`}
                      >
                        No
                      </button>
                    </div>
                    {isVaccinated && (
                      <div className="mt-4">
                        <label htmlFor="shotsUpToDate" className="block text-gray-700 text-sm font-bold mb-2">
                          Shots up to date?
                        </label>
                        <input
                          type="text"
                          id="shotsUpToDate"
                          value={shotsUpToDate}
                          onChange={(e) => setShotsUpToDate(e.target.value)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          placeholder="Enter date or details"
                        />
                      </div>
                    )}
                    {vaccinationError && <p className="text-red-500 text-xs italic">{vaccinationError}</p>}
                  </div>
                  {petType === 'Dog' && (
                    <div ref={neuteredRef}>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Pet Neutered? (Dogs)</label>
                      <div className="flex space-x-4">
                        <button type="button" onClick={() => setIsNeutered(true)} className={`px-4 py-2 border rounded ${isNeutered === true ? 'bg-orange-500 text-white' : 'bg-white'}`}>Yes</button>
                        <button type="button" onClick={() => setIsNeutered(false)} className={`px-4 py-2 border rounded ${isNeutered === false ? 'bg-orange-500 text-white' : 'bg-white'}`}>No</button>
                      </div>
                      {neuteredError && <p className="text-red-500 text-xs italic">{neuteredError}</p>}
                    </div>
                  )}
                  {petType === 'Cat' && (
                    <div ref={spayedRef}>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Pet Spayed? (Cats)</label>
                      <div className="flex space-x-4">
                        <button type="button" onClick={() => setIsSpayed(true)} className={`px-4 py-2 border rounded ${isSpayed === true ? 'bg-orange-500 text-white' : 'bg-white'}`}>Yes</button>
                        <button type="button" onClick={() => setIsSpayed(false)} className={`px-4 py-2 border rounded ${isSpayed === false ? 'bg-orange-500 text-white' : 'bg-white'}`}>No</button>
                      </div>
                      {spayedError && <p className="text-red-500 text-xs italic">{spayedError}</p>}
                    </div>
                  )}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Pet is good with Dogs?</label>
                    <div className="flex space-x-4">
                      <button type="button" onClick={() => setGoodWithDogs(true)} className={`px-4 py-2 border rounded ${goodWithDogs === true ? 'bg-orange-500 text-white' : 'bg-white'}`}>Yes</button>
                      <button type="button" onClick={() => setGoodWithDogs(false)} className={`px-4 py-2 border rounded ${goodWithDogs === false ? 'bg-orange-500 text-white' : 'bg-white'}`}>No</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Pet is good with Cats?</label>
                    <div className="flex space-x-4">
                      <button type="button" onClick={() => setGoodWithCats(true)} className={`px-4 py-2 border rounded ${goodWithCats === true ? 'bg-orange-500 text-white' : 'bg-white'}`}>Yes</button>
                      <button type="button" onClick={() => setGoodWithCats(false)} className={`px-4 py-2 border rounded ${goodWithCats === false ? 'bg-orange-500 text-white' : 'bg-white'}`}>No</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Pet is good with Kids?</label>
                    <div className="flex space-x-4">
                      <button type="button" onClick={() => setGoodWithKids(true)} className={`px-4 py-2 border rounded ${goodWithKids === true ? 'bg-orange-500 text-white' : 'bg-white'}`}>Yes</button>
                      <button type="button" onClick={() => setGoodWithKids(false)} className={`px-4 py-2 border rounded ${goodWithKids === false ? 'bg-orange-500 text-white' : 'bg-white'}`}>No</button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
                      Upload Image
                    </label>
                    <input
                      ref={imageRef}
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${imageError ? 'border-red-500' : ''}`}
                    />
                    {imageError && <p className="text-red-500 text-xs italic">{imageError}</p>}
                  </div>
                  <div>
                    <label htmlFor="reasonForRehoming" className="block text-gray-700 text-sm font-bold mb-2">
                      Why do you want to donate the Pet?
                    </label>
                    <textarea
                      ref={reasonRef}
                      id="reasonForRehoming"
                      value={reasonForRehoming}
                      onChange={(e) => setReasonForRehoming(e.target.value)}
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${reasonError ? 'border-red-500' : ''}`}
                      placeholder="Please explain why you want to donate the pet..."
                    />
                    {reasonError && <p className="text-red-500 text-xs italic">{reasonError}</p>}
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Owner Details */}
            {step === 2 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Owner Details</h2>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="ownerName" className="block text-gray-700 text-sm font-bold mb-2">
                      Your Name
                    </label>
                    <input
                      ref={ownerNameRef}
                      type="text"
                      id="ownerName"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${ownerNameError ? 'border-red-500' : ''}`}
                      placeholder="Enter your name"
                    />
                    {ownerNameError && <p className="text-red-500 text-xs italic">{ownerNameError}</p>}
                  </div>
                  <div ref={stateRef}>
                    <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2">
                      Your State
                    </label>
                    <StateDropdown selectedState={selectedState} onStateChange={handleStateChange} />
                    {stateError && <p className="text-red-500 text-xs italic">{stateError}</p>}
                  </div>
                  <div ref={cityRef}>
                    <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">
                      Your City
                    </label>
                    <CityDropdown stateId={selectedStateId} selectedCity={selectedCity} onCityChange={setSelectedCity} />
                    {cityError && <p className="text-red-500 text-xs italic">{cityError}</p>}
                  </div>
                  <div>
                    <label htmlFor="contact" className="block text-gray-700 text-sm font-bold mb-2">
                      Contact Information
                    </label>
                    <input
                      ref={contactRef}
                      type="text"
                      id="contact"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${contactError ? 'border-red-500' : ''}`}
                      placeholder="Enter your email address"
                    />
                    {contactError && <p className="text-red-500 text-xs italic">{contactError}</p>}
                  </div>
                </div>
                {/* <FormReminder message="You'll receive adoption requests via email from potential adopters. Keep an eye on your inbox to review and respond to these requests. Thank you for helping give your pet a new loving home!" /> */}
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <BeatLoader color="white" size={8} margin={3} />
                        <span className="ml-2">Posting...</span>
                      </div>
                    ) : (
                      'Post for Adoption'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default PetListingForm;