//PetCard component in app/components/PetCard.tsx
import React from 'react';

interface PetCardProps {
  id?: number;
  name: string;
  age: number;
  category: string;
  breed: string;
  state: string;
  city: string;
  contact: string;
  image?: string | null;
  onAdopt?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PetCard: React.FC<PetCardProps> = ({ name, age, category, breed, state, city, contact, image, onAdopt, onEdit, onDelete }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      {image && <img src={image} alt={name} className="w-full h-48 object-cover rounded-lg" />}
      <div className="mt-4">
        <h2 className="text-xl font-bold">{name}</h2>
        <p>Age: {age}</p>
        <p>Category: {category}</p>
        <p>Breed: {breed}</p>
        <p>Location: {city}, {state}</p>
        <p>Contact: {contact}</p>
        <div className="mt-4 text-center space-x-2">
          {onAdopt && (
            <button onClick={onAdopt} className="px-4 py-2 bg-green-600 text-lg font-medium text-white rounded-lg">
              Adopt
            </button>
          )}
          {onEdit && (
            <button onClick={onEdit} className="px-4 py-2 bg-blue-600 text-lg font-medium text-white rounded-lg">
              Edit
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="px-4 py-2 bg-red-600 text-lg font-medium text-white rounded-lg">
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetCard;
