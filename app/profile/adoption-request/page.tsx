// Path: app/profile/adoption-request/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { AdoptionRequest, Pet } from '../../types';
import { fetchAdoptionRequestsByUserId, deleteAdoptionRequest } from './adoptionRequest';
import Link from 'next/link';
import { FaEye, FaEyeSlash, FaPhoneAlt, FaTrash, FaWhatsapp } from 'react-icons/fa';
import Popup from '../../components/Popup';
import toast, { Toaster } from 'react-hot-toast'; // Import react-hot-toast

const AdoptionRequestPage: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [adoptionRequests, setAdoptionRequests] = useState<AdoptionRequest[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [activePetId, setActivePetId] = useState<number | null>(null);
  const [expandedRequests, setExpandedRequests] = useState<number[]>([]);
  const [deleteRequestId, setDeleteRequestId] = useState<number | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    const fetchData = async () => {
      try {
        const [requestsData, petsResponse] = await Promise.all([
          fetchAdoptionRequestsByUserId(user.id),
          fetch('/api/pets'),
        ]);

        const sortedRequests = requestsData.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setAdoptionRequests(sortedRequests);

        if (petsResponse.ok) {
          const petsData: Pet[] = await petsResponse.json();
          const userPets = petsData.filter((pet) => pet.userId === user.id);
          setPets(userPets);
          if (userPets.length > 0) {
            setActivePetId(userPets[0].id!);
          }
        } else {
          console.error('Failed to fetch pets');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, isSignedIn, user, router]);

  const handleToggleExpand = (requestId: number) => {
    setExpandedRequests((prevExpandedRequests) =>
      prevExpandedRequests.includes(requestId)
        ? prevExpandedRequests.filter((id) => id !== requestId)
        : [...prevExpandedRequests, requestId]
    );
  };

  const handleDeleteRequest = async () => {
    if (deleteRequestId !== null) {
      try {
        await deleteAdoptionRequest(deleteRequestId);
        setAdoptionRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== deleteRequestId)
        );
        setDeleteRequestId(null);
        setIsPopupOpen(false);
        toast.success('Adoption request deleted successfully!', { // Success toast
          duration: 4000,
          position: 'bottom-center',
        });
      } catch (error) {
        console.error('Error deleting adoption request:', error);
        toast.error('Failed to delete adoption request. Please try again.', { // Error toast
          duration: 4000,
          position: 'bottom-center',
        });
      }
    }
  };

  const renderTabs = () => (
    <div className="flex space-x-4 border-b mb-4 border-gray-200">
      {pets.map((pet) => (
        <button
          key={pet.id}
          className={`py-2 px-4 text-xl font-semibold text-gray-800 ${
            activePetId === pet.id ? 'border-b-2 border-orange-500 text-orange-500' : ''
          }`}
          onClick={() => setActivePetId(pet.id!)}
        >
          {pet.name}
        </button>
      ))}
    </div>
  );

  const renderAdoptionRequests = (requests: AdoptionRequest[]) => (
    <div className="flex flex-col space-y-4 mt-8">
      {requests.map((request) => (
        <div key={request.id} className="flex flex-col border p-4 rounded-lg shadow bg-white space-y-4">
          <div className="flex-grow text-gray-600">
            {request.profileImage && (
              <div className="mb-4">
                <img
                  src={request.profileImage}
                  alt={`${request.fullName}'s Profile`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                  onError={(e) => (e.target as HTMLImageElement).src = '/placeholder-profile.png'}
                />
              </div>
            )}
            <p><strong>Name:</strong> {request.fullName}</p>
            {expandedRequests.includes(request.id) && (
              <>
                <p><strong>Phone Number:</strong> {request.phoneNumber}</p>
                <p><strong>Email Address:</strong> {request.emailAddress}</p>
                <p><strong>Residence Type:</strong> {request.residenceType}</p>
                <p><strong>State:</strong> {request.state}</p>
                <p><strong>City:</strong> {request.city}</p>
                <p><strong>Reason for Adoption:</strong> {request.reasonForAdoption}</p>
                <p><strong>Other Pets:</strong> {request.hasOtherPets ? 'Yes' : 'No'}</p>
                {request.hasOtherPets && request.otherPetsDescription && (
                  <p><strong>Other Pets Description:</strong> {request.otherPetsDescription}</p>
                )}
                <p><strong>Can Cover Costs:</strong> {request.canCoverCosts ? 'Yes' : 'No'}</p>
                <p><strong>Requested At:</strong> {new Date(request.createdAt).toLocaleString()}</p>
                <div className="flex gap-4 mt-4">
                  <a
                    href={`tel:${request.phoneNumber}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 flex items-center"
                  >
                    <FaPhoneAlt size={21} className="mr-2" />
                    Call Now
                  </a>
                  <a
                    href={`https://wa.me/${request.phoneNumber}?text=Hi ${request.fullName}, I’m reaching out about adopting ${
                      pets.find((pet) => pet.id === request.petId)?.name || 'your pet'
                    }!`}
                    target="_blank"
                    className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 flex items-center"
                  >
                    <FaWhatsapp size={30} className="mr-2" />
                    Message on WhatsApp
                  </a>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-between">
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 flex items-center"
              onClick={() => handleToggleExpand(request.id)}
            >
              {expandedRequests.includes(request.id) ? (
                <>
                  <FaEyeSlash className="mr-2" />
                  View Less
                </>
              ) : (
                <>
                  <FaEye className="mr-2" />
                  View More
                </>
              )}
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 flex items-center"
              onClick={() => {
                setDeleteRequestId(request.id);
                setIsPopupOpen(true);
              }}
            >
              <FaTrash className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
  const filteredAdoptionRequests = adoptionRequests.filter((request) => request.petId === activePetId);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        <Toaster /> {/* Add Toaster component here */}
        {loading || !isLoaded ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <p className="text-2xl font-bold text-gray-800">Loading...</p>
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center mt-10 text-4xl font-bold text-gray-800">
            You have no pets listed.
            <div className="flex justify-center mt-8">
              <Link
                href="/list-a-pet/form"
                className="bg-orange-500 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-orange-600"
              >
                Post a Pet for Adoption
              </Link>
            </div>
          </div>
        ) : (
          <>
            {renderTabs()}
            {filteredAdoptionRequests.length === 0 ? (
              <div className="text-center font-semibold mt-10 text-2xl text-gray-800">
                No adoption requests for this pet.
              </div>
            ) : (
              renderAdoptionRequests(filteredAdoptionRequests)
            )}
          </>
        )}
      </div>
      <Popup
        message="Are you sure you want to delete this adoption request?"
        onConfirm={handleDeleteRequest}
        onCancel={() => setIsPopupOpen(false)}
        isOpen={isPopupOpen}
      />
    </div>
  );
};

export default AdoptionRequestPage;