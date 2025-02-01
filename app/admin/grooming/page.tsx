// 'use client';
// import React, { useEffect, useState } from 'react';
// import AdminLayout from '../layout';

// interface Booking {
//   id: number;
//   user: string;
//   email: string;
//   serviceType: string;
//   dateTime: string;
//   petType: string;
//   details: string;
//   approved: boolean | null; // null: pending, true: approved, false: rejected
// }

// const Grooming: React.FC = () => {
//   const [bookings, setBookings] = useState<Booking[]>([]);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       // Replace with actual API call
//       const mockBookings: Booking[] = [
//         {
//           id: 1,
//           user: 'John Doe',
//           email: 'john@example.com',
//           serviceType: 'Grooming',
//           dateTime: '2025-02-01T10:00:00Z',
//           petType: 'Dog',
//           details: 'Basic grooming package',
//           approved: null,
//         },
//         // Add more mock data as needed
//       ];
//       setBookings(mockBookings);
//     };

//     fetchBookings();
//   }, []);

//   const handleApprove = (id: number) => {
//     setBookings(bookings.map(booking => booking.id === id ? { ...booking, approved: true } : booking));
//   };

//   const handleReject = (id: number) => {
//     setBookings(bookings.map(booking => booking.id === id ? { ...booking, approved: false } : booking));
//   };

//   return (
//     <div>
//       <h2 className="text-3xl font-bold mb-4">Grooming Bookings</h2>
//       <div className="grid grid-cols-1 gap-4">
//         {bookings.map((booking) => (
//           <div key={booking.id} className="p-4 border rounded-lg shadow-sm bg-white">
//             <h3 className="text-xl font-bold mb-2">{booking.serviceType} - {booking.petType}</h3>
//             <p>User: {booking.user}</p>
//             <p>Email: {booking.email}</p>
//             <p>Date and Time: {new Date(booking.dateTime).toLocaleString()}</p>
//             <p>Details: {booking.details}</p>
//             <div className="mt-4 space-x-2">
//               <button
//                 onClick={() => handleApprove(booking.id)}
//                 className={`px-4 py-2 text-lg font-medium rounded-lg ${booking.approved === true ? 'bg-green-600 text-white' : 'bg-gray-600 text-white hover:bg-green-700'}`}
//                 disabled={booking.approved !== null}
//               >
//                 Approve
//               </button>
//               <button
//                 onClick={() => handleReject(booking.id)}
//                 className={`px-4 py-2 text-lg font-medium rounded-lg ${booking.approved === false ? 'bg-red-600 text-white' : 'bg-gray-600 text-white hover:bg-red-700'}`}
//                 disabled={booking.approved !== null}
//               >
//                 Reject
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Grooming;

'use client';

import React, { useEffect, useState } from 'react';

interface Booking {
  id: number;
  name: string;
  email: string;
  dateTime: Date;
  petType: string;
  petName: string;
  petBreed: string;
  petGender: string;
  petSize: string;
  petAggression: string;
  petAge: string;
  address: string;
  service: string;
}

const GroomingRequests: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Mock booking data
    const mockBookings: Booking[] = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        dateTime: new Date('2023-05-01T10:00:00Z'),
        petType: 'Dog',
        petName: 'Buddy',
        petBreed: 'Labrador',
        petGender: 'Male',
        petSize: 'Large',
        petAggression: 'Low',
        petAge: '2 years',
        address: '123 Pet Street, Pet City, PC 12345',
        service: 'Bathing',
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        dateTime: new Date('2023-05-02T14:00:00Z'),
        petType: 'Cat',
        petName: 'Whiskers',
        petBreed: 'Siamese',
        petGender: 'Female',
        petSize: 'Small',
        petAggression: 'Normal',
        petAge: '1 year',
        address: '456 Cat Avenue, Cat Town, CT 67890',
        service: 'Haircut/Trimming',
      },
    ];
    setBookings(mockBookings);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Grooming Requests</h2>
      <div className="grid grid-cols-1 gap-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="p-4 border rounded-lg shadow-sm bg-white">
            <h3 className="text-xl font-bold mb-2">{booking.service} - {booking.petName}</h3>
            <p>User: {booking.name}</p>
            <p>Email: {booking.email}</p>
            <p>Date and Time: {new Date(booking.dateTime).toLocaleString()}</p>
            <p>Pet Type: {booking.petType}</p>
            <p>Pet Breed: {booking.petBreed}</p>
            <p>Pet Gender: {booking.petGender}</p>
            <p>Pet Size: {booking.petSize}</p>
            <p>Pet Aggression: {booking.petAggression}</p>
            <p>Pet Age: {booking.petAge}</p>
            <p>Address: {booking.address}</p>
            <div className="mt-4 space-x-2">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={() => console.log(`Approved booking ${booking.id}`)}
              >
                Approve
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={() => console.log(`Rejected booking ${booking.id}`)}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroomingRequests;

