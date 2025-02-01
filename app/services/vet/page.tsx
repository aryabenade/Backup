// //VetPage in app/services/vet/page.tsx
// "use client";

// import React, { useState } from 'react';
// import ServiceCard from '@/app/components/ServiceCard';
// import VetBookingForm from './form/page';
// import { services } from '@/pages/api/data';

// const VetPage: React.FC = () => {
//   const serviceType = 'vet';
//   const serviceProviders = services[serviceType];
//   const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

//   const handleBook = (providerName: string) => {
//     setSelectedProvider(providerName);
//   };

//   const handleSubmit = (formData: { name: string; email: string; dateTime: Date; consultationType: string; petType: string; petIssues: string[]; medicalAttention: string }) => {
//     alert(`Booking confirmed for ${formData.name} with ${selectedProvider} on ${formData.dateTime.toLocaleString()}`);
//     setSelectedProvider(null);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       {selectedProvider ? (
//         <VetBookingForm
//           providerName={selectedProvider}
//           onSubmit={handleSubmit}
//         />
//       ) : (
//         <>
//           <h1 className="text-3xl font-bold text-center mb-4">Vet Consultation Services</h1>
//           <div className="flex flex-wrap justify-center">
//             {serviceProviders.map(provider => (
//               <ServiceCard 
//                 key={provider.name}
//                 providerName={provider.name}
//                 providerPhoto={provider.photo}
//                 providerDescription={provider.description}
//                 specialties={provider.specialties}
//                 serviceType={provider.serviceType}
//                 onBook={() => handleBook(provider.name)}
//               />
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default VetPage;

// "use client";

// import React, { useState } from 'react';
// import VetBookingForm from './form/page';

// const VetPage: React.FC = () => {
//   const [isBooking, setIsBooking] = useState(false);

//   const handleBook = () => {
//     setIsBooking(true);
//   };

//   const handleSubmit = (formData: { name: string; email: string; dateTime: Date; consultationType: string; petType: string; petIssues: string[]; medicalAttention: string }) => {
//     alert(`Booking confirmed for ${formData.name} on ${formData.dateTime.toLocaleString()}`);
//     setIsBooking(false);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       {isBooking ? (
//         <VetBookingForm onSubmit={handleSubmit} />
//       ) : (
//         <div className="flex flex-col items-center justify-center min-h-screen">
//           <h1 className="text-3xl font-bold text-center mb-4">Vet Consultation Services</h1>
//           <button
//             className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
//             onClick={handleBook}
//           >
//             Book Now
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VetPage;

import React from "react";
import { onlineVetPackages, inPersonVetPackages } from "../vet/data";
import VetCard from '../../components/VetCard'

const VetPackages = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Vet Packages and Rates</h1>
      
      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold mb-4">Online Vet Services</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          {onlineVetPackages.map((pkg, index) => (
            <VetCard
              key={index}
              title={pkg.title}
              price={pkg.price}
              originalPrice={pkg.originalPrice}
              features={pkg.features}
            />
          ))}
        </div>
      </div>
      
      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold mb-4">In-Person Vet Services</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          {inPersonVetPackages.map((pkg, index) => (
            <VetCard
              key={index}
              title={pkg.title}
              price={pkg.price}
              originalPrice={pkg.originalPrice}
              features={pkg.features}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VetPackages;
