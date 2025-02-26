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
