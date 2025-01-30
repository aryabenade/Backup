// AdoptAPet component in app/adopt-a-pet/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import PetCard from '../components/PetCard';
import Navbar from '../components/Navbar';
import { Pet } from '../types';
import { useUser } from '@clerk/nextjs';
import { redirect, useRouter } from 'next/navigation';

const AdoptAPet: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const { user } = useUser();
  const router = useRouter();

  if (!user) {
    redirect('/sign-in');
  }

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch('/api/pets');
        if (response.ok) {
          const data: Pet[] = await response.json();
          console.log('User ID:', user?.id); // Log the user ID
          console.log('All pets:', data); // Log all fetched pets
          const otherPets = data.filter(pet => pet.userId !== user?.id); // Filter out pets posted by the logged-in user
          console.log('Filtered pets (not posted by user):', otherPets); // Log filtered pets
          setPets(otherPets);
        } else {
          console.error('Failed to fetch pets');
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };

    if (user?.id) {
      fetchPets();
    }
  }, [user?.id]);

  const handleAdopt = (petId: number) => {
    router.push(`/adopt-a-pet/adopt?petId=${petId}`);
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mt-10">Adopt a Pet</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
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
              onAdopt={() => pet.id && handleAdopt(pet.id)} // Ensure pet.id is defined
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdoptAPet;
