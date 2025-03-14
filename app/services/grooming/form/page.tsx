// GroomingBookingForm in app/services/grooming/form/page.tsx
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import toast, { Toaster } from 'react-hot-toast';
import FormReminder from '@/app/components/FormReminder';
import { fetchBookedSlots } from '@/app/services/grooming/groomingBooking';
import Select from 'react-select';
import { catBreeds } from '@/app/data/catBreeds';
import { dogBreeds } from '@/app/data/dogBreeds';
import { useUser } from '@clerk/nextjs';
import { cityOptions } from '@/app/data/availableCities';

const GroomingBookingForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState<Date | null>(null);
    const [timeSlot, setTimeSlot] = useState('');
    const [petType, setPetType] = useState('');
    const [petName, setPetName] = useState('');
    const [petBreed, setPetBreed] = useState('');
    const [petGender, setPetGender] = useState('Male');
    const [petSize, setPetSize] = useState('Small');
    const [petAggression, setPetAggression] = useState('Low');
    const [petAge, setPetAge] = useState('< 3 months');
    const [address, setAddress] = useState('');
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [breedOptions, setBreedOptions] = useState<{ label: string, value: string }[]>([]);
    const [selectedCity, setSelectedCity] = useState<{ label: string, value: string } | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const { user } = useUser();

    const [nameError, setNameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [dateError, setDateError] = useState<string | null>(null);
    const [timeSlotError, setTimeSlotError] = useState<string | null>(null);
    const [petNameError, setPetNameError] = useState<string | null>(null);
    const [petBreedError, setPetBreedError] = useState<string | null>(null);
    const [addressError, setAddressError] = useState<string | null>(null);
    const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const timeSlotRef = useRef<HTMLDivElement>(null);
    const petNameRef = useRef<HTMLInputElement>(null);
    const petBreedRef = useRef<HTMLDivElement>(null);
    const addressRef = useRef<HTMLInputElement>(null);
    const phoneNumberRef = useRef<HTMLInputElement>(null);
    const cityRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const searchTitle = searchParams?.get("title") || '';
    const searchPrice = searchParams?.get("price") || '';
    const searchPetType = searchParams?.get("petType") || '';

    const [title, setTitle] = useState(searchTitle);
    const [price, setPrice] = useState(searchPrice);

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
            setPetName(orderData.petName);
            setPetBreed(orderData.petBreed);
            setPetGender(orderData.petGender);
            setPetSize(orderData.petSize);
            setPetAggression(orderData.petAggression);
            setPetAge(orderData.petAge);
            setSelectedCity({ label: orderData.city, value: orderData.city });
            setAddress(orderData.address);
            setPetType(orderData.petType); // Set petType from repeat order
            if (!searchTitle) setTitle(orderData.packageTitle);
            if (!searchPrice) setPrice(orderData.packagePrice);
            sessionStorage.removeItem('repeatOrder');
        } else if (searchPetType) {
            setPetType(searchPetType); // Fallback to search params if no repeat order
        }
    }, [searchTitle, searchPrice, searchPetType]);

    useEffect(() => {
        if (petType === 'Cat') {
            setBreedOptions(catBreeds.map(breed => ({ label: breed, value: breed })));
        } else if (petType === 'Dog') {
            setBreedOptions(dogBreeds.map(breed => ({ label: breed, value: breed })));
        }
    }, [petType]);

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

    const handleNextClick = async (e: React.FormEvent) => {
        e.preventDefault();

        setNameError(null);
        setPhoneNumberError(null);
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
        if (!petName) {
            setPetNameError('Pet Name is required.');
            isValid = false;
            if (!nameError && !phoneNumberError && !emailError && !dateError && !timeSlotError) petNameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (!petBreed) {
            setPetBreedError('Pet Breed is required.');
            isValid = false;
            if (!nameError && !phoneNumberError && !emailError && !dateError && !timeSlotError && !petNameError) petBreedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (!address) {
            setAddressError('Your Address is required.');
            isValid = false;
            if (!nameError && !phoneNumberError && !emailError && !dateError && !timeSlotError && !petNameError && !petBreedError) addressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (!selectedCity) {
            setAddressError('Your City is required.');
            isValid = false;
            if (!nameError && !phoneNumberError && !emailError && !dateError && !timeSlotError && !petNameError && !petBreedError && !address) cityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (!petType) {
            toast.error('Please select a grooming package first.');
            isValid = false;
        }

        if (!isValid) return;

        if (date && timeSlot && selectedCity && user) {
            const newBooking = {
                name,
                phoneNumber,
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
                city: selectedCity.value,
                address,
                packageTitle: title,
                packagePrice: price,
                userId: user.id,
                bookingType: 'grooming'
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
                        <label htmlFor="petType" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>
                            Pet Type
                        </label>
                        <input
                            type="text"
                            id="petType"
                            value={petType || 'Select a package first'} // Display petType or fallback message
                            readOnly
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
                        />
                    </div>

                    {/* Rest of the form remains unchanged */}
                    <div>
                        <label htmlFor="petName" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>
                            Name of your pet?
                        </label>
                        <input
                            ref={petNameRef}
                            type="text"
                            id="petName"
                            value={petName}
                            onChange={(e) => setPetName(e.target.value)}
                            className={`mt-1 p-2 w-full border rounded-md shadow appearance-none ${petNameError ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Enter pet name"
                        />
                        {petNameError && <p className="text-red-500 text-xs italic">{petNameError}</p>}
                    </div>

                    <div ref={petBreedRef}>
                        <label htmlFor="petBreed" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>
                            Breed of your pet?
                        </label>
                        <Select
                            id="petBreed"
                            value={breedOptions.find(option => option.value === petBreed)}
                            onChange={(option) => setPetBreed(option?.value || '')}
                            options={breedOptions}
                            className={`mt-1 ${petBreedError ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Select or search breed"
                        />
                        {petBreedError && <p className="text-red-500 text-xs italic">{petBreedError}</p>}
                    </div>

                    <div>
                        <label htmlFor="petGender" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>
                            Gender of your pet?
                        </label>
                        <select
                            id="petGender"
                            value={petGender}
                            onChange={(e) => setPetGender(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow appearance-none"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="petSize" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>
                            Size of your pet?
                        </label>
                        <select
                            id="petSize"
                            value={petSize}
                            onChange={(e) => setPetSize(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow appearance-none"
                        >
                            <option value="Small">Small</option>
                            <option value="Medium">Medium</option>
                            <option value="Large">Large</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="petAggression" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>
                            How aggressive is your pet?
                        </label>
                        <select
                            id="petAggression"
                            value={petAggression}
                            onChange={(e) => setPetAggression(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow appearance-none"
                        >
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
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>
                            Your Name
                        </label>
                        <input
                            ref={nameRef}
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`mt-1 p-2 w-full border rounded-md shadow appearance-none ${nameError ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Enter your name"
                        />
                        {nameError && <p className="text-red-500 text-xs italic">{nameError}</p>}
                    </div>

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
                            className={`mt-1 p-2 w-full border rounded-md shadow appearance-none ${emailError ? 'border-red-500' : 'border-gray-300'}`}
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

export default GroomingBookingForm;