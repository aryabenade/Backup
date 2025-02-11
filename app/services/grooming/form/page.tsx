// GroomingBookingForm in app/services/grooming/form/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { storeGroomingBooking } from '@/app/services/grooming/groomingBooking';
import { NewGroomingBookingData } from '@/app/types';
import toast, { Toaster } from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';
import FormReminder from '@/app/components/FormReminder';

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
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const [nameError, setNameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [dateError, setDateError] = useState<string | null>(null);
    const [timeSlotError, setTimeSlotError] = useState<string | null>(null);
    const [petNameError, setPetNameError] = useState<string | null>(null);
    const [petBreedError, setPetBreedError] = useState<string | null>(null);
    const [addressError, setAddressError] = useState<string | null>(null);

    const title = searchParams?.get("title") || '';
    const price = searchParams?.get("price") || '';
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setNameError(null);
        setEmailError(null);
        setDateError(null);
        setTimeSlotError(null);
        setPetNameError(null);
        setPetBreedError(null);
        setAddressError(null);

        let isValid = true;

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

        if (!petName) {
            setPetNameError('Pet Name is required.');
            isValid = false;
        }

        if (!petBreed) {
            setPetBreedError('Pet Breed is required.');
            isValid = false;
        }

        if (!address) {
            setAddressError('Your Address is required.');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        if (date && timeSlot) {
            const newBooking: NewGroomingBookingData = {
                name,
                email,
                date,
                timeSlot,
                petType,
                petName,
                petBreed,
                petGender,
                petSize,
                petAggression,
                petAge,
                address,
                packageTitle: title,
                packagePrice: price,
            };

            try {
                setLoading(true);
                const response = await storeGroomingBooking(newBooking);

                if (response) {
                    setFormSubmitted(true);
                    toast.success('Form Submitted Successfully!', { position: 'bottom-center' });
                    setTimeout(() => {
                        router.push('/services/grooming');
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
                <h2 className="text-xl font-bold text-center mb-4">Add Pet Details</h2>
                {formSubmitted ? (
                    <div className="text-center">
                        <BeatLoader color="#36D7B7" size={16} />
                        <p className="text-lg">You will be redirected shortly...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
                        {title && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Selected Package</label>
                                <div className="mt-1 p-2 w-full border border-gray-300 rounded-md">
                                    {title} ({price})
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="petType" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>What type of pet?</label>
                            <select id="petType" value={petType} onChange={(e) => setPetType(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow appearance-none">
                                <option value="Cat">Cat</option>
                                <option value="Dog">Dog</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="petName" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>Name of your pet?</label>
                            <input
                                type="text"
                                id="petName"
                                value={petName}
                                onChange={(e) => setPetName(e.target.value)}
                                className={`mt-1 p-2 w-full border rounded-md shadow appearance-none ${petNameError ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter pet name"
                            />
                            {petNameError && <p className="text-red-500 text-xs italic">{petNameError}</p>}
                        </div>

                        <div>
                            <label htmlFor="petBreed" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>Breed of your pet?</label>
                            <input
                                type="text"
                                id="petBreed"
                                value={petBreed}
                                onChange={(e) => setPetBreed(e.target.value)}
                                className={`mt-1 p-2 w-full border rounded-md shadow appearance-none ${petBreedError ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter pet breed"
                            />
                            {petBreedError && <p className="text-red-500 text-xs italic">{petBreedError}</p>}
                        </div>

                        <div>
                            <label htmlFor="petGender" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>Gender of your pet?</label>
                            <select id="petGender" value={petGender} onChange={(e) => setPetGender(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow appearance-none">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="petSize" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>Size of your pet?</label>
                            <select id="petSize" value={petSize} onChange={(e) => setPetSize(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow appearance-none">
                                <option value="Small">Small</option>
                                <option value="Medium">Medium</option>
                                <option value="Large">Large</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="petAggression" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>How aggressive is your pet?</label>
                            <select id="petAggression" value={petAggression} onChange={(e) => setPetAggression(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow appearance-none">
                                <option value="Low">Low</option>
                                <option value="Normal">Normal</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="petAge" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>How old is your pet?</label>
                            <select id="petAge" value={petAge} onChange={(e) => setPetAge(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow appearance-none">
                                <option value="< 3 months">&lt; 3 months</option>
                                <option value="< 11 years">&lt; 11 years</option>
                                <option value="11+ years">11+ years</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>Your Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`mt-1 p-2 w-full border rounded-md shadow appearance-none ${nameError ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your name"
                            />
                            {nameError && <p className="text-red-500 text-xs italic">{nameError}</p>}
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>Your Address</label>
                            <input
                                type="text"
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className={`mt-1 p-2 w-full border rounded-md shadow appearance-none ${addressError ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your address"
                            />
                            {addressError && <p className="text-red-500 text-xs italic">{addressError}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>Your Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`mt-1 p-2 w-full border rounded-md shadow appearance-none ${emailError ? 'border-red-500' : 'border-gray-300'}`}
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
                                className={`mt-1 p-2 w-full border rounded-md shadow appearance-none ${dateError ? 'border-red-500' : 'border-gray-300'}`}
                                placeholderText="Select a date"
                            />
                            {dateError && <p className="text-red-500 text-xs italic">{dateError}</p>}
                        </div>

                        {date && (
                            <div>
                                <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>Preferred Time Slot</label>
                                <select id="timeSlot" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} className={`mt-1 p-2 w-full border rounded-md shadow appearance-none ${timeSlotError ? 'border-red-500' : 'border-gray-300'}`}>
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

export default GroomingBookingForm;
