// PetListingForm component in app/list-a-pet/new/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Pet } from '../../types';

const PetListingForm: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [category, setCategory] = useState('');
  const [breed, setBreed] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [contact, setContact] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to handle image upload
  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'my_upload_preset'); // Use your actual upload preset name
    const response = await fetch('/api/uploadImage', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.url; // This is the URL of the uploaded image
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !category || !breed || !state || !city || !contact) {
      alert('Please fill out all fields.');
      return;
    }

    let imageUrl: string | null = null;
    if (image) {
      imageUrl = await handleImageUpload(image);
    }

    if (!user?.id) {
      setError('User is not authenticated');
      return;
    }

    const newPet: Pet = {
      name,
      age: parseInt(age, 10),
      category,
      breed,
      state,
      city,
      contact,
      image: imageUrl,
      userId: user.id,  // Ensure userId is not undefined
    };

    try {
      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPet),
      });

      if (response.ok) {
        setFormSubmitted(true);
        setError(null);
        setTimeout(() => {
          router.push('/list-a-pet');
        }, 2000);
      } else {
        const errorMessage = await response.text();
        setError(`Failed to post pet: ${errorMessage}`);
      }
    } catch (err) {
      setError(`Failed to post pet: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mt-10">Post a Pet for Adoption</h1>
      {formSubmitted ? (
        <div className="text-center text-green-500 text-lg mt-6">
          Your pet has been posted successfully!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8">
          {error && (
            <div className="text-center text-red-500 text-lg mb-4">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-lg mb-2" htmlFor="name">Pet Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg mb-2" htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg mb-2" htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg mb-2" htmlFor="breed">Breed</label>
            <input
              type="text"
              id="breed"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg mb-2" htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg mb-2" htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg mb-2" htmlFor="contact">Contact Information</label>
            <input
              type="text"
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg mb-2" htmlFor="image">Upload Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="text-center">
            <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-600">
              Post for Adoption
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PetListingForm;
