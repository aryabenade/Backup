// //PetCard component in app/components/PetCard.tsx
// import React from 'react';

// interface PetCardProps {
//   id?: number;
//   name: string;
//   age: number;
//   category: string;
//   breed: string;
//   state: string;
//   city: string;
//   contact: string;
//   image?: string | null;
//   onAdopt?: () => void;
//   onEdit?: () => void;
//   onDelete?: () => void;
// }

// const PetCard: React.FC<PetCardProps> = ({ name, age, category, breed, state, city, contact, image, onAdopt, onEdit, onDelete }) => {
//   return (
//     <div className="p-4 border rounded-lg shadow-sm">
//       {image && <img src={image} alt={name} className="w-full h-48 object-cover rounded-lg" />}
//       <div className="mt-4">
//         <h2 className="text-xl font-bold">{name}</h2>
//         <p>Age: {age}</p>
//         <p>Category: {category}</p>
//         <p>Breed: {breed}</p>
//         <p>Location: {city}, {state}</p>
//         <p>Contact: {contact}</p>
//         <div className="mt-4 text-center space-x-2">
//           {onAdopt && (
//             <button onClick={onAdopt} className="px-4 py-2 bg-green-600 text-lg font-medium text-white rounded-lg hover:bg-green-700">
//               Adopt
//             </button>
//           )}
//           {onEdit && (
//             <button onClick={onEdit} className="px-4 py-2 bg-blue-600 text-lg font-medium text-white rounded-lg hover:bg-blue-700">
//               Edit
//             </button>
//           )}
//           {onDelete && (
//             <button onClick={onDelete} className="px-4 py-2 bg-red-600 text-lg font-medium text-white rounded-lg hover:bg-red-700">
//               Delete
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PetCard;



//PetCard component in app/components/PetCard.tsx//PetCard component in app/components/PetCard.tsx
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
    <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
      {image && <img src={image} alt={name} className="w-full h-56 object-cover" />}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>{name}</h2>
        <p className="text-gray-600 mb-1" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 550 }}>Age - {age}</p>
        <p className="text-gray-600 mb-1" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 550 }}>Category - {category}</p>
        <p className="text-gray-600 mb-1" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 550 }}>Breed - {breed}</p>
        <p className="text-gray-600 mb-1" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 550 }}>Location - {city}, {state}</p>
        <p className="text-gray-600 mb-4" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 550 }}>Contact - {contact}</p>
        <div className="flex flex-col items-center">
          {onAdopt && (
            <button onClick={onAdopt} className="w-full px-4 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 focus:ring-2 focus:ring-orange-300" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Adopt
            </button>
          )}
          <div className="flex space-x-2 w-full">
            {onEdit && (
              <button onClick={onEdit} className="flex-1 px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-300" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Edit
              </button>
            )}
            {onDelete && (
              <button onClick={onDelete} className="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-300" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetCard;
