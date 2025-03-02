// //  PetCard component in app/components/PetCard.tsx
// import React, { useState } from 'react';

// interface PetCardProps {
//   id?: number;
//   name: string;
//   age: number;
//   ageUnit: string;
//   petType: string;
//   petBreed: string;
//   state: string;
//   city: string;
//   contact: string;
//   image?: string | null;
//   onAdopt?: () => void;
//   onEdit?: () => void;
//   onDelete?: () => void;
// }

// const PetCard: React.FC<PetCardProps> = ({ name, age, ageUnit, petType, petBreed, state, city, contact, image, onAdopt, onEdit, onDelete }) => {
//   const [isAdoptLoading, setIsAdoptLoading] = useState(false);
//   const [isEditLoading, setIsEditLoading] = useState(false);

//   const handleAdoptClick = () => {
//     setIsAdoptLoading(true);
//     onAdopt?.();
//   };

//   const handleEditClick = () => {
//     setIsEditLoading(true);
//     onEdit?.();
//   };

//   const handleDeleteClick = () => {
//     onDelete?.();
//   };

//   return (
//     <div className="p-4 border rounded-lg shadow-sm">
//       {image && <img src={image} alt={name} className="w-full h-48 object-cover rounded-lg" />}
//       <div className="mt-4">
//         <h2 className="text-xl font-bold">{name}</h2>
//         <p>Age: {age} {ageUnit}</p>
//         <p>Pet Type: {petType}</p>
//         <p>Breed: {petBreed}</p>
//         <p>State: {state}</p>
//         <p>City: {city}</p>
//         {/* <p>Location: {city}, {state}</p> */}
//         <p>Contact: {contact}</p>
//         <div className="mt-4 text-center space-x-2">
//           {onAdopt && (
//             <button
//               onClick={handleAdoptClick}
//               className={`px-4 py-2 bg-green-600 text-lg font-medium text-white rounded-lg hover:bg-green-700 transition ${isAdoptLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
//               disabled={isAdoptLoading}
//             >
//               {isAdoptLoading ? 'Loading...' : 'Adopt'}
//             </button>
//           )}
//           {onEdit && (
//             <button
//               onClick={handleEditClick}
//               className={`px-4 py-2 bg-blue-600 text-lg font-medium text-white rounded-lg hover:bg-blue-700 transition ${isEditLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
//               disabled={isEditLoading}
//             >
//               {isEditLoading ? 'Loading...' : 'Edit'}
//             </button>
//           )}
//           {onDelete && (
//             <button
//               onClick={handleDeleteClick}
//               className="px-4 py-2 bg-red-600 text-lg font-medium text-white rounded-lg hover:bg-red-700 transition"
//             >
//               Delete
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PetCard;

// // PetCard component in app/components/PetCard.tsx
// import React, { useState } from 'react';
// import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Import heart icons from react-icons

// interface PetCardProps {
//   id?: number;
//   name: string;
//   age: number;
//   ageUnit: string;
//   petType: string;
//   petBreed: string;
//   state: string;
//   city: string;
//   contact: string;
//   image?: string | null;
//   onAdopt?: () => void;
//   onEdit?: () => void;
//   onDelete?: () => void;
//   isAdoptPage?: boolean; // New prop to determine if it's on AdoptAPet page
//   onToggleFavorite?: (petId: number, isFavorited: boolean) => Promise<void>; // New prop for favorite toggle
//   isFavorited?: boolean; // New prop to indicate if pet is favorited
// }

// const PetCard: React.FC<PetCardProps> = ({
//   id,
//   name,
//   age,
//   ageUnit,
//   petType,
//   petBreed,
//   state,
//   city,
//   contact,
//   image,
//   onAdopt,
//   onEdit,
//   onDelete,
//   isAdoptPage = false,
//   onToggleFavorite,
//   isFavorited = false,
// }) => {
//   const [isAdoptLoading, setIsAdoptLoading] = useState(false);
//   const [isEditLoading, setIsEditLoading] = useState(false);

//   const handleAdoptClick = () => {
//     setIsAdoptLoading(true);
//     onAdopt?.();
//   };

//   const handleEditClick = () => {
//     setIsEditLoading(true);
//     onEdit?.();
//   };

//   const handleDeleteClick = () => {
//     onDelete?.();
//   };

//   const handleFavoriteClick = () => {
//     if (id && onToggleFavorite) {
//       onToggleFavorite(id, isFavorited);
//     }
//   };

//   return (
//     <div className="p-4 border rounded-lg shadow-sm relative">
//       {image && <img src={image} alt={name} className="w-full h-48 object-cover rounded-lg" />}
//       <div className="mt-4">
//         <h2 className="text-xl font-bold">{name}</h2>
//         <p>Age: {age} {ageUnit}</p>
//         <p>Pet Type: {petType}</p>
//         <p>Breed: {petBreed}</p>
//         <p>State: {state}</p>
//         <p>City: {city}</p>
//         <p>Contact: {contact}</p>
//         <div className="mt-4 text-center space-x-2">
//           {onAdopt && (
//             <button
//               onClick={handleAdoptClick}
//               className={`px-4 py-2 bg-green-600 text-lg font-medium text-white rounded-lg hover:bg-green-700 transition ${isAdoptLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
//               disabled={isAdoptLoading}
//             >
//               {isAdoptLoading ? 'Loading...' : 'Adopt'}
//             </button>
//           )}
//           {onEdit && (
//             <button
//               onClick={handleEditClick}
//               className={`px-4 py-2 bg-blue-600 text-lg font-medium text-white rounded-lg hover:bg-blue-700 transition ${isEditLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
//               disabled={isEditLoading}
//             >
//               {isEditLoading ? 'Loading...' : 'Edit'}
//             </button>
//           )}
//           {onDelete && (
//             <button
//               onClick={handleDeleteClick}
//               className="px-4 py-2 bg-red-600 text-lg font-medium text-white rounded-lg hover:bg-red-700 transition"
//             >
//               Delete
//             </button>
//           )}
//         </div>
//       </div>
//       {isAdoptPage && id && (
//         <button
//           onClick={handleFavoriteClick}
//           className="absolute top-2 right-2 text-2xl focus:outline-none"
//         >
//           {isFavorited ? <FaHeart color="red" /> : <FaRegHeart />}
//         </button>
//       )}
//     </div>
//   );
// };

// export default PetCard;

import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Import heart icons from react-icons

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
  isAdoptPage?: boolean; // New prop to determine if it's on AdoptAPet page
  onToggleFavorite?: (petId: number, isFavorited: boolean) => Promise<void>; // New prop for favorite toggle
  isFavorited?: boolean; // New prop to indicate if pet is favorited
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
}) => {
  const [isAdoptLoading, setIsAdoptLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);

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
    <div className="p-4 border rounded-lg shadow-sm relative">
      {image && <img src={image} alt={name} className="w-full h-48 object-cover rounded-lg" />}
      <div className="mt-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">{name}</h2>
        {isAdoptPage && id && (
          <button
            onClick={handleFavoriteClick}
            className="text-2xl focus:outline-none"
          >
            {isFavorited ? <FaHeart color="red" /> : <FaRegHeart />}
          </button>
        )}
      </div>
      <p>Age: {age} {ageUnit}</p>
      <p>Pet Type: {petType}</p>
      <p>Breed: {petBreed}</p>
      <p>State: {state}</p>
      <p>City: {city}</p>
      <p>Contact: {contact}</p>
      <div className="mt-4 text-center space-x-2">
        {onAdopt && (
          <button
            onClick={handleAdoptClick}
            className={`px-4 py-2 bg-green-600 text-lg font-medium text-white rounded-lg hover:bg-green-700 transition ${isAdoptLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isAdoptLoading}
          >
            {isAdoptLoading ? 'Loading...' : 'Adopt'}
          </button>
        )}
        {onEdit && (
          <button
            onClick={handleEditClick}
            className={`px-4 py-2 bg-blue-600 text-lg font-medium text-white rounded-lg hover:bg-blue-700 transition ${isEditLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isEditLoading}
          >
            {isEditLoading ? 'Loading...' : 'Edit'}
          </button>
        )}
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            className="px-4 py-2 bg-red-600 text-lg font-medium text-white rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default PetCard;
