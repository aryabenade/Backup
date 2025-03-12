//app/pet/[id]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export async function generateMetadata({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return { title: 'Pet Not Found' };
  }
  const pet = await prisma.pet.findUnique({
    where: { id },
  });
  return { title: pet ? `${pet.name} - Pet Details` : 'Pet Not Found' };
}

export default async function PetDetails({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    notFound();
  }

  const pet = await prisma.pet.findUnique({
    where: { id },
  });

  if (!pet) {
    notFound();
  }

  const formatDate = (date?: Date) => {
    if (!date) return "Unknown date";
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-extrabold text-gray-800 text-center flex-grow">
            Meet {pet.name}!
          </h1>
        </div>

        {/* Main Content */}
        <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
          {/* Image and Posted Date */}
          <div className="relative mb-6">
            {pet.image ? (
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full max-h-64 object-contain rounded-lg"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-600">No Image</span>
              </div>
            )}
            <div className="absolute top-4 left-4 bg-gray-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Posted on {formatDate(pet.createdAt)}
            </div>
          </div>

          {/* Adoption Call-to-Action Message */}
          <div className="text-center mb-8">
            <p className="text-lg text-gray-700 mb-4">
              {pet.name} is looking for a loving home! Ready to give {pet.name} a forever home?
            </p>
          </div>

          {/* Pet Details - Categorized */}
          <div className="space-y-8">
            {/* Basic Info */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <p><strong>Name:</strong> {pet.name}</p>
                <p><strong>Age:</strong> {pet.age} {pet.ageUnit}</p>
                <p><strong>Type:</strong> {pet.petType}</p>
                <p><strong>Breed:</strong> {pet.petBreed}</p>
                <p><strong>Gender:</strong> {pet.gender}</p>
                <p><strong>Location:</strong> {pet.city}, {pet.state}</p>
              </div>
            </div>

            {/* Health Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Health Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <p><strong>Vaccinated:</strong> {pet.isVaccinated ? 'Yes' : 'No'}</p>
                {pet.isVaccinated && pet.shotsUpToDate && (
                  <p><strong>Shots Up to Date:</strong> {pet.shotsUpToDate}</p>
                )}
                {pet.petType === 'Dog' && (
                  <p><strong>Neutered:</strong> {pet.isNeutered ? 'Yes' : 'No'}</p>
                )}
                {pet.petType === 'Cat' && (
                  <p><strong>Spayed:</strong> {pet.isSpayed ? 'Yes' : 'No'}</p>
                )}
              </div>
            </div>

            {/* Compatibility */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Compatibility</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700">
                <p>
                  <strong>Good with Dogs:</strong>{' '}
                  {pet.goodWithDogs !== null ? (pet.goodWithDogs ? 'Yes' : 'No') : 'N/A'}
                </p>
                <p>
                  <strong>Good with Cats:</strong>{' '}
                  {pet.goodWithCats !== null ? (pet.goodWithCats ? 'Yes' : 'No') : 'N/A'}
                </p>
                <p>
                  <strong>Good with Kids:</strong>{' '}
                  {pet.goodWithKids !== null ? (pet.goodWithKids ? 'Yes' : 'No') : 'N/A'}
                </p>
              </div>
            </div>

            {/* About Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Story</h2>
              <div className="text-gray-700">
                <p>{pet.reasonForRehoming}</p>
              </div>
            </div>
          </div>

          {/* Buttons - Adopt and Back */}
          <div className="text-center mt-8 flex justify-center gap-4">
            <Link
              href="/adopt-a-pet"
              className="bg-gray-500 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-600 transition duration-300"
            >
              Back to Adoption Page
            </Link>
            <Link
              href={`/adopt-a-pet/form?petId=${pet.id}`}
              className="bg-orange-500 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:bg-orange-600 transition duration-300"
            >
              Adopt {pet.name}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}