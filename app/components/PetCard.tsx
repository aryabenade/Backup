//  PetCard component in app/components/PetCard.tsx
import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface PetCardProps {
  id?: number;
  name: string;
  age: number;
  ageUnit: string;
  petType: string;
  petBreed: string;
  state: string;
  city: string;
  contact: string;
  image?: string | null;
  onAdopt?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdoptPage?: boolean;
  onToggleFavorite?: (petId: number, isFavorited: boolean) => Promise<void>;
  isFavorited?: boolean;
  createdAt?: Date;
}

const PetCard: React.FC<PetCardProps> = ({
  id,
  name,
  age,
  ageUnit,
  petType,
  petBreed,
  state,
  city,
  contact,
  image,
  onAdopt,
  onEdit,
  onDelete,
  isAdoptPage = false,
  onToggleFavorite,
  isFavorited = false,
  createdAt,
}) => {
  const [isAdoptLoading, setIsAdoptLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);

  const formatDate = (date?: Date) => {
    if (!date) return "Unknown date";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleAdoptClick = () => {
    setIsAdoptLoading(true);
    onAdopt?.();
  };

  const handleEditClick = () => {
    setIsEditLoading(true);
    onEdit?.();
  };

  const handleDeleteClick = () => {
    onDelete?.();
  };

  const handleFavoriteClick = () => {
    if (id && onToggleFavorite) {
      onToggleFavorite(id, isFavorited);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition relative h-full flex flex-col">
      {image ? (
        <img src={image} alt={name} className="w-full h-48 object-cover rounded-md mb-4" />
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
          <span className="text-gray-600">No Image</span>
        </div>
      )}

      <div className="absolute top-2 left-2 bg-gray-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
        Posted on {formatDate(createdAt)}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-gray-800">{name}</h2>
        {isAdoptPage && id && (
          <button
            onClick={handleFavoriteClick}
            className="text-2xl text-orange-500 hover:text-orange-600 transition duration-300 focus:outline-none"
          >
            {isFavorited ? <FaHeart /> : <FaRegHeart />}
          </button>
        )}
      </div>
      <div className="text-gray-800 space-y-1 flex-grow">
        <p>Age: {age} {ageUnit}</p>
        <p>Type: {petType}</p>
        <p>Breed: {petBreed}</p>
        <p>Location: {city}, {state}</p>
        <p>Contact: {contact}</p>
      </div>
      <div className="mt-4 flex justify-center space-x-3">
        {onAdopt && (
          <button
            onClick={handleAdoptClick}
            className={`px-6 py-2 bg-orange-500 text-white font-semibold rounded-full shadow-md text-lg hover:bg-orange-600 transition duration-300 ${isAdoptLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={isAdoptLoading}
          >
            {isAdoptLoading ? 'Loading...' : 'Adopt'}
          </button>
        )}
        {onEdit && (
          <button
            onClick={handleEditClick}
            className={`px-6 py-2 bg-orange-500 text-lg text-white font-semibold rounded-full shadow-md hover:bg-orange-600 transition duration-300 ${isEditLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={isEditLoading}
          >
            {isEditLoading ? 'Loading...' : 'Edit'}
          </button>
        )}
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            className="px-6 py-2 bg-red-600 text-lg text-white font-semibold rounded-full shadow-md hover:bg-red-700 transition duration-300"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default PetCard;