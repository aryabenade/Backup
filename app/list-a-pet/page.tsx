// ListAPet component in app/list-a-pet/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import PetCard from '../components/PetCard';
import Link from 'next/link';
import { Pet } from '../types';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Popup from '../components/Popup';
import { toast, Toaster } from 'react-hot-toast';

const ListAPet: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [popupMessage, setPopupMessage] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupAction, setPopupAction] = useState<() => void>(() => {});

  // Function to handle confirming popup action
  const handleConfirmAction = () => {
    popupAction();
    setIsPopupOpen(false);
  };

  // Function to handle cancelling popup action
  const handleCancelAction = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    const fetchUserPets = async () => {
      try {
        const response = await fetch('/api/pets');
        if (response.ok) {
          const data: Pet[] = await response.json();
          const userPets = data.filter(pet => pet.userId === user.id); // Filter pets by the logged-in user's ID
          setPets(userPets);
        } else {
          console.error('Failed to fetch pets');
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };

    fetchUserPets();
  }, [user, router]);

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
        toast.success('Pet deleted successfully!', {
          position: 'bottom-center'
        });
      } else {
        console.error('Failed to delete pet');
        toast.error('Failed to delete pet!', {
          position: 'bottom-center'
        });
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
      toast.error('Error deleting pet!', {
        position: 'bottom-center'
      });
    }
  };

  const handleDeleteClick = (petId: number) => {
    setPopupMessage('Are you sure you want to delete this pet?');
    setPopupAction(() => async () => {
      await handleDelete(petId);
    });
    setIsPopupOpen(true);
  };

  

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 min-h-screen">
        <h1 className="text-4xl font-bold text-center mt-10">List a Pet</h1>
        <p className="text-center mt-4 text-lg">
          Post your pet for adoption or browse through available pets.
        </p>
        <div className="flex justify-center mt-8">
          <Link href="/list-a-pet/form" className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700">
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
                ageUnit={pet.ageUnit}
                petType={pet.petType}
                petBreed={pet.petBreed}
                state={pet.state}
                city={pet.city}
                contact={pet.contact}
                image={pet.image}
                onEdit={() => handleEdit(pet)}
                onDelete={() => handleDeleteClick(pet.id!)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Popup */}
      <Popup
        message={popupMessage}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
        isOpen={isPopupOpen}
      />

      {/* Toaster */}
      <Toaster />
    </div>
  );
};

export default ListAPet;
