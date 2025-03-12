// //  PetCard component in app/components/PetCard.tsx
import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Link from 'next/link'; // Import Link for navigation
import { Pet } from '@/app/types'; // Import the Pet interface

const PetCard: React.FC<{
  pet: Pet; // Use the Pet interface instead of individual props
  onEdit?: () => void;
  onDelete?: () => void;
  isAdoptPage?: boolean;
  onToggleFavorite?: (petId: number, isFavorited: boolean) => Promise<void>;
  isFavorited?: boolean;
}> = ({
  pet,
  onEdit,
  onDelete,
  isAdoptPage = false,
  onToggleFavorite,
  isFavorited = false,
}) => {
  const formatDate = (date?: Date) => {
    if (!date) return "Unknown date";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleFavoriteClick = () => {
    if (pet.id && onToggleFavorite) {
      onToggleFavorite(pet.id, isFavorited);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition relative h-full flex flex-col">
      {pet.image ? (
        <img src={pet.image} alt={pet.name} className="w-full h-48 object-cover rounded-md mb-4" />
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
          <span className="text-gray-600">No Image</span>
        </div>
      )}

      <div className="absolute top-2 left-2 bg-gray-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
        Posted on {formatDate(pet.createdAt)}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-gray-800">{pet.name}</h2>
        {isAdoptPage && pet.id && (
          <button
            onClick={handleFavoriteClick}
            className="text-2xl text-orange-500 hover:text-orange-600 transition duration-300 focus:outline-none"
          >
            {isFavorited ? <FaHeart /> : <FaRegHeart />}
          </button>
        )}
      </div>
      <div className="text-gray-800 space-y-1 flex-grow">
        <p>Age: {pet.age} {pet.ageUnit}</p>
        <p>Type: {pet.petType}</p>
        <p>Breed: {pet.petBreed}</p>
        <p>Location: {pet.city}, {pet.state}</p>
        {/* Removed contact from the card to show on details page */}
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
        {onEdit && (
          <button
            onClick={onEdit}
            className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-full shadow-md text-lg hover:bg-orange-600 transition duration-300"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-full shadow-md text-lg hover:bg-red-700 transition duration-300"
          >
            Delete
          </button>
        )}
        <Link
          href={`/pet/${pet.id}`}
          className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-full shadow-md text-lg hover:bg-orange-600 transition duration-300 text-center"
        >
          View More
        </Link>
      </div>
    </div>
  );
};

export default PetCard;