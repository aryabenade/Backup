//app/admin/vet/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { fetchVetBookings } from '@/app/services/vet/vetBooking'; // Import necessary function
import { VetBookingData } from '@/app/types'; // Import VetBookingData interface

const VetRequests: React.FC = () => {
  const [bookings, setBookings] = useState<VetBookingData[]>([]);

  useEffect(() => {
    const loadBookings = async () => {
      const bookings = await fetchVetBookings();
      setBookings(bookings);
    };

    loadBookings();
  }, []);

  const filteredBookings = bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort bookings by most recent

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Vet Requests</h2>

      <div className="grid grid-cols-1 gap-4">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="p-4 border rounded-lg shadow-sm bg-white">
            <h3 className="text-xl font-bold mb-2">{booking.packageTitle} - {booking.petType}</h3>
            <p>User: {booking.name}</p>
            <p>Email: {booking.email}</p>
            <p>Date: {new Date(booking.date).toDateString()}</p>
            <p>Time Slot: {booking.timeSlot}</p>
            <p>Consultation Type: {booking.consultationType}</p>
            <p>Pet Issues: {booking.petIssues}</p>
            <p>Medical Attention: {booking.medicalAttention}</p>
            <p>Package Price: {booking.packagePrice}</p>
            <p>Status: {booking.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VetRequests;
