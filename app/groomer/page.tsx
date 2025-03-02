// "use client";

// import { useUser } from '@clerk/nextjs';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';
// import { fetchGroomingBookingsCity } from '../services/grooming/groomingBooking';
// import { GroomingBookingData } from '../types';
// import GroomingRequests from '../components/GroomingDataCity';

// const GroomerPage = () => {
//   const { user, isLoaded } = useUser();
//   const router = useRouter();
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const [bookings, setBookings] = useState<GroomingBookingData[]>([]);
//   const [authorizedUser, setAuthorizedUser] = useState<string>("");
//   const [city, setCity] = useState<string>("");

//   const allowedEmail = [
//     {
//       email: "benadearya@gmail.com",
//       city: "Dahisar",
//     },
//     {
//       email: "testingforarya@gmail.com",
//       city: "Mira Road",
//     },
//   ];


//   useEffect(() => {
//     if (isLoaded) {
//       const userEmail = user?.primaryEmailAddress?.emailAddress;

//       const isAuthorizedUser = allowedEmail.find((allowedUser) => allowedUser.email === userEmail);
//       if (isAuthorizedUser) {
//         setAuthorizedUser(userEmail as string);
//         setCity(isAuthorizedUser.city);
//         setIsAuthorized(true);
//       } else {
//         router.replace('/sign-in'); // Redirect if the user is not allowed
//       }
//     }
//   }, [user, isLoaded, router]);

//   useEffect(() => {
//     const loadBookings = async () => {
//       if (city) {
//         const bookings = await fetchGroomingBookingsCity(city);
//         setBookings(bookings);
//       }
//     };

//     loadBookings();
//   }, [city]);

//   return (
//     <div>
//       <div className="container mx-auto p-4">
//         <h1 className="text-4xl font-bold text-center mb-8">Groomer Dashboard</h1>
//         <div className="mb-8">
//           {/* <button onClick={() => setLoadData((prev) => !prev)}>
//             Request grooming
//           </button> */}
//           {authorizedUser === user?.emailAddresses[0].emailAddress && (
//             <GroomingRequests city={city as string} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default GroomerPage;

// Path: app/admin/grooming/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { fetchGroomingBookings } from '@/app/services/grooming/groomingBooking'; // Import necessary functions
import { GroomingBookingData } from '@/app/types'; // Import GroomingBookingData interface

const GroomingRequests: React.FC = () => {
  const [bookings, setBookings] = useState<GroomingBookingData[]>([]);

  useEffect(() => {
    const loadBookings = async () => {
      const bookings = await fetchGroomingBookings();
      setBookings(bookings);
    };

    loadBookings();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Grooming Requests</h2>

      <div className="grid grid-cols-1 gap-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="p-4 border rounded-lg shadow-sm bg-white">
            <h3 className="text-xl font-bold mb-2">{booking.packageTitle} - {booking.petName}</h3>
            <p>User: {booking.name}</p>
            <p>Email: {booking.email}</p>
            <p>Date: {new Date(booking.date).toDateString()}</p>
            <p>Time Slot: {booking.timeSlot}</p>
            <p>Pet Type: {booking.petType}</p>
            <p>Pet Breed: {booking.petBreed}</p>
            <p>Pet Gender: {booking.petGender}</p>
            <p>Pet Size: {booking.petSize}</p>
            <p>Pet Aggression: {booking.petAggression}</p>
            <p>Pet Age: {booking.petAge}</p>
            <p>City: {booking.city}</p>
            <p>Address: {booking.address}</p>
            <p>Package Price: {booking.packagePrice}</p>
            <p>Status: {booking.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroomingRequests;