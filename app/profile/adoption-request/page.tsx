
// Path: app/profile/adoption-request/page.tsx

"use client";
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { AdoptionRequest, Pet } from '../../types';
import { fetchAdoptionRequestsByUserId } from './adoptionRequest';
import Link from 'next/link';

const AdoptionRequestPage: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();
  const [adoptionRequests, setAdoptionRequests] = useState<AdoptionRequest[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [activePetId, setActivePetId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchAdoptionRequests = async () => {
      try {
        const data = await fetchAdoptionRequestsByUserId(user.id);
        setAdoptionRequests(data);
      } catch (error) {
        console.error('Error fetching adoption requests:', error);
      }
    };

    const fetchUserPets = async () => {
      try {
        const response = await fetch('/api/pets');
        if (response.ok) {
          const data: Pet[] = await response.json();
          const userPets = data.filter(pet => pet.userId === user.id);
          setPets(userPets);
          if (userPets.length > 0) {
            setActivePetId(userPets[0].id!); // Set the first pet as the active pet by default
          }
        } else {
          console.error('Failed to fetch pets');
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };

    fetchAdoptionRequests();
    fetchUserPets();
  }, [user, router]);

  const renderTabs = () => (
    <div className="flex space-x-4 border-b mb-4">
      {pets.map(pet => (
        <button
          key={pet.id}
          className={`py-2 px-4 text-xl font-semibold ${activePetId === pet.id ? 'border-b-2 border-indigo-500 text-indigo-500' : ''}`}
          onClick={() => setActivePetId(pet.id!)}
        >
          {pet.name}
        </button>
      ))}
    </div>
  );
 
  const renderAdoptionRequests = (requests: AdoptionRequest[]) => (
    <div className="flex flex-col space-y-4 mt-8">
      {requests.map(request => (
        <div key={request.id} className="flex flex-col border p-4 rounded-lg shadow space-y-4">
          <div className="flex-grow">
            <p><strong>Full Name:</strong> {request.fullName}</p>
            <p><strong>Phone Number:</strong> {request.phoneNumber}</p>
            <p><strong>Email Address:</strong> {request.emailAddress}</p>
            <p><strong>Residence Type:</strong> {request.residenceType}</p>
            <p><strong>State:</strong> {request.state}</p>
            <p><strong>City:</strong> {request.city}</p>
            <p><strong>Requested At:</strong> {new Date(request.createdAt).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const filteredAdoptionRequests = adoptionRequests.filter(request => request.petId === activePetId);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 min-h-screen">
        {/* Render a message if the user has no pets */}
        {pets.length === 0 ? (
          <div className="text-center mt-10 text-4xl font-bold">
            You have no pets listed.
            <div className="flex justify-center mt-8">
              <Link href="/list-a-pet/form" className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700">
                Post a Pet for Adoption
              </Link>
            </div>
          </div>
        ) : (
          <>
            {renderTabs()}
            {/* Render a message if active pet has no adoption requests */}
            {filteredAdoptionRequests.length === 0 ? (
              <div className="text-center font-semibold mt-10 text-2xl">
                No adoption requests for this pet.
              </div>
            ) : (
              renderAdoptionRequests(filteredAdoptionRequests)
            )}
          </>
        )}
      </div>
    </div>

  );
};

export default AdoptionRequestPage;
