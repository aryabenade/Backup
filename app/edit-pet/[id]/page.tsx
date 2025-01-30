// app/edit-pet/[id]/page.tsx
"use client";
import React from 'react';
import EditPetForm from '../../edit-pet-form/EditPetForm';
import { useParams } from 'next/navigation';
import { Pet } from '../../types';

const EditPetPage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;

  const [pet, setPet] = React.useState<Pet | null>(null);

  React.useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await fetch(`/api/pets/${id}`);
        if (response.ok) {
          const data: Pet = await response.json();
          setPet(data);
        } else {
          console.error('Failed to fetch pet');
        }
      } catch (error) {
        console.error('Error fetching pet:', error);
      }
    };

    if (id) {
      fetchPet();
    }
  }, [id]);

  if (!pet) {
    return <div>Loading...</div>;
  }

  return <EditPetForm pet={pet} />;
};

export default EditPetPage;
