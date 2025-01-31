//VetBookingForm in app/services/vet/form/page.tsx
"use client";

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface VetBookingFormProps {
    // providerName: string;
    onSubmit: (formData: { name: string; email: string; dateTime: Date; consultationType: string; petType: string; petIssues: string[]; medicalAttention: string }) => void;
}

const VetBookingForm: React.FC<VetBookingFormProps> = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [dateTime, setDateTime] = useState<Date | null>(null);
    const [consultationType, setConsultationType] = useState('Home Consultation');
    const [petType, setPetType] = useState('Cat');
    const [petIssues, setPetIssues] = useState<string[]>([]);
    const [medicalAttention, setMedicalAttention] = useState('');

    const petIssuesOptions = [
        "General Medical Question",
        "Diarrhea or bowel issues",
        "Ear infection",
        "Loss of appetite",
        "Behavioral problems",
        "Skin rash or allergy",
        "Injury",
        "Dental issues",
        "Other"
    ];

    const handleIssueChange = (issue: string) => {
        setPetIssues((prevIssues) =>
            prevIssues.includes(issue)
                ? prevIssues.filter((i) => i !== issue)
                : [...prevIssues, issue]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (dateTime) {
            onSubmit({ name, email, dateTime, consultationType, petType, petIssues, medicalAttention });
        }
    };

    return (
        <div className="container mx-auto p-4">
            {/* <h1 className="text-3xl font-bold text-center mb-4">Book Vet Consultation with {providerName}</h1> */}
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                <h2 className="text-xl font-bold text-center mb-4">Please Add Details For Consultation</h2>

                <div className="mb-4">
                    <label htmlFor="consultationType" className="block text-sm font-medium text-gray-700">Type of Consultation</label>
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="homeConsultation"
                            name="consultationType"
                            value="Home Consultation"
                            checked={consultationType === 'Home Consultation'}
                            onChange={(e) => setConsultationType(e.target.value)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label htmlFor="homeConsultation" className="ml-2 text-sm text-gray-700">Home Consultation</label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="onlineConsultation"
                            name="consultationType"
                            value="Online Consultation"
                            checked={consultationType === 'Online Consultation'}
                            onChange={(e) => setConsultationType(e.target.value)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label htmlFor="onlineConsultation" className="ml-2 text-sm text-gray-700">Online Consultation</label>
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="petType" className="block text-sm font-medium text-gray-700">What type of pet?</label>
                    <select id="petType" value={petType} onChange={(e) => setPetType(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md">
                        <option value="Cat">Cat</option>
                        <option value="Dog">Dog</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Pet issues</label>
                    {petIssuesOptions.map((issue) => (
                        <div key={issue} className="flex items-center">
                            <input
                                type="checkbox"
                                id={issue}
                                value={issue}
                                checked={petIssues.includes(issue)}
                                onChange={() => handleIssueChange(issue)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                            <label htmlFor={issue} className="ml-2 text-sm text-gray-700">{issue}</label>
                        </div>
                    ))}
                </div>

                <div className="mb-4">
                    <label htmlFor="medicalAttention" className="block text-sm font-medium text-gray-700">Medical attention required for your pet</label>
                    <textarea
                        id="medicalAttention"
                        value={medicalAttention}
                        onChange={(e) => setMedicalAttention(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        rows={4}
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

export default VetBookingForm;
