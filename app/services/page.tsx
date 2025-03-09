
//app/services/page.tsx

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { FaCut, FaStethoscope, FaWalking, FaHome, FaDumbbell } from 'react-icons/fa';

const Services: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-orange-100 to-white min-h-screen">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-5xl font-extrabold text-center mt-12 text-gray-800 drop-shadow-lg">
          Our Services
        </h1>
        <p className="text-center mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our professional grooming and expert vet consultation services to keep your pets healthy and happy.
        </p>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {/* Grooming Services */}
          <Link href="/services/grooming" className="group block bg-white shadow-md rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <FaCut className="text-5xl text-blue-500 mb-4 group-hover:rotate-12 transition-transform duration-300" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Grooming Services</h2>
              <p className="text-gray-600">Professional grooming to keep your pet looking their best.</p>
            </div>
          </Link>
          {/* Vet Services */}
          <Link href="/services/vet" className="group block bg-white shadow-md rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <FaStethoscope className="text-5xl text-red-500 mb-4 group-hover:rotate-12 transition-transform duration-300" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Vet Services</h2>
              <p className="text-gray-600">Expert veterinary consultations for your pet’s health.</p>
            </div>
          </Link>
          {/* Pet Walking Services */}
          {/* <Link href="/services/walking" className="group block bg-white shadow-md rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <FaWalking className="text-5xl text-green-500 mb-4 group-hover:rotate-12 transition-transform duration-300" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Pet Walking</h2>
              <p className="text-gray-600">Daily walks to keep your pet active and healthy.</p>
            </div>
          </Link> */}
          {/* Pet Sitting Services */}
          {/* <Link href="/services/sitting" className="group block bg-white shadow-md rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <FaHome className="text-5xl text-orange-500 mb-4 group-hover:rotate-12 transition-transform duration-300" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Pet Sitting</h2>
              <p className="text-gray-600">Reliable sitting services while you're away.</p>
            </div>
          </Link> */}
          {/* Pet Training Services */}
          <Link href="/services/training" className="group block bg-white shadow-md rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <FaDumbbell className="text-5xl text-purple-500 mb-4 group-hover:rotate-12 transition-transform duration-300" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Pet Training</h2>
              <p className="text-gray-600">Effective training for a well-behaved pet.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;