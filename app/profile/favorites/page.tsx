// Path: app/profile/favorites/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import PetCard from '@/app/components/PetCard';
import { Pet } from '@/app/types';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { fetchFavoritesForUser, removeFavorite } from './favorites'; // Import server actions
import { toast, Toaster } from 'react-hot-toast';

const FavoritesPage: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();
  const [favoritePets, setFavoritePets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
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
  }, [user, router]);

  const handleAdopt = (petId: number) => {
    router.push(`/adopt-a-pet/form?petId=${petId}`);
  };

  const handleToggleFavorite = async (petId: number, isFavorited: boolean) => {
    if (!user || !isFavorited) return; // Only allow removal since it's already favorited

    try {
      await removeFavorite(user.id, petId);
      setFavoritePets(prevPets => prevPets.filter(pet => pet.id !== petId));
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {favoritePets.map((pet) => (
          <PetCard
            key={pet.id}
            id={pet.id}
            name={pet.name}
            age={pet.age}
            ageUnit={pet.ageUnit}
            petType={pet.petType}
            petBreed={pet.petBreed}
            state={pet.state}
            city={pet.city}
            contact={pet.contact}
            image={pet.image}
            onAdopt={() => pet.id && handleAdopt(pet.id)}
            isAdoptPage={true} // Enable heart icon
            onToggleFavorite={handleToggleFavorite}
            isFavorited={true} // All pets here are favorited
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 min-h-screen">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <p className="text-2xl font-bold">Loading...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center mt-10">
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
