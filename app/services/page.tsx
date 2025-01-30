//Services component in app/services/page.tsx
"use client";
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';
import Navbar from '../components/Navbar';

const Services: React.FC = () => {
  const { user } = useUser()
  if (!user) {
    redirect('/sign-in')
  }
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mt-10">Services</h1>
        <p className="text-center mt-4 text-lg">
          We offer grooming and vet consultation services.
        </p>
      </div>
    </div>
  );
};

export default Services;
