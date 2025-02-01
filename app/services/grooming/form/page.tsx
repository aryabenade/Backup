// GroomingBookingForm in app/services/grooming/form/page.tsx
"use client";

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from 'next/navigation';

const GroomingBookingForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState<Date | null>(null);
    const [timeSlot, setTimeSlot] = useState('');
    const [petType, setPetType] = useState('Cat');
    const [petName, setPetName] = useState('');
    const [petBreed, setPetBreed] = useState('');
    const [petGender, setPetGender] = useState('Male');
    const [petSize, setPetSize] = useState('Small');
    const [petAggression, setPetAggression] = useState('Low');
    const [petAge, setPetAge] = useState('< 3 months');
    const [address, setAddress] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const router = useRouter();

    const timeSlots = [
        "08:00 AM - 10:00 AM",
        "10:00 AM - 12:00 PM",
        "12:00 PM - 02:00 PM",
        "02:00 PM - 04:00 PM",
        "04:00 PM - 06:00 PM",
        "06:00 PM - 08:00 PM"
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (date && timeSlot) {
            setFormSubmitted(true);

            // Simulate form submission
            setTimeout(() => {
                // Redirect to grooming packages page after showing the message
                router.push('/services/grooming');
            }, 2000);
        }
    };

    return (
        <div className="container mx-auto p-4">
            {formSubmitted ? (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Form Submitted Successfully!</h2>
                    <p className="text-lg">You will be redirected shortly...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                    <h2 className="text-xl font-bold text-center mb-4">Add Pet Details</h2>

                    <div className="mb-4">
                        <label htmlFor="petType" className="block text-sm font-medium text-gray-700">What type of pet?</label>
                        <select id="petType" value={petType} onChange={(e) => setPetType(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md">
                            <option value="Cat">Cat</option>
                            <option value="Dog">Dog</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="petName" className="block text-sm font-medium text-gray-700">Name of your pet?</label>
                        <input
                            type="text"
                            id="petName"
                            value={petName}
                            onChange={(e) => setPetName(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="petBreed" className="block text-sm font-medium text-gray-700">Breed of your pet?</label>
                        <input
                            type="text"
                            id="petBreed"
                            value={petBreed}
                            onChange={(e) => setPetBreed(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="petGender" className="block text-sm font-medium text-gray-700">Gender of your pet?</label>
                        <select id="petGender" value={petGender} onChange={(e) => setPetGender(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="petSize" className="block text-sm font-medium text-gray-700">Size of your pet?</label>
                        <select id="petSize" value={petSize} onChange={(e) => setPetSize(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md">
                            <option value="Small">Small</option>
                            <option value="Medium">Medium</option>
                            <option value="Large">Large</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="petAggression" className="block text-sm font-medium text-gray-700">How aggressive is your pet?</label>
                        <select id="petAggression" value={petAggression} onChange={(e) => setPetAggression(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md">
                            <option value="Low">Low</option>
                            <option value="Normal">Normal</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="petAge" className="block text-sm font-medium text-gray-700">How old is your pet?</label>
                        <select id="petAge" value={petAge} onChange={(e) => setPetAge(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md">
                            <option value="< 3 months">&lt; 3 months</option>
                            <option value="< 11 years">&lt; 11 years</option>
                            <option value="11+ years">11+ years</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Your Address</label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Preferred Date</label>
                        <DatePicker
                            selected={date}
                            onChange={(date) => setDate(date)}
                            dateFormat="MMMM d, yyyy"
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    {date && (
                        <div className="mb-4">
                            <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700">Preferred Time Slot</label>
                            <select id="timeSlot" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md">
                                <option value="" disabled>Select a time slot</option>
                                {timeSlots.map((slot) => (
                                    <option key={slot} value={slot}>{slot}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 block mx-auto"
                    >
                        Submit
                    </button>
                </form>
            )}
        </div>
    );
};

export default GroomingBookingForm;
