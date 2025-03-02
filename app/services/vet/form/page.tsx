
//VetBookingForm in app/services/vet/form/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { fetchBookedSlots, storeVetBooking } from '@/app/services/vet/vetBooking';
import { NewVetBookingData } from '@/app/types';
import toast, { Toaster } from 'react-hot-toast';
import FormReminder from '@/app/components/FormReminder';
import Select from 'react-select';
import { useUser } from '@clerk/nextjs';
import { cityOptions } from '@/app/data/availableCities';

const VetBookingForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState<Date | null>(null);
    const [timeSlot, setTimeSlot] = useState('');
    const [consultationType, setConsultationType] = useState('Home Consultation');
    const [petType, setPetType] = useState('Cat');
    const [petIssues, setPetIssues] = useState<string[]>([]);
    const [medicalAttention, setMedicalAttention] = useState('');
    const [address, setAddress] = useState('');
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<{ label: string, value: string } | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');

    const { user } = useUser(); // Get the user from Clerk

    // Validation States
    const [nameError, setNameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [dateError, setDateError] = useState<string | null>(null);
    const [timeSlotError, setTimeSlotError] = useState<string | null>(null);
    const [medicalAttentionError, setMedicalAttentionError] = useState<string | null>(null);
    const [addressError, setAddressError] = useState<string | null>(null);
    const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const searchTitle = searchParams?.get("title") || '';
    const searchPrice = searchParams?.get("price") || '';

    const [title, setTitle] = useState(searchTitle);
    const [price, setPrice] = useState(searchPrice);

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
        // "08:00 AM - 10:00 AM",
        "10:00 AM - 12:00 PM",
        "12:00 PM - 02:00 PM",
        "02:00 PM - 04:00 PM",
        "04:00 PM - 06:00 PM",
        // "06:00 PM - 08:00 PM"
    ];

    

    useEffect(() => {
        if (date && selectedCity) {
            fetchBookedSlots(date, selectedCity.value).then(setBookedSlots);
        }
    }, [date, selectedCity]);

    useEffect(() => {
        const storedOrder = sessionStorage.getItem('repeatOrder');
        if (storedOrder) {
            const orderData = JSON.parse(storedOrder);
            setName(orderData.name);
            setPhoneNumber(orderData.phoneNumber);
            setEmail(orderData.email);
            // setDate(new Date(orderData.date));
            // setTimeSlot(orderData.timeSlot);
            setConsultationType(orderData.consultationType); // Set consultation type
            setPetType(orderData.petType);
            setPetIssues(orderData.petIssues.split(', ')); // Split issues string into array
            setMedicalAttention(orderData.medicalAttention);
            setSelectedCity({ label: orderData.city, value: orderData.city });
            setAddress(orderData.address);
            // Set the values only if they are not already set by searchParams
            if (!searchTitle) setTitle(orderData.packageTitle); // Set package title
            if (!searchPrice) setPrice(orderData.packagePrice); // Set package price
            // Optionally, clear the stored order to avoid pre-filling next time
            sessionStorage.removeItem('repeatOrder');
        }
    }, [searchTitle, searchPrice]);

    const isSlotDisabled = (slot: string) => {
        if (!date) {
            return true;
        }

        const slotDate = new Date(date);
        const [startTime] = slot.split(' - ');
        const [startHourMinute, amPm] = startTime.split(' ');
        const [startHour, startMinute] = startHourMinute.split(':');

        // Convert slot time to 24-hour format
        let hour = parseInt(startHour);
        if (amPm === 'PM' && hour !== 12) {
            hour += 12;
        } else if (amPm === 'AM' && hour === 12) {
            hour = 0;
        }

        // Set slot time
        slotDate.setHours(hour, parseInt(startMinute), 0, 0);

        // Get current time
        const currentTime = new Date();

        // Buffer time in milliseconds
        const bufferTime = 60 * 60 * 1000; // 60 minutes in milliseconds

        // Disable slot if it is booked, if the current time is past the slot time,
        // or if the slot is within the buffer time from the current time
        if (
            bookedSlots.includes(slot) ||
            currentTime.getTime() >= slotDate.getTime() || // Convert to number
            (slotDate.getTime() - currentTime.getTime()) <= bufferTime // Convert to number
        ) {
            return true;
        }

        // Check for 60-minute interval between bookings
        const slotEndTime = new Date(slotDate);
        slotEndTime.setMinutes(slotEndTime.getMinutes() + 60);

        for (const bookedSlot of bookedSlots) {
            const [bookedStartTime] = bookedSlot.split(' - ');
            const [bookedStartHourMinute, bookedAmPm] = bookedStartTime.split(' ');
            const [bookedStartHour, bookedStartMinute] = bookedStartHourMinute.split(':');

            let bookedHour = parseInt(bookedStartHour);
            if (bookedAmPm === 'PM' && bookedHour !== 12) {
                bookedHour += 12;
            } else if (bookedAmPm === 'AM' && bookedHour === 12) {
                bookedHour = 0;
            }

            const bookedSlotDate = new Date(date);
            bookedSlotDate.setHours(bookedHour, parseInt(bookedStartMinute), 0, 0);

            const bookedSlotEndTime = new Date(bookedSlotDate);
            bookedSlotEndTime.setMinutes(bookedSlotEndTime.getMinutes() + 60);

            if (
                (slotDate.getTime() >= bookedSlotDate.getTime() && slotDate.getTime() < bookedSlotEndTime.getTime()) ||
                (slotEndTime.getTime() > bookedSlotDate.getTime() && slotEndTime.getTime() <= bookedSlotEndTime.getTime())
            ) {
                return true;
            }
        }

        return false;
    };



    const handleCityChange = async (option: { label: string, value: string } | null) => {
        if (option) {
            setSelectedCity(option);
        } else {
            setSelectedCity(null);
        }
    };

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePhoneNumber = (number: string) => {
        const regex = /^[0-9]{10}$/;
        return regex.test(number);
    };

    const handleIssueChange = (issue: string) => {
        setPetIssues((prevIssues) =>
            prevIssues.includes(issue)
                ? prevIssues.filter((i) => i !== issue)
                : [...prevIssues, issue]
        );
    };
    const handleNextClick = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset Errors
        setNameError(null);
        setPhoneNumberError(null);
        setEmailError(null);
        setDateError(null);
        setTimeSlotError(null);
        setMedicalAttentionError(null);
        setAddressError(null);

        let isValid = true;

        // Validations
        if (!name) {
            setNameError('Your Name is required.');
            isValid = false;
        }

        if (!phoneNumber) {
            setPhoneNumberError('Phone Number is required.');
            isValid = false;
        } else if (!validatePhoneNumber(phoneNumber)) {
            setPhoneNumberError('Phone Number must be 10 digits.');
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

        // Conditional validation for Home Consultation only
        if (consultationType === 'Home Consultation') {
            if (!address) {
                setAddressError('Your Address is required.');
                isValid = false;
            }

            if (!selectedCity) {
                setAddressError('Your City is required.');
                isValid = false;
            }
        }

        if (!isValid) {
            return;
        }

        if (date && timeSlot && user) {
            const newBooking = {
                name,
                phoneNumber,
                email,
                date,
                timeSlot,
                consultationType,
                petType,
                petIssues,
                medicalAttention,
                // Set city and address to empty string for Online Consultation
                city: consultationType === 'Home Consultation' && selectedCity ? selectedCity.value : '',
                address: consultationType === 'Home Consultation' ? address : '',
                packageTitle: title,
                packagePrice: price,
                userId: user.id,
                bookingType: 'vet'
            };

            sessionStorage.setItem('formData', JSON.stringify(newBooking));
            router.push('/services/payment');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex items-center justify-center">
            <Toaster position="top-center" />
            <div className="container max-w-md bg-white shadow-md rounded-lg p-8">
                <h2 className="text-xl font-bold text-center mb-4">Add Pet Details</h2>
                <form className="max-w-lg mx-auto space-y-6">
                    {title && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Selected Package</label>
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
                                onChange={(e) => {
                                    setConsultationType(e.target.value);
                                    // Clear city and address when switching from Online to Home
                                    if (e.target.value === 'Home Consultation') {
                                        setSelectedCity(null);
                                        setAddress('');
                                    }
                                }}
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
                                onChange={(e) => {
                                    setConsultationType(e.target.value);
                                    // Clear city and address when switching to Online
                                    if (e.target.value === 'Online Consultation') {
                                        setSelectedCity(null);
                                        setAddress('');
                                    }
                                }}
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
                    
                    {/* Show city and address fields only for Home Consultation */}
                    {consultationType === 'Home Consultation' && (
                        <>
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>Select Your City</label>
                                <Select
                                    id="city"
                                    value={selectedCity}
                                    onChange={handleCityChange}
                                    options={cityOptions}
                                    className={`mt-1 ${addressError ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Select or search city"
                                />
                                {addressError && <p className="text-red-500 text-xs italic">{addressError}</p>}
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
                        </>
                    )}                    <div>
                        <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${phoneNumberError ? 'border-red-500' : ''}`}
                            placeholder="Enter your phone number"
                        />
                        {phoneNumberError && <p className="text-red-500 text-xs italic">{phoneNumberError}</p>}
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
                            className={`mt-1 p-2 w-full border rounded-md shadow appearance-none ${dateError ? 'border-red-500' : 'border-gray-300'}`}
                            placeholderText="Select a date"
                        />
                        {dateError && <p className="text-red-500 text-xs italic">{dateError}</p>}
                    </div>
                    {date && (
                        <div>
                            <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>Preferred Time Slot</label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {timeSlots.map((slot) => (
                                    <button
                                        key={slot}
                                        type="button"
                                        className={`py-2 px-4 rounded-md shadow ${isSlotDisabled(slot) ? 'bg-gray-300 border-2 border-black cursor-not-allowed' : slot === timeSlot ? 'bg-blue-500 text-white border-2 border-black' : ' text-black border-2 border-black'}`}
                                        onClick={() => !isSlotDisabled(slot) && setTimeSlot(slot === timeSlot ? '' : slot)}
                                        disabled={isSlotDisabled(slot)}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                            {timeSlotError && <p className="text-red-500 text-xs italic">{timeSlotError}</p>}
                        </div>
                    )}
                    <FormReminder message="Please remember to check your email for updates on your appointment request.
            We'll notify you about the status via email, so keep an eye on your inbox. Thank you!"/>
                    <div className="flex items-center justify-between">
                        <button
                            type="button" // Change type to button
                            onClick={handleNextClick} // Update the onClick handler
                            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VetBookingForm;
