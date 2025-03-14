// //app/services/vet/form/page.tsx
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { fetchBookedSlots } from '@/app/services/vet/vetBooking';
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
    const [consultationType, setConsultationType] = useState(''); // Set from URL or repeat order
    const [petType, setPetType] = useState('Cat');
    const [petIssues, setPetIssues] = useState<string[]>([]);
    const [medicalAttention, setMedicalAttention] = useState('');
    const [address, setAddress] = useState('');
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState<{ label: string, value: string } | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');

    const { user } = useUser();

    // Validation States
    const [nameError, setNameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [dateError, setDateError] = useState<string | null>(null);
    const [timeSlotError, setTimeSlotError] = useState<string | null>(null);
    const [medicalAttentionError, setMedicalAttentionError] = useState<string | null>(null);
    const [addressError, setAddressError] = useState<string | null>(null);
    const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);

    // Refs for scrolling to errors
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const timeSlotRef = useRef<HTMLDivElement>(null);
    const medicalAttentionRef = useRef<HTMLTextAreaElement>(null);
    const addressRef = useRef<HTMLInputElement>(null);
    const phoneNumberRef = useRef<HTMLInputElement>(null);
    const cityRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const searchTitle = searchParams?.get("title") || '';
    const searchPrice = searchParams?.get("price") || '';
    const searchConsultationType = searchParams?.get("consultationType") || '';

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
        "10:00 AM - 12:00 PM",
        "12:00 PM - 02:00 PM",
        "02:00 PM - 04:00 PM",
        "04:00 PM - 06:00 PM",
    ];

    useEffect(() => {
        const storedOrder = sessionStorage.getItem('repeatOrder');
        if (storedOrder) {
            const orderData = JSON.parse(storedOrder);
            setName(orderData.name);
            setPhoneNumber(orderData.phoneNumber);
            setEmail(orderData.email);
            setPetType(orderData.petType);
            setPetIssues(orderData.petIssues.split(', '));
            setMedicalAttention(orderData.medicalAttention);
            setSelectedCity({ label: orderData.city, value: orderData.city });
            setAddress(orderData.address);
            setConsultationType(orderData.consultationType); // Set consultationType from repeat order
            if (!searchTitle) setTitle(orderData.packageTitle);
            if (!searchPrice) setPrice(orderData.packagePrice);
            sessionStorage.removeItem('repeatOrder');
        } else if (searchConsultationType) {
            setConsultationType(searchConsultationType); // Fallback to search params if no repeat order
        }
    }, [searchTitle, searchPrice, searchConsultationType]);

    useEffect(() => {
        if (date && selectedCity) {
            fetchBookedSlots(date, selectedCity.value).then(setBookedSlots);
        }
    }, [date, selectedCity]);

    const isSlotDisabled = (slot: string) => {
        if (!date) return true;

        const slotDate = new Date(date);
        const [startTime] = slot.split(' - ');
        const [startHourMinute, amPm] = startTime.split(' ');
        const [startHour, startMinute] = startHourMinute.split(':');

        let hour = parseInt(startHour);
        if (amPm === 'PM' && hour !== 12) hour += 12;
        else if (amPm === 'AM' && hour === 12) hour = 0;

        slotDate.setHours(hour, parseInt(startMinute), 0, 0);

        const currentTime = new Date();
        const bufferTime = 60 * 60 * 1000;

        if (
            bookedSlots.includes(slot) ||
            currentTime.getTime() >= slotDate.getTime() ||
            (slotDate.getTime() - currentTime.getTime()) <= bufferTime
        ) {
            return true;
        }

        const slotEndTime = new Date(slotDate);
        slotEndTime.setMinutes(slotEndTime.getMinutes() + 60);

        for (const bookedSlot of bookedSlots) {
            const [bookedStartTime] = bookedSlot.split(' - ');
            const [bookedStartHourMinute, bookedAmPm] = bookedStartTime.split(' ');
            const [bookedStartHour, bookedStartMinute] = bookedStartHourMinute.split(':');

            let bookedHour = parseInt(bookedStartHour);
            if (bookedAmPm === 'PM' && bookedHour !== 12) bookedHour += 12;
            else if (bookedAmPm === 'AM' && bookedHour === 12) bookedHour = 0;

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

    const handleCityChange = (option: { label: string, value: string } | null) => {
        setSelectedCity(option);
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

        setNameError(null);
        setPhoneNumberError(null);
        setEmailError(null);
        setDateError(null);
        setTimeSlotError(null);
        setMedicalAttentionError(null);
        setAddressError(null);

        let isValid = true;

        if (!name) {
            setNameError('Your Name is required.');
            isValid = false;
            nameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (!phoneNumber) {
            setPhoneNumberError('Phone Number is required.');
            isValid = false;
            if (!nameError) phoneNumberRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (!validatePhoneNumber(phoneNumber)) {
            setPhoneNumberError('Phone Number must be 10 digits.');
            isValid = false;
            if (!nameError) phoneNumberRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (!email) {
            setEmailError('Your Email is required.');
            isValid = false;
            if (!nameError && !phoneNumberError) emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
            isValid = false;
            if (!nameError && !phoneNumberError) emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (!date) {
            setDateError('Preferred Date is required.');
            isValid = false;
            if (!nameError && !phoneNumberError && !emailError) dateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (date < today) {
                setDateError('Please select a future date.');
                isValid = false;
                if (!nameError && !phoneNumberError && !emailError) dateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        if (!timeSlot) {
            setTimeSlotError('Preferred Time Slot is required.');
            isValid = false;
            if (!nameError && !phoneNumberError && !emailError && !dateError) timeSlotRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (!medicalAttention) {
            setMedicalAttentionError('Please describe the medical attention needed.');
            isValid = false;
            if (!nameError && !phoneNumberError && !emailError && !dateError && !timeSlotError) medicalAttentionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (consultationType === 'Home Consultation') {
            if (!address) {
                setAddressError('Your Address is required.');
                isValid = false;
                if (!nameError && !phoneNumberError && !emailError && !dateError && !timeSlotError && !medicalAttentionError) addressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            if (!selectedCity) {
                setAddressError('Your City is required.');
                isValid = false;
                if (!nameError && !phoneNumberError && !emailError && !dateError && !timeSlotError && !medicalAttentionError && !address) cityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        if (!consultationType) {
            toast.error('Please select a vet package first.');
            isValid = false;
        }

        if (!isValid) return;

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
                        <label htmlFor="consultationType" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>
                            Type of Consultation
                        </label>
                        <input
                            type="text"
                            id="consultationType"
                            value={consultationType || 'Select a package first'}
                            readOnly
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label htmlFor="petType" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>
                            What type of pet?
                        </label>
                        <select
                            id="petType"
                            value={petType}
                            onChange={(e) => setPetType(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow appearance-none focus:outline-none focus:ring-blue-500"
                        >
                            <option value="Cat">Cat</option>
                            <option value="Dog">Dog</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>
                            Reason for Consultation
                        </label>
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
                        <label htmlFor="medicalAttention" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>
                            Describe medical attention needed
                        </label>
                        <textarea
                            ref={medicalAttentionRef}
                            id="medicalAttention"
                            value={medicalAttention}
                            onChange={(e) => setMedicalAttention(e.target.value)}
                            rows={4}
                            className={`mt-1 p-2 w-full border rounded-md shadow appearance-none focus:outline-none focus:ring-blue-500 ${medicalAttentionError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {medicalAttentionError && <p className="text-red-500 text-xs italic">{medicalAttentionError}</p>}
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>
                            Your Name
                        </label>
                        <input
                            ref={nameRef}
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`mt-1 p-2 w-full border rounded-md shadow appearance-none focus:outline-none focus:ring-blue-500 ${nameError ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Enter your name"
                        />
                        {nameError && <p className="text-red-500 text-xs italic">{nameError}</p>}
                    </div>

                    {consultationType === 'Home Consultation' && (
                        <>
                            <div ref={cityRef}>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>
                                    Select Your City
                                </label>
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
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>
                                    Your Address
                                </label>
                                <input
                                    ref={addressRef}
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
                    )}

                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>
                            Phone Number
                        </label>
                        <input
                            ref={phoneNumberRef}
                            type="tel"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className={`mt-1 p-2 w-full border rounded-md shadow appearance-none ${phoneNumberError ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Enter your phone number"
                        />
                        {phoneNumberError && <p className="text-red-500 text-xs italic">{phoneNumberError}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>
                            Your Email
                        </label>
                        <input
                            ref={emailRef}
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
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>
                            Preferred Date
                        </label>
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
                        <div ref={timeSlotRef}>
                            <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>
                                Preferred Time Slot
                            </label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {timeSlots.map((slot) => (
                                    <button
                                        key={slot}
                                        type="button"
                                        className={`py-2 px-4 rounded-md shadow ${isSlotDisabled(slot) ? 'bg-gray-300 border-2 border-black cursor-not-allowed' : slot === timeSlot ? 'bg-blue-500 text-white border-2 border-black' : 'text-black border-2 border-black'}`}
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
                            type="button"
                            onClick={handleNextClick}
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