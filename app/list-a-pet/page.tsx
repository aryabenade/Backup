//app/list-a-pet/page.tsx
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
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [popupMessage, setPopupMessage] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupAction, setPopupAction] = useState<() => void>(() => {});
  const [loading, setLoading] = useState(true); // Add loading state

  const handleConfirmAction = () => {
    popupAction();
    setIsPopupOpen(false);
  };

  const handleCancelAction = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    // Wait until Clerk has loaded the user state
    if (!isLoaded) return; // Do nothing while loading

    // If user is not signed in, redirect to sign-in page
    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    const fetchUserPets = async () => {
      try {
        const response = await fetch('/api/pets');
        if (response.ok) {
          const data: Pet[] = await response.json();
          const userPets = data.filter((pet) => pet.userId === user!.id);
          setPets(userPets);
        } else {
          console.error('Failed to fetch pets');
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
      } finally {
        setLoading(false); // Set loading to false once fetch is complete
      }
    };

    fetchUserPets();
  }, [isLoaded, isSignedIn, user, router]);

  const handleEdit = (pet: Pet) => {
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
          position: 'bottom-center',
        });
      } else {
        console.error('Failed to delete pet');
        toast.error('Failed to delete pet!', {
          position: 'bottom-center',
        });
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
      toast.error('Error deleting pet!', {
        position: 'bottom-center',
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
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-extrabold text-gray-800 text-center mt-10">
          List a Pet
        </h1>
        <p className="text-center mt-4 font-medium text-lg text-gray-600 max-w-2xl mx-auto">
          Post your pet for adoption or browse through available pets.
        </p>
        <div className="flex justify-center mt-8">
          <Link
            href="/list-a-pet/form"
            className="bg-orange-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-orange-600 transition duration-300"
          >
            Post a Pet for Adoption
          </Link>
        </div>

        {/* Loading state within the content area */}
        {loading || !isLoaded ? (
          <div className="flex justify-center items-center min-h-[30vh]">
            <p className="text-2xl font-bold text-gray-800">Loading...</p>
          </div>
        ) : pets.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Your Pets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet} // Pass the entire pet object
                  // onEdit={() => handleEdit(pet)}
                  onDelete={() => handleDeleteClick(pet.id!)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[30vh]">
            <p className="text-2xl font-bold text-gray-800">
              You haven’t listed any pets yet.
            </p>
          </div>
        )}
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