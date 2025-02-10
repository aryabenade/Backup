// Path: app/admin/grooming/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { fetchGroomingBookings, updateGroomingBookingStatus } from '@/app/services/grooming/groomingBooking'; // Import necessary functions
import { GroomingBookingData } from '@/app/types'; // Import GroomingBookingData interface

const GroomingRequests: React.FC = () => {
  const [bookings, setBookings] = useState<GroomingBookingData[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>(''); // Add state for status filter

  useEffect(() => {
    const loadBookings = async () => {
      const bookings = await fetchGroomingBookings();
      setBookings(bookings);
    };

    loadBookings();
  }, []);

  const handleEmail = async (bookingId: number, status: string) => {
    const executiveDetails = {
      name: 'John Doe', // Replace with actual executive details
      contact: '123-456-7890', // Replace with actual executive details
    };

    try {
      const response = await fetch('/api/sendGroomingEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          status,
          executiveDetails,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleApprove = async (id: number) => {
    const updatedBooking = await updateGroomingBookingStatus(id, 'Approved');
    setBookings(bookings.map(booking => booking.id === id ? updatedBooking : booking));
    await handleEmail(id, 'Approved');
  };

  const handleReject = async (id: number) => {
    const updatedBooking = await updateGroomingBookingStatus(id, 'Rejected');
    setBookings(bookings.map(booking => booking.id === id ? updatedBooking : booking));
    await handleEmail(id, 'Rejected');
  };

  const filteredBookings = bookings
    .filter(booking => statusFilter === '' ? booking.status === 'Pending' : booking.status === statusFilter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort bookings by most recent

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Grooming Requests</h2>

      {/* Filter Inputs */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <label htmlFor="statusFilter" className="mr-2">Filter by Status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredBookings.map((booking) => (
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
            <p>Address: {booking.address}</p>
            <p>Package Price: {booking.packagePrice}</p>
            <p>Status: {booking.status}</p>
            {booking.status === 'Pending' && (
              <div className="mt-4 space-x-2">
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  onClick={() => handleApprove(booking.id)}
                >
                  Approve
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  onClick={() => handleReject(booking.id)}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroomingRequests;
