// // Grooming page in app/services/grooming/page.tsx
// "use client";

// import React, { useState } from 'react';
// import ServiceCard from '@/app/components/ServiceCard';
// import GroomingBookingForm from './form/page';
// import { services } from '@/pages/api/data';

// const GroomingPage: React.FC = () => {
//   const serviceType = 'grooming';
//   const serviceProviders = services[serviceType];
//   const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

//   const handleBook = (providerName: string) => {
//     setSelectedProvider(providerName);
//   };

//   const handleSubmit = (formData: { name: string; email: string; dateTime: Date; petType: string; petName: string; petBreed: string; petGender: string; petSize: string; petAggression: string; petAge: string; address: string }) => {
//     alert(`Booking confirmed for ${formData.name} with ${selectedProvider} on ${formData.dateTime.toLocaleString()}`);
//     setSelectedProvider(null);
//   };

//   return (
//     <div className="container mx-auto p-4">
//       {selectedProvider ? (
//         <GroomingBookingForm
//           providerName={selectedProvider}
//           onSubmit={handleSubmit}
//         />
//       ) : (
//         <>
//           <h1 className="text-3xl font-bold text-center mb-4">Pet Grooming Services</h1>
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

// export default GroomingPage;

"use client";

import React, { useState } from 'react';
import GroomingBookingForm from './form/page';

const GroomingPage: React.FC = () => {
  const [isBooking, setIsBooking] = useState(false);

  const handleBook = () => {
    setIsBooking(true);
  };

  const handleSubmit = (formData: { name: string; email: string; dateTime: Date; petType: string; petName: string; petBreed: string; petGender: string; petSize: string; petAggression: string; petAge: string; address: string; service: string }) => {
    alert(`Booking confirmed for ${formData.name} on ${formData.dateTime.toLocaleString()}`);
    setIsBooking(false);
  };

  return (
    <div className="container mx-auto p-4">
      {isBooking ? (
        <GroomingBookingForm onSubmit={handleSubmit} />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-3xl font-bold text-center mb-4">Pet Grooming Services</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            onClick={handleBook}
          >
            Book Now
          </button>
        </div>
      )}
    </div>
  );
};

export default GroomingPage;
