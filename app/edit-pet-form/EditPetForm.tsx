// EditPetForm component in app/edit-pet-form/EditPetForm.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Pet } from '../types';

interface EditPetFormProps {
  pet: Pet;
}

const EditPetForm: React.FC<EditPetFormProps> = ({ pet }) => {
  const [name, setName] = useState(pet.name);
  const [age, setAge] = useState(pet.age.toString());
  const [category, setCategory] = useState(pet.category);
  const [breed, setBreed] = useState(pet.breed);
  const [state, setState] = useState(pet.state);
  const [city, setCity] = useState(pet.city);
  const [contact, setContact] = useState(pet.contact);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Function to handle image upload
  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/uploadImage', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.url;
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !category || !breed || !state || !city || !contact) {
      alert('Please fill out all fields.');
      return;
    }

    let imageUrl = pet.image;
    if (image) {
      imageUrl = await handleImageUpload(image);
    }

    const updatedPet = {
      ...pet,
      name,
      age: parseInt(age, 10),
      category,
      breed,
      state,
      city,
      contact,
      image: imageUrl,
    };

    try {
      const response = await fetch('/api/updatePet', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPet),
      });

      if (response.ok) {
        router.push('/list-a-pet');
      } else {
        const errorMessage = await response.text();
        setError(`Failed to update pet: ${errorMessage}`);
      }
    } catch (err) {
      setError(`Failed to update pet: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mt-10">Edit Pet Details</h1>
      {error && (
        <div className="text-center text-red-500 text-lg mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8">
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
            Update Pet
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPetForm;
