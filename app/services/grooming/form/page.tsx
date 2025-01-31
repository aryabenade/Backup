// GroomingBookingForm in app/services/grooming/form/page.tsx
"use client";

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface GroomingBookingFormProps {
    // providerName: string;
    onSubmit: (formData: { name: string; email: string; dateTime: Date; petType: string; petName: string; petBreed: string; petGender: string; petSize: string; petAggression: string; petAge: string; address: string; service: string }) => void;
}

const GroomingBookingForm: React.FC<GroomingBookingFormProps> = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [dateTime, setDateTime] = useState<Date | null>(null);
    const [petType, setPetType] = useState('Cat');
    const [petName, setPetName] = useState('');
    const [petBreed, setPetBreed] = useState('');
    const [petGender, setPetGender] = useState('Male');
    const [petSize, setPetSize] = useState('Small');
    const [petAggression, setPetAggression] = useState('Low');
    const [petAge, setPetAge] = useState('< 3 months');
    const [address, setAddress] = useState('');
    const [service, setService] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (dateTime) {
            onSubmit({ name, email, dateTime, petType, petName, petBreed, petGender, petSize, petAggression, petAge, address, service });
        }
    };

    return (
        <div className="container mx-auto p-4">
            {/* <h1 className="text-3xl font-bold text-center mb-4">Book Grooming with {providerName}</h1> */}
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
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700">Select a Grooming Service</label>
                    <select id="service" value={service} onChange={(e) => setService(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md">
                        <option value="Bathing">Bathing</option>
                        <option value="Haircut/Trimming">Haircut/Trimming</option>
                        <option value="Brushing/Combing">Brushing/Combing</option>
                        <option value="Nail Clipping/Trimming">Nail Clipping/Trimming</option>
                        <option value="Ear Cleaning">Ear Cleaning</option>
                    </select>
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
                    <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700">Preferred Date & Time</label>
                    <DatePicker
                        selected={dateTime}
                        onChange={(date) => setDateTime(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={30}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4 block mx-auto"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default GroomingBookingForm;
