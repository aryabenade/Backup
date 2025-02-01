// Path: app/services/page.tsx

import React from 'react';
import Link from 'next/link';

const Services: React.FC = () => {
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mt-10">
        Our Services
      </h1>
      <p className="text-center mt-4 text-lg">
        Explore our professional grooming and expert vet consultation services.
      </p>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8">
        <Link href="/services/grooming" className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Grooming Services</h2>
            <p className="text-gray-700">Professional grooming for your pets.</p>
          </div>
        </Link>
        <Link href="/services/vet" className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Vet Services</h2>
            <p className="text-gray-700">Expert veterinary consultations.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Services;
