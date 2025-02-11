//VetBookingForm in app/services/vet/form/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { storeVetBooking } from '@/app/services/vet/vetBooking';
import { NewVetBookingData } from '@/app/types';
import toast, { Toaster } from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';
import FormReminder from '@/app/components/FormReminder';

const VetBookingForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState<Date | null>(null);
    const [timeSlot, setTimeSlot] = useState('');
    const [consultationType, setConsultationType] = useState('Home Consultation');
    const [petType, setPetType] = useState('Cat');
    const [petIssues, setPetIssues] = useState<string[]>([]);
    const [medicalAttention, setMedicalAttention] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Validation States
    const [nameError, setNameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [dateError, setDateError] = useState<string | null>(null);
    const [timeSlotError, setTimeSlotError] = useState<string | null>(null);
    const [medicalAttentionError, setMedicalAttentionError] = useState<string | null>(null);

    const title = searchParams?.get("title") || '';
    const price = searchParams?.get("price") || '';

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

    const timeSlots = [
        "10:00 AM - 12:00 PM",
        "12:00 PM - 02:00 PM",
        "02:00 PM - 04:00 PM",
        "04:00 PM - 06:00 PM",
    ];

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleIssueChange = (issue: string) => {
        setPetIssues((prevIssues) =>
            prevIssues.includes(issue)
                ? prevIssues.filter((i) => i !== issue)
                : [...prevIssues, issue]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset Errors
        setNameError(null);
        setEmailError(null);
        setDateError(null);
        setTimeSlotError(null);
        setMedicalAttentionError(null);

        let isValid = true;

        // Validations
        if (!name) {
            setNameError('Your Name is required.');
            isValid = false;
        }

        if (!email) {
            setEmailError('Your Email is required.');
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
            isValid = false;
        }

        if (!date) {
            setDateError('Preferred Date is required.');
            isValid = false;
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (date < today) {
                setDateError('Please select a future date.');
                isValid = false;
            }
        }

        if (!timeSlot) {
            setTimeSlotError('Preferred Time Slot is required.');
            isValid = false;
        }

        if (!medicalAttention) {
            setMedicalAttentionError('Please describe the medical attention needed.');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        if (date && timeSlot) {
            const newBooking: NewVetBookingData = {
                name,
                email,
                date,
                timeSlot,
                consultationType,
                petType,
                petIssues,
                medicalAttention,
                packageTitle: title,
                packagePrice: price,
            };

            try {
                setLoading(true);
                const response = await storeVetBooking(newBooking);

                if (response) {
                    setFormSubmitted(true);
                    toast.success('Form Submitted Successfully!', { position: 'bottom-center' });
                    setTimeout(() => {
                        router.push('/services/vet');
                    }, 2000);
                } else {
                    toast.error('Failed to submit the form.', { position: 'bottom-center' });
                }
            } catch (error) {
                console.error('Error submitting form', error);
                toast.error('An error occurred while submitting the form.', { position: 'bottom-center' });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex items-center justify-center">
            <Toaster position="top-center" />
            <div className="container max-w-md bg-white shadow-md rounded-lg p-8">
                <h2 className="text-xl font-bold text-center mb-4">Please Add Details For Consultation</h2>
                {formSubmitted ? (
                    <div className="text-center">
                        <BeatLoader color="#36D7B7" size={16} />
                        <p className="text-lg">You will be redirected shortly...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
                        {title && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>Selected Package</label>
                                <div className="mt-1 p-2 w-full border border-gray-300 rounded-md">
                                    {title} ({price})
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="consultationType" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>Type of Consultation</label>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="homeConsultation"
                                    name="consultationType"
                                    value="Home Consultation"
                                    checked={consultationType === 'Home Consultation'}
                                    onChange={(e) => setConsultationType(e.target.value)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-0"
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
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-0"
                                />
                                <label htmlFor="onlineConsultation" className="ml-2 text-sm text-gray-700">Online Consultation</label>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="petType" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>What type of pet?</label>
                            <select id="petType" value={petType} onChange={(e) => setPetType(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow appearance-none focus:outline-none focus:ring-blue-500">
                                <option value="Cat">Cat</option>
                                <option value="Dog">Dog</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>Reason for Consultation</label>
                            {petIssuesOptions.map((issue) => (
                                <div key={issue} className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        id={issue}
                                        value={issue}
                                        checked={petIssues.includes(issue)}
                                        onChange={() => handleIssueChange(issue)}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-0"
                                    />
                                    <label htmlFor={issue} className="ml-2 text-sm text-gray-700">{issue}</label>
                                </div>
                            ))}
                        </div>

                        <div>
                            <label htmlFor="medicalAttention" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>Describe medical attention needed</label>
                            <textarea
                                id="medicalAttention"
                                value={medicalAttention}
                                onChange={(e) => setMedicalAttention(e.target.value)}
                                rows={4}
                                className={`mt-1 p-2 w-full border rounded-md shadow appearance-none focus:outline-none focus:ring-blue-500 ${medicalAttentionError ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {medicalAttentionError && <p className="text-red-500 text-xs italic">{medicalAttentionError}</p>}
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>Your Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`mt-1 p-2 w-full border rounded-md shadow appearance-none focus:outline-none focus:ring-blue-500 ${nameError ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your name"
                            />
                            {nameError && <p className="text-red-500 text-xs italic">{nameError}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>Your Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`mt-1 p-2 w-full border rounded-md shadow appearance-none focus:outline-none focus:ring-blue-500 ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your email"
                            />
                            {emailError && <p className="text-red-500 text-xs italic">{emailError}</p>}
                        </div>

                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>Preferred Date</label>
                            <DatePicker
                                selected={date}
                                onChange={(date) => setDate(date)}
                                dateFormat="MMMM d, yyyy"
                                minDate={new Date()}
                                className={`mt-1 p-2 w-full border rounded-md shadow appearance-none focus:outline-none focus:ring-blue-500 ${dateError ? 'border-red-500' : 'border-gray-300'}`}
                                placeholderText="Select a date"
                            />
                            {dateError && <p className="text-red-500 text-xs italic">{dateError}</p>}
                        </div>

                        {date && (
                            <div>
                                <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>Preferred Time Slot</label>
                                <select id="timeSlot" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} className={`mt-1 p-2 w-full border rounded-md shadow appearance-none focus:outline-none focus:ring-blue-500 ${timeSlotError ? 'border-red-500' : 'border-gray-300'}`}>
                                    <option value="" disabled>Select a time slot</option>
                                    {timeSlots.map((slot) => (
                                        <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                </select>
                                {timeSlotError && <p className="text-red-500 text-xs italic">{timeSlotError}</p>}
                            </div>
                        )}
                        <FormReminder message="Please remember to check your email for updates on your appointment request.
            We'll notify you about the status via email, so keep an eye on your inbox. Thank you!"/>
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <BeatLoader color="white" size={8} margin={3} />
                                        <span className="ml-2">Submitting...</span>
                                    </div>
                                ) : (
                                    'Submit'
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default VetBookingForm;
