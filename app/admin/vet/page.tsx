//app/admin/vet/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { fetchVetBookings, updateVetBookingStatus } from '@/app/services/vet/vetBooking';
import { VetBookingData } from '@/app/types';
import { toast, Toaster } from 'react-hot-toast';

const VetRequests: React.FC = () => {
  const [bookings, setBookings] = useState<VetBookingData[]>([]);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const bookings = await fetchVetBookings();
        setBookings(bookings);
      } catch (error) {
        console.error('Error loading vet bookings:', error);
        toast.error('Failed to load vet bookings.');
      }
    };

    loadBookings();
  }, []);

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      const updatedBooking = await updateVetBookingStatus(id, newStatus);
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id ? { ...booking, status: updatedBooking.status } : booking
        )
      );
      toast.success(`Status updated to ${newStatus}!`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status.');
    }
  };

  const filteredBookings = bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Vet Requests</h2>

      <div className="grid grid-cols-1 gap-4">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="p-4 border rounded-lg shadow-sm bg-white">
            <h3 className="text-xl font-bold mb-2">{booking.packageTitle} - {booking.petType}</h3>
            <p><strong>User:</strong> {booking.name}</p>
            <p><strong>Email:</strong> {booking.email}</p>
            <p><strong>Phone Number:</strong> {booking.phoneNumber}</p>
            <p><strong>Date:</strong> {new Date(booking.date).toDateString()}</p>
            <p><strong>Time Slot:</strong> {booking.timeSlot}</p>
            <p><strong>Consultation Type:</strong> {booking.consultationType}</p>
            <p><strong>Pet Issues:</strong> {booking.petIssues}</p>
            <p><strong>Medical Attention:</strong> {booking.medicalAttention}</p>
            <p><strong>City:</strong> {booking.city}</p>
            <p><strong>Address:</strong> {booking.address}</p>
            <p><strong>Package Price:</strong> {booking.packagePrice}</p>
            <p><strong>Status:</strong> {booking.status}</p>

            <div className="mt-4 flex space-x-2">
              {booking.status === 'Scheduled' && (
                <button
                  onClick={() => handleStatusUpdate(booking.id, 'In Progress')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Start Consultation
                </button>
              )}
              {booking.status === 'In Progress' && (
                <button
                  onClick={() => handleStatusUpdate(booking.id, 'Completed')}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Toaster position="bottom-center" />
    </div>
  );
};

export default VetRequests;
