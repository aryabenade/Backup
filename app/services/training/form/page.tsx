//app/services/training/form/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast, { Toaster } from "react-hot-toast";
import FormReminder from "@/app/components/FormReminder";
import { useUser } from "@clerk/nextjs";
import Select from "react-select";
import { catBreeds } from "@/app/data/catBreeds";
import { dogBreeds } from "@/app/data/dogBreeds";
import { cityOptions } from "@/app/data/availableCities";
import { fetchTrainingBookedDays } from "@/app/services/training/trainingBooking";
import { dogTrainingPackages, catTrainingPackages } from "@/app/services/training/data";

const TrainingBookingForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [preferredDays, setPreferredDays] = useState<string[]>([]);
  const [petType, setPetType] = useState("Dog");
  const [petName, setPetName] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petGender, setPetGender] = useState("Male");
  const [petSize, setPetSize] = useState("Small");
  const [petAggression, setPetAggression] = useState("Low");
  const [petAge, setPetAge] = useState("< 3 months");
  const [address, setAddress] = useState("");
  const [selectedCity, setSelectedCity] = useState<{ label: string; value: string } | null>(null);
  const [bookedDays, setBookedDays] = useState<{ [key: string]: string[] }>({});
  const [breedOptions, setBreedOptions] = useState<{ label: string; value: string }[]>([]);

  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTitle = searchParams?.get("title") || "";
  const searchPrice = searchParams?.get("price") || "";
  const [title, setTitle] = useState(searchTitle);
  const [price, setPrice] = useState(searchPrice);

  // Error states
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [preferredDaysError, setPreferredDaysError] = useState<string | null>(null);
  const [petNameError, setPetNameError] = useState<string | null>(null);
  const [petBreedError, setPetBreedError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const searchSessionsPerWeek = parseInt(searchParams?.get("sessionsPerWeek") || "2", 10);
  const [sessionsPerWeek, setSessionsPerWeek] = useState(searchSessionsPerWeek);

  // Set petType based on package title and lock it
  useEffect(() => {
    const dogPackageTitles = dogTrainingPackages.map((pkg) => pkg.title);
    const catPackageTitles = catTrainingPackages.map((pkg) => pkg.title);

    if (dogPackageTitles.includes(searchTitle)) {
      setPetType("Dog");
    } else if (catPackageTitles.includes(searchTitle)) {
      setPetType("Cat");
    }
  }, [searchTitle]);

  // Set breed options based on pet type
  useEffect(() => {
    if (petType === "Cat") {
      setBreedOptions(catBreeds.map((breed) => ({ label: breed, value: breed })));
    } else {
      setBreedOptions(dogBreeds.map((breed) => ({ label: breed, value: breed })));
    }
  }, [petType]);

  // Fetch booked days when start date or city changes
  useEffect(() => {
    if (startDate && selectedCity) {
      fetchTrainingBookedDays(startDate, selectedCity.value).then(setBookedDays);
    }
  }, [startDate, selectedCity]);

  // Pre-fill form from sessionStorage if repeating an order
  useEffect(() => {
    const storedOrder = sessionStorage.getItem("repeatOrder");
    if (storedOrder) {
      const orderData = JSON.parse(storedOrder);
      setName(orderData.name);
      setPhoneNumber(orderData.phoneNumber);
      setEmail(orderData.email);
      setPetType(orderData.petType);
      setPetName(orderData.petName);
      setPetBreed(orderData.petBreed);
      setPetGender(orderData.petGender);
      setPetSize(orderData.petSize);
      setPetAggression(orderData.petAggression);
      setPetAge(orderData.petAge);
      setSelectedCity({ label: orderData.city, value: orderData.city });
      setAddress(orderData.address);
      if (!searchTitle) setTitle(orderData.packageTitle);
      if (!searchPrice) setPrice(orderData.packagePrice);
      sessionStorage.removeItem("repeatOrder");
    }
  }, [searchTitle, searchPrice]);

  // Check if a day is fully booked
  const isDayDisabled = (day: string) => {
    if (!startDate || !selectedCity) return false;
    const dateKey = startDate.toISOString().split("T")[0];
    const bookingsForDate = bookedDays[dateKey] || [];
    return bookingsForDate.includes(day);
  };

  // Handle preferred days selection
  const handleDayToggle = (day: string) => {
    if (preferredDays.includes(day)) {
      setPreferredDays(preferredDays.filter((d) => d !== day));
    } else if (preferredDays.length < sessionsPerWeek && !isDayDisabled(day)) {
      setPreferredDays([...preferredDays, day]);
    }
  };

  // Validation functions
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhoneNumber = (number: string) => /^[0-9]{10}$/.test(number);

  const handleNextClick = async (e: React.FormEvent) => {
    e.preventDefault();

    setNameError(null);
    setEmailError(null);
    setPhoneNumberError(null);
    setStartDateError(null);
    setPreferredDaysError(null);
    setPetNameError(null);
    setPetBreedError(null);
    setAddressError(null);

    let isValid = true;

    if (!name) { setNameError("Your Name is required."); isValid = false; }
    if (!phoneNumber) {
      setPhoneNumberError("Phone Number is required."); isValid = false;
    } else if (!validatePhoneNumber(phoneNumber)) {
      setPhoneNumberError("Phone Number must be 10 digits."); isValid = false;
    }
    if (!email) { setEmailError("Your Email is required."); isValid = false; }
    else if (!validateEmail(email)) { setEmailError("Please enter a valid email."); isValid = false; }
    if (!startDate) { setStartDateError("Start Date is required."); isValid = false; }
    else if (startDate < new Date()) { setStartDateError("Start Date must be in the future."); isValid = false; }
    if (preferredDays.length !== sessionsPerWeek) {
      setPreferredDaysError(`Select exactly ${sessionsPerWeek} preferred day(s) for this package.`);
      isValid = false;
    } if (!petName) { setPetNameError("Pet Name is required."); isValid = false; }
    if (!petBreed) { setPetBreedError("Pet Breed is required."); isValid = false; }
    if (!address || !selectedCity) { setAddressError("Address and City are required."); isValid = false; }

    if (!isValid) return;

    if (startDate && preferredDays.length === sessionsPerWeek && selectedCity && user) {
      const newBooking = {
        name,
        phoneNumber,
        email,
        startDate,
        preferredDays,
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
        bookingType: "training",
        sessionsPerWeek, // Added
      };

      sessionStorage.setItem("formData", JSON.stringify(newBooking));
      router.push("/services/payment");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex items-center justify-center">
      <Toaster position="top-center" />
      <div className="container max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-xl font-bold text-center mb-4">Book Pet Training</h2>
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
            <label className="block text-sm font-medium text-gray-700">Pet Type</label>
            <select
              value={petType}
              onChange={(e) => setPetType(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              disabled
            >
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Pet Name</label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className={`mt-1 p-2 w-full border rounded-md ${petNameError ? "border-red-500" : "border-gray-300"}`}
              placeholder="Enter pet name"
            />
            {petNameError && <p className="text-red-500 text-xs italic">{petNameError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Pet Breed</label>
            <Select
              value={breedOptions.find((option) => option.value === petBreed)}
              onChange={(option) => setPetBreed(option?.value || "")}
              options={breedOptions}
              className={`mt-1 ${petBreedError ? "border-red-500" : ""}`}
              placeholder="Select or search breed"
            />
            {petBreedError && <p className="text-red-500 text-xs italic">{petBreedError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Pet Gender</label>
            <select
              value={petGender}
              onChange={(e) => setPetGender(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Pet Size</label>
            <select
              value={petSize}
              onChange={(e) => setPetSize(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            >
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Pet Aggression</label>
            <select
              value={petAggression}
              onChange={(e) => setPetAggression(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Pet Age</label>
            <select
              value={petAge}
              onChange={(e) => setPetAge(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            >
              <option value="< 3 months">&lt; 3 months</option>
              <option value="< 11 years">&lt; 11 years</option>
              <option value="11+ years">11+ years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 p-2 w-full border rounded-md ${nameError ? "border-red-500" : "border-gray-300"}`}
              placeholder="Enter your name"
            />
            {nameError && <p className="text-red-500 text-xs italic">{nameError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`mt-1 p-2 w-full border rounded-md ${phoneNumberError ? "border-red-500" : "border-gray-300"}`}
              placeholder="Enter your phone number"
            />
            {phoneNumberError && <p className="text-red-500 text-xs italic">{phoneNumberError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Your Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 p-2 w-full border rounded-md ${emailError ? "border-red-500" : "border-gray-300"}`}
              placeholder="Enter your email"
            />
            {emailError && <p className="text-red-500 text-xs italic">{emailError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Select Your City</label>
            <Select
              value={selectedCity}
              onChange={(option) => setSelectedCity(option)}
              options={cityOptions}
              className={`mt-1 ${addressError ? "border-red-500" : ""}`}
              placeholder="Select or search city"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Your Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`mt-1 p-2 w-full border rounded-md ${addressError ? "border-red-500" : "border-gray-300"}`}
              placeholder="Enter your address"
            />
            {addressError && <p className="text-red-500 text-xs italic">{addressError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="MMMM d, yyyy"
              minDate={new Date()}
              className={`mt-1 p-2 w-full border rounded-md ${startDateError ? "border-red-500" : "border-gray-300"}`}
              placeholderText="Select a start date"
            />
            {startDateError && <p className="text-red-500 text-xs italic">{startDateError}</p>}
          </div>

          {startDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preferred Days (Select exactly {sessionsPerWeek})
              </label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    type="button"
                    className={`py-2 px-4 rounded-md shadow ${isDayDisabled(day)
                      ? "bg-gray-300 border-2 border-black cursor-not-allowed"
                      : preferredDays.includes(day)
                        ? "bg-blue-500 text-white border-2 border-black"
                        : "text-black border-2 border-black"
                      }`}
                    onClick={() => handleDayToggle(day)}
                    disabled={isDayDisabled(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {preferredDaysError && (
                <p className="text-red-500 text-xs italic">{preferredDaysError}</p>
              )}
            </div>
          )}

          <FormReminder message="Please check your email for updates on your training schedule. We’ll confirm your preferred days and start date soon!" />

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

export default TrainingBookingForm;