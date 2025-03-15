//app/admin/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const AdminDashboard: React.FC = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  const allowedEmail = 'benadearya@gmail.com';

  useEffect(() => {
    if (isLoaded) {
      const userEmail = user?.primaryEmailAddress?.emailAddress;

      if (!user || userEmail !== allowedEmail) {
        router.replace('/sign-in'); // Prevents back button issues
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || !isAuthorized) {
    return <div className="flex justify-center items-center min-h-screen">
      <p className="text-2xl font-bold">Loading...</p>
    </div> // Display a loading state while verifying auth
  }

  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>
        <div className="mb-8">
          <Link href="/admin/pets">
            <div className="block bg-gray-300 text-black text-center py-1 text-lg font-bold rounded-md hover:bg-gray-400 transition duration-300 cursor-pointer mb-2">
              All Pets
            </div>
          </Link>
          <Link href="/admin/grooming">
            <div className="block bg-gray-300 text-black text-center py-1 text-lg font-bold rounded-md hover:bg-gray-400 transition duration-300 cursor-pointer mb-2">
              Grooming Requests
            </div>
          </Link>
          <Link href="/admin/vet">
            <div className="block bg-gray-300 text-black text-center py-1 text-lg font-bold rounded-md hover:bg-gray-400 transition duration-300 cursor-pointer mb-2">
              Vet Consultation Requests
            </div>
          </Link>
          <Link href="/admin/training">
            <div className="block bg-gray-300 text-black text-center py-1 text-lg font-bold rounded-md hover:bg-gray-400 transition duration-300 cursor-pointer mb-2">
              Training Requests
            </div>
          </Link>
          <Link href="/admin/walking">
            <div className="block bg-gray-300 text-black text-center py-1 text-lg font-bold rounded-md hover:bg-gray-400 transition duration-300 cursor-pointer mb-2">
              Walking Requests
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
