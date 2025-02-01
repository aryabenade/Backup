'use client';

import React, { useEffect, useState } from 'react';
import { Pet } from '../../types';
import PetCard from '../../components/PetCard';

const Pets: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch('/api/pets');
        const data = await response.json();

        // Ensure data is an array
        if (Array.isArray(data)) {
          setPets(data);
        } else {
          console.error('Expected data to be an array');
          setPets([]);
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
        setPets([]);
      }
    };

    fetchPets();
  }, []);

  return (
    <div>

      <h2 className="text-3xl font-bold mb-4">Pets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.map((pet) => (
          <PetCard
            key={pet.id}
            id={pet.id}
            name={pet.name}
            age={pet.age}
            category={pet.category}
            breed={pet.breed}
            state={pet.state}
            city={pet.city}
            contact={pet.contact}
            image={pet.image}
            onEdit={() => console.log(`Edit pet ${pet.id}`)}
            onDelete={() => console.log(`Delete pet ${pet.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default Pets;
