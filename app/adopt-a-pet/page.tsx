// AdoptAPet component in app/adopt-a-pet/page.tsx

"use client";
import React, { useEffect, useState } from 'react';
import PetCard from '../components/PetCard';
import Navbar from '../components/Navbar';
import { Pet } from '../types';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import StateDropdown from '../components/StateDropdown'; 
import CityDropdown from '../components/CityDropdown';

const AdoptAPet: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [selectedPetType, setSelectedPetType] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedStateId, setSelectedStateId] = useState(0);
  const [selectedCity, setSelectedCity] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    const fetchPets = async () => {
      try {
        const response = await fetch('/api/pets');
        if (response.ok) {
          const data: Pet[] = await response.json();
          const otherPets = data.filter(pet => pet.userId !== user.id);
          setPets(otherPets);
          setFilteredPets(otherPets);
        } else {
          console.error('Failed to fetch pets');
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [user, router]);


  const handleAdopt = (petId: number) => {
    router.push(`/adopt-a-pet/form?petId=${petId}`);
  };


  const handleStateChange = (stateName: string, stateId: number) => {
    setSelectedState(stateName);
    setSelectedStateId(stateId);
    setSelectedCity(''); // Reset city when state changes
  };

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
  };

  const applyFilters = () => {
    let filtered = pets;

    if (selectedPetType) {
      filtered = filtered.filter(pet => pet.petType === selectedPetType);
    }
    if (selectedState) {
      filtered = filtered.filter(pet => pet.state === selectedState);
    }
    if (selectedCity) {
      filtered = filtered.filter(pet => pet.city === selectedCity);
    }

    setFilteredPets(filtered);
    setShowFilters(false);
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 min-h-screen">
        <div className="flex justify-between items-center mt-8 mb-4">
          <button
            onClick={() => {
              setShowFilters(!showFilters);
            }}
            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200 w-32"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>


          <div className="flex-grow flex justify-center">
            <h1 className="text-4xl font-bold">Adopt a Pet</h1>
          </div>

          <div className="w-48"></div> {/* This div helps balance the layout */}
        </div>
        {showFilters && (
          <div className="bg-gray-100 p-4 rounded-md shadow-md mb-6 relative">
            {/* "Clear All Filters" button in the top right corner */}
            <button
              onClick={() => {
                setSelectedPetType('');
                setSelectedState('');
                setSelectedStateId(0);
                setSelectedCity('');
              }}
              className="absolute top-4 font-semibold right-4 text-blue-600 hover:underline"
            >
              Clear All Filters
            </button>

            <div className="flex flex-col space-y-4">
              <div>
                <label htmlFor="petType" className="block text-gray-700 text-sm font-bold mb-2">
                  Pet Type
                </label>
                <select
                  id="petType"
                  value={selectedPetType}
                  onChange={(e) => setSelectedPetType(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow appearance-none"
                >
                  <option value="">All</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                </select>
              </div>
              <div>
                <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2">
                  State
                </label>
                <StateDropdown selectedState={selectedState} onStateChange={handleStateChange} />
              </div>
              <div>
                <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">
                  City
                </label>
                <CityDropdown stateId={selectedStateId} selectedCity={selectedCity} onCityChange={handleCityChange} />
              </div>
              <button
                onClick={applyFilters}
                className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <p className="text-2xl font-bold">Loading...</p>
          </div>
        ) : filteredPets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {filteredPets.map((pet) => (
              <PetCard
                key={pet.id}
                name={pet.name}
                age={pet.age}
                ageUnit={pet.ageUnit}
                petType={pet.petType}
                petBreed={pet.petBreed}
                state={pet.state}
                city={pet.city}
                contact={pet.contact}
                image={pet.image}
                onAdopt={() => pet.id && handleAdopt(pet.id)} // Ensure pet.id is defined
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-screen">
            <p className="text-2xl font-bold">No pets available based on the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdoptAPet;
