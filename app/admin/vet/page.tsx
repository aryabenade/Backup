'use client';
import React, { useEffect, useState } from 'react';

interface Booking {
  id: number;
  user: string;
  email: string;
  serviceType: string;
  dateTime: string;
  petType: string;
  details: string;
  approved: boolean | null; // null: pending, true: approved, false: rejected
}

const Vet: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      // Replace with actual API call
      const mockBookings: Booking[] = [
        {
          id: 1,
          user: 'Jane Doe',
          email: 'jane@example.com',
          serviceType: 'Vet Consultation',
          dateTime: '2025-02-01T11:00:00Z',
          petType: 'Cat',
          details: 'Annual check-up',
          approved: null,
        },
        // Add more mock data as needed
      ];
      setBookings(mockBookings);
    };

    fetchBookings();
  }, []);

  const handleApprove = (id: number) => {
    setBookings(bookings.map(booking => booking.id === id ? { ...booking, approved: true } : booking));
  };

  const handleReject = (id: number) => {
    setBookings(bookings.map(booking => booking.id === id ? { ...booking, approved: false } : booking));
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Vet Bookings</h2>
      <div className="grid grid-cols-1 gap-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="p-4 border rounded-lg shadow-sm bg-white">
            <h3 className="text-xl font-bold mb-2">{booking.serviceType} - {booking.petType}</h3>
            <p>User: {booking.user}</p>
            <p>Email: {booking.email}</p>
            <p>Date and Time: {new Date(booking.dateTime).toLocaleString()}</p>
            <p>Details: {booking.details}</p>
            <div className="mt-4 space-x-2">
              <button
                onClick={() => handleApprove(booking.id)}
                className={`px-4 py-2 text-lg font-medium rounded-lg ${booking.approved === true ? 'bg-green-600 text-white' : 'bg-gray-600 text-white hover:bg-green-700'}`}
                disabled={booking.approved !== null}
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(booking.id)}
                className={`px-4 py-2 text-lg font-medium rounded-lg ${booking.approved === false ? 'bg-red-600 text-white' : 'bg-gray-600 text-white hover:bg-red-700'}`}
                disabled={booking.approved !== null}
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

export default Vet;
