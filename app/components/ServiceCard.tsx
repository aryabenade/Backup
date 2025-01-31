"use client";
import React from 'react';

interface ServiceCardProps {
    providerName: string;
    providerPhoto: string;
    providerDescription: string;
    specialties: string;
    serviceType: string;
    onBook: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ providerName, providerPhoto, providerDescription, specialties, serviceType, onBook }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 m-4 w-80">
            <img src={providerPhoto} alt={providerName} className="w-24 h-24 rounded-full mx-auto"/>
            <h2 className="text-xl font-bold text-center mt-4">{providerName}</h2>
            <p className="text-gray-700 text-center">{providerDescription}</p>
            <p className="text-gray-500 text-center mt-2">{specialties}</p>
            <button 
                onClick={onBook} 
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4 block mx-auto"
            >
                Book
            </button>
        </div>
    );
}

export default ServiceCard;


