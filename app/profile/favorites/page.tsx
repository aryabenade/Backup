//app/profile/favorites/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import PetCard from '@/app/components/PetCard';
import { Pet } from '@/app/types';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { fetchFavoritesForUser, removeFavorite } from './favorites';
import { toast, Toaster } from 'react-hot-toast';

const FavoritesPage: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [favoritePets, setFavoritePets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return; // Wait for Clerk to load

    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    const loadFavorites = async () => {
      try {
        const pets = await fetchFavoritesForUser(user.id);
        setFavoritePets(pets);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error('Failed to load favorites!', { position: 'bottom-center' });
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [isLoaded, isSignedIn, user, router]);


  const handleToggleFavorite = async (petId: number, isFavorited: boolean) => {
    if (!user || !isFavorited) return;

    try {
      await removeFavorite(user.id, petId);
      setFavoritePets((prevPets) => prevPets.filter((pet) => pet.id !== petId));
      toast.success('Removed from favorites!', { position: 'bottom-center' });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite!', { position: 'bottom-center' });
    }
  };

  const renderFavorites = () => {
    if (favoritePets.length === 0) {
      return null;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favoritePets.map((pet) => (
        <PetCard
          key={pet.id}
          pet={pet} // Pass the full pet object
          isAdoptPage={true}
          onToggleFavorite={handleToggleFavorite}
          isFavorited={true}
        />
      ))}
    </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        {loading || !isLoaded ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <p className="text-2xl font-bold text-gray-800">Loading...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center mt-10 text-gray-800">
              {favoritePets.length > 0 ? 'Your Favorite Pets' : 'No Favorite Pets Found'}
            </h2>
            {renderFavorites()}
          </>
        )}
        <Toaster />
      </div>
    </div>
  );
};

export default FavoritesPage;