// //Services component in app/services/page.tsx

"use client";
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';
import Navbar from '../components/Navbar';
import Link from 'next/link';

const Services: React.FC = () => {
  const { user } = useUser();
  if (!user) {
    redirect('/sign-in');
  }

  const services = [
    { name: "Grooming", path: "/services/grooming", icon: "/images/grooming-icon.png" },
    { name: "Vet Consultation", path: "/services/vet", icon: "/images/vet-icon.png" },
    { name: "Pet Sitting", path: "/services/sitting", icon: "/images/sitting-icon.png" },
    { name: "Pet Training", path: "/services/training", icon: "/images/training-icon.png" },
  ];

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mt-10">Services</h1>
        <p className="text-center mt-4 text-lg">
          We offer various services for your pets. Click on a service to learn more and book an appointment.
        </p>
        <div className="flex flex-col items-center mt-8">
          {services.map((service) => (
            <Link key={service.name} href={service.path} passHref>
              <div className="flex items-center bg-gray-100 shadow-md rounded-lg p-4 m-2 w-80 cursor-pointer hover:bg-gray-200">
                <img src={service.icon} alt={service.name} className="w-12 h-12 mr-4"/>
                <span className="text-xl font-semibold">{service.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
