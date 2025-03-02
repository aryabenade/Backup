'use client';

import React, { useEffect, useState } from 'react';
import { fetchTrainingBookings, updateTrainingBookingStatus, updateTrainingSessionsCompleted } from '@/app/services/training/trainingBooking'; // Added new import
import { TrainingBookingData } from '@/app/types';
import { toast, Toaster } from 'react-hot-toast';

const TrainingRequests: React.FC = () => {
  const [bookings, setBookings] = useState<TrainingBookingData[]>([]);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const bookings = await fetchTrainingBookings();
        setBookings(bookings);
      } catch (error) {
        console.error('Error loading training bookings:', error);
        toast.error('Failed to load training bookings.');
      }
    };

    loadBookings();
  }, []);

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      const updatedBooking = await updateTrainingBookingStatus(id, newStatus);
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

  const handleSessionComplete = async (id: number, currentCompleted: number, totalSessions: number) => {
    if (currentCompleted >= totalSessions) {
      toast.error('All sessions are already completed!');
      return;
    }

    const newCompleted = currentCompleted + 1;
    try {
      const updatedBooking = await updateTrainingSessionsCompleted(id, newCompleted);
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id ? { ...booking, sessionsCompleted: newCompleted } : booking
        )
      );
      toast.success(`Session marked complete! (${newCompleted}/${totalSessions})`);
      if (newCompleted === totalSessions) {
        handleStatusUpdate(id, 'Completed');
      }
    } catch (error) {
      console.error('Error updating sessions completed:', error);
      toast.error('Failed to mark session complete.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Training Requests</h2>

      <div className="grid grid-cols-1 gap-4">
        {bookings.map((booking) => {
          const endDate = new Date(booking.startDate);
          endDate.setMonth(endDate.getMonth() + 1);
          const totalSessions = booking.sessionsPerWeek * 4;

          return (
            <div key={booking.id} className="p-4 border rounded-lg shadow-sm bg-white">
              <h3 className="text-xl font-bold mb-2">{booking.packageTitle} - {booking.petName}</h3>
              <p><strong>User:</strong> {booking.name}</p>
              <p><strong>Email:</strong> {booking.email}</p>
              <p><strong>Phone Number:</strong> {booking.phoneNumber}</p>
              <p><strong>Start Date:</strong> {new Date(booking.startDate).toDateString()}</p>
              <p><strong>End Date:</strong> {endDate.toDateString()}</p>
              <p><strong>Preferred Days:</strong> {booking.preferredDays.join(', ')}</p>
              <p><strong>Pet Type:</strong> {booking.petType}</p>
              <p><strong>Pet Breed:</strong> {booking.petBreed}</p>
              <p><strong>Pet Gender:</strong> {booking.petGender}</p>
              <p><strong>Pet Size:</strong> {booking.petSize}</p>
              <p><strong>Pet Aggression:</strong> {booking.petAggression}</p>
              <p><strong>Pet Age:</strong> {booking.petAge}</p>
              <p><strong>City:</strong> {booking.city}</p>
              <p><strong>Address:</strong> {booking.address}</p>
              <p><strong>Package Price:</strong> {booking.packagePrice}</p>
              <p><strong>Sessions:</strong> {booking.sessionsCompleted}/{totalSessions} completed</p>
              <p><strong>Sessions Per Week:</strong> {booking.sessionsPerWeek}</p>
              <p><strong>Status:</strong> {booking.status}</p>

              <div className="mt-4 flex space-x-2">
                {booking.status === 'Scheduled' && (
                  <button
                    onClick={() => handleStatusUpdate(booking.id, 'In Progress')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Start Training
                  </button>
                )}
                {booking.status === 'In Progress' && (
                  <>
                    <button
                      onClick={() => handleSessionComplete(booking.id, booking.sessionsCompleted, totalSessions)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                      Mark Session Complete
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
          );
        })}
      </div>

      <Toaster position="bottom-center" />
    </div>
  );
};

export default TrainingRequests;