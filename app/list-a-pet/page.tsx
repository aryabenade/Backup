// ListAPet component in app/list-a-pet/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import PetCard from '../components/PetCard';
import Link from 'next/link';
import { Pet } from '../types';
import { useUser } from '@clerk/nextjs';
import { redirect, useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

const ListAPet: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  
  const { user } = useUser();
    if (!user) {
      redirect('/sign-in')
    }

  const router = useRouter();

  useEffect(() => {
    const fetchUserPets = async () => {
      try {
        const response = await fetch('/api/pets');
        if (response.ok) {
          const data: Pet[] = await response.json();
          const userPets = data.filter(pet => pet.userId === user?.id); // Filter pets by the logged-in user's ID
          setPets(userPets);
        } else {
          console.error('Failed to fetch pets');
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };

    fetchUserPets();
  }, [user?.id]);

  const handleEdit = (pet: Pet) => {
    // Navigate to the EditPetForm page with the pet ID
    router.push(`/edit-pet/${pet.id}`);
  };

  const handleDelete = async (petId: number) => {
    try {
      const response = await fetch('/api/deletePet', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: petId }),
      });
      if (response.ok) {
        setPets((prevPets) => prevPets.filter((pet) => pet.id !== petId));
      } else {
        console.error('Failed to delete pet');
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mt-10">List a Pet</h1>
        <p className="text-center mt-4 text-lg">
          Post your pet for adoption or browse through available pets.
        </p>
        <div className="flex justify-center mt-8">
          <Link href="/list-a-pet/new" className="bg-blue-500 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-600">
            Post a Pet for Adoption
          </Link>
        </div>
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 text-center">Your Pets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                name={pet.name}
                age={pet.age}
                category={pet.category}
                breed={pet.breed}
                state={pet.state}
                city={pet.city}
                contact={pet.contact}
                image={pet.image}
                onEdit={() => handleEdit(pet)}
                onDelete={() => handleDelete(pet.id!)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListAPet;
