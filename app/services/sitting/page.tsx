"use client";
import React from 'react';
import ServiceCard from '@/app/components/ServiceCard';
import { services } from '@/pages/api/data';

const VetPage: React.FC = () => {
  const serviceType = 'vet';
  const serviceProviders = services[serviceType];

  const handleBook = (providerName: string) => {
    // Implement booking logic
    alert(`Booking service for ${providerName}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">Vet Consultation Services</h1>
      <div className="flex flex-wrap justify-center">
        {serviceProviders.map(provider => (
          <ServiceCard 
            key={provider.name}
            providerName={provider.name}
            providerPhoto={provider.photo}
            providerDescription={provider.description}
            specialties={provider.specialties}
            serviceType={serviceType}
            onBook={() => handleBook(provider.name)}
          />
        ))}
      </div>
    </div>
  );
}

export default VetPage;
