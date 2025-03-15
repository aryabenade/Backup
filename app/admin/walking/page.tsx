//app/admin/walking/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { fetchWalkingBookings, updateWalkingBookingStatus, updateWalkingSessionsCompleted } from '@/app/services/walking/walkingBooking';
import { WalkingBookingData } from '@/app/types';
import { toast, Toaster } from 'react-hot-toast';

const WalkingRequests: React.FC = () => {
  const [bookings, setBookings] = useState<WalkingBookingData[]>([]);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const bookings = await fetchWalkingBookings();
        setBookings(bookings);
      } catch (error) {
        console.error('Error loading walking bookings:', error);
        toast.error('Failed to load walking bookings.');
      }
    };

    loadBookings();
  }, []);

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      const updatedBooking = await updateWalkingBookingStatus(id, newStatus);
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

  const handleWalkComplete = async (id: number, currentCompleted: number, totalWalks: number) => {
    if (currentCompleted >= totalWalks) {
      toast.error('All walks are already completed!');
      return;
    }

    const newCompleted = currentCompleted + 1;
    try {
      const updatedBooking = await updateWalkingSessionsCompleted(id, newCompleted);
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id ? { ...booking, walksCompleted: newCompleted } : booking
        )
      );
      toast.success(`Walk marked complete! (${newCompleted}/${totalWalks})`);
      if (newCompleted === totalWalks) {
        handleStatusUpdate(id, 'Completed');
      }
    } catch (error) {
      console.error('Error updating walks completed:', error);
      toast.error('Failed to mark walk complete.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Walking Requests</h2>

      <div className="grid grid-cols-1 gap-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="p-4 border rounded-lg shadow-sm bg-white">
            <h3 className="text-xl font-bold mb-2">{booking.packageTitle} - {booking.petName}</h3>
            <p><strong>User:</strong> {booking.name}</p>
            <p><strong>Email:</strong> {booking.email}</p>
            <p><strong>Phone Number:</strong> {booking.phoneNumber}</p>
            <p><strong>Start Date:</strong> {new Date(booking.startDate).toDateString()}</p>
            <p><strong>End Date:</strong> {new Date(booking.endDate).toDateString()}</p>
            <p><strong>Days of Week:</strong> {booking.daysOfWeek.join(', ')}</p>
            <p><strong>Walk Duration:</strong> {booking.walkDuration}</p>
            <p><strong>Time Slot:</strong> {booking.timeSlot}</p>
            <p><strong>Pet Type:</strong> {booking.petType}</p>
            <p><strong>Pet Breed:</strong> {booking.petBreed}</p>
            <p><strong>Pet Gender:</strong> {booking.petGender}</p>
            <p><strong>Energy Level:</strong> {booking.energyLevel}</p>
            <p><strong>Leash Behavior:</strong> {booking.leashBehavior}</p>
            <p><strong>Pet Age:</strong> {booking.petAge}</p>
            <p><strong>City:</strong> {booking.city}</p>
            <p><strong>Address:</strong> {booking.address}</p>
            <p><strong>Total Walks:</strong> {booking.walksCompleted}/{booking.totalWalks} completed</p>
            <p><strong>Total Cost:</strong> {booking.totalCost}</p>
            <p><strong>Status:</strong> {booking.status}</p>

            <div className="mt-4 flex space-x-2">
              {booking.status === 'Scheduled' && (
                <button
                  onClick={() => handleStatusUpdate(booking.id, 'In Progress')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Start Walking
                </button>
              )}
              {booking.status === 'In Progress' && (
                <>
                  <button
                    onClick={() => handleWalkComplete(booking.id, booking.walksCompleted, booking.totalWalks)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    Mark Walk Complete
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(booking.id, 'Completed')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Mark as Completed
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <Toaster position="bottom-center" />
    </div>
  );
};

export default WalkingRequests;