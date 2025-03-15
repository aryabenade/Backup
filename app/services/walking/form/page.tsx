// // app/services/walking/form/page.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast, { Toaster } from "react-hot-toast";
import FormReminder from "@/app/components/FormReminder";
import { useUser } from "@clerk/nextjs";
import Select from "react-select";
import { dogBreeds } from "@/app/data/dogBreeds";
import { cityOptions } from "@/app/data/availableCities";
import { fetchWalkingBookedDays } from "@/app/services/walking/walkingBooking";

const WalkingBookingForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [timeSlot, setTimeSlot] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const [walkDuration, setWalkDuration] = useState<string>("");
  const [petName, setPetName] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petGender, setPetGender] = useState("Male");
  const [energyLevel, setEnergyLevel] = useState("Medium");
  const [leashBehavior, setLeashBehavior] = useState("Good");
  const [petAge, setPetAge] = useState("< 3 months");
  const [address, setAddress] = useState("");
  const [selectedCity, setSelectedCity] = useState<{ label: string; value: string } | null>(null);
  const [bookedDays, setBookedDays] = useState<{ [key: string]: string[] }>({});
  const [breedOptions, setBreedOptions] = useState<{ label: string; value: string }[]>([]);
  const [totalWalks, setTotalWalks] = useState(0);
  const [totalCost, setTotalCost] = useState("");
  const [packageTitle, setPackageTitle] = useState<string>("");

  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const timeSlotRef = useRef<HTMLSelectElement>(null);
  const daysOfWeekRef = useRef<HTMLDivElement>(null);
  const petNameRef = useRef<HTMLInputElement>(null);
  const petBreedRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [endDateError, setEndDateError] = useState<string | null>(null);
  const [timeSlotError, setTimeSlotError] = useState<string | null>(null);
  const [daysOfWeekError, setDaysOfWeekError] = useState<string | null>(null);
  const [petNameError, setPetNameError] = useState<string | null>(null);
  const [petBreedError, setPetBreedError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timeSlots = ["7:00 AM - 8:00 AM", "9:00 AM - 10:00 AM", "4:00 PM - 5:00 PM", "6:00 PM - 7:00 PM"];

  // Get valid days between startDate and endDate
  const getValidDays = () => {
    if (!startDate || !endDate) return [];
    const validDays: string[] = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      const dayName = dayNames[current.getDay()];
      if (!validDays.includes(dayName)) validDays.push(dayName);
      current.setDate(current.getDate() + 1);
    }
    return validDays;
  };

  const validDays = getValidDays();

  // Prefill form from sessionStorage repeatOrder or set packageTitle from URL
  useEffect(() => {
    const repeatOrder = sessionStorage.getItem("repeatOrder");
    if (repeatOrder) {
      const order = JSON.parse(repeatOrder);
      setName(order.name || "");
      setEmail(order.email || "");
      setPhoneNumber(order.phoneNumber || "");
      setStartDate(order.startDate ? new Date(order.startDate) : null);
      setEndDate(order.endDate ? new Date(order.endDate) : null);
      setTimeSlot(order.timeSlot || "");
      setDaysOfWeek(order.daysOfWeek || []);
      setWalkDuration(order.walkDuration || "");
      setPetName(order.petName || "");
      setPetBreed(order.petBreed || "");
      setPetGender(order.petGender || "Male");
      setEnergyLevel(order.energyLevel || "Medium");
      setLeashBehavior(order.leashBehavior || "Good");
      setPetAge(order.petAge || "< 3 months");
      setAddress(order.address || "");
      setSelectedCity(order.city ? { label: order.city, value: order.city } : null);
      setTotalWalks(order.totalWalks || 0);
      setTotalCost(order.totalCost || "");
      setPackageTitle(order.packageTitle || "");
      sessionStorage.removeItem("repeatOrder"); // Clear after use
    } else {
      const title = searchParams ? searchParams.get("title") : null;
      if (title) {
        setPackageTitle(title);
        if (title === "1-Hour Walks") setWalkDuration("1 hour");
        else if (title === "30-Minute Walks") setWalkDuration("30 mins");
      } else {
        setPackageTitle("30-Minute Walks");
        setWalkDuration("30 mins");
      }
    }
  }, [searchParams]);

  // Set breed options for dogs
  useEffect(() => {
    setBreedOptions(dogBreeds.map((breed) => ({ label: breed, value: breed })));
  }, []);

  // Fetch booked days
  useEffect(() => {
    if (startDate && selectedCity && daysOfWeek.length > 0) fetchWalkingBookedDays(startDate, selectedCity.value).then(setBookedDays);
  }, [startDate, selectedCity, daysOfWeek]);

  // Calculate total walks and cost
  useEffect(() => {
    if (startDate && endDate && daysOfWeek.length > 0 && walkDuration) {
      const baseRate = walkDuration === "30 mins" ? 100 : 150;
      let walks = 0;
      const current = new Date(startDate);
      while (current <= endDate) {
        const dayName = dayNames[current.getDay()];
        if (daysOfWeek.includes(dayName)) walks++;
        current.setDate(current.getDate() + 1);
      }
      setTotalWalks(walks);
      const cost = walks * baseRate * (walks >= 20 ? 0.9 : walks >= 5 ? 0.95 : 1);
      setTotalCost(`₹${Math.round(cost)}`);
    }
  }, [startDate, endDate, daysOfWeek, walkDuration]);

  const isDayDisabled = (day: string) => {
    if (!startDate || !selectedCity) return !validDays.includes(day);
    const dateKey = startDate.toISOString().split("T")[0];
    const bookingsForDate = bookedDays[dateKey] || [];
    return !validDays.includes(day) || bookingsForDate.includes(day);
  };

  const handleDayToggle = (day: string) => {
    if (!validDays.includes(day)) return;
    if (daysOfWeek.includes(day)) setDaysOfWeek(daysOfWeek.filter((d) => d !== day));
    else if (!isDayDisabled(day)) setDaysOfWeek([...daysOfWeek, day]);
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhoneNumber = (number: string) => /^[0-9]{10}$/.test(number);

  const handleNextClick = async (e: React.FormEvent) => {
    e.preventDefault();

    setNameError(null);
    setEmailError(null);
    setPhoneNumberError(null);
    setStartDateError(null);
    setEndDateError(null);
    setTimeSlotError(null);
    setDaysOfWeekError(null);
    setPetNameError(null);
    setPetBreedError(null);
    setAddressError(null);

    let isValid = true;

    if (!name) { setNameError("Your Name is required."); isValid = false; nameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }
    if (!phoneNumber) { setPhoneNumberError("Phone Number is required."); isValid = false; if (!nameError) phoneNumberRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }
    else if (!validatePhoneNumber(phoneNumber)) { setPhoneNumberError("Phone Number must be 10 digits."); isValid = false; if (!nameError) phoneNumberRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }
    if (!email) { setEmailError("Your Email is required."); isValid = false; if (!nameError && !phoneNumberError) emailRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }
    else if (!validateEmail(email)) { setEmailError("Please enter a valid email."); isValid = false; if (!nameError && !phoneNumberError) emailRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }
    if (!startDate) { setStartDateError("Start Date is required."); isValid = false; if (!nameError && !phoneNumberError && !emailError) startDateRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }
    else if (startDate < new Date()) { setStartDateError("Start Date must be in the future."); isValid = false; if (!nameError && !phoneNumberError && !emailError) startDateRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }
    if (!endDate) { setEndDateError("End Date is required."); isValid = false; if (!nameError && !phoneNumberError && !emailError && !startDateError) endDateRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }
    else if (startDate && endDate < startDate) { setEndDateError("End Date must be after Start Date."); isValid = false; if (!nameError && !phoneNumberError && !emailError && !startDateError) endDateRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }
    if (!timeSlot) { setTimeSlotError("Time Slot is required."); isValid = false; if (!nameError && !phoneNumberError && !emailError && !startDateError && !endDateError) timeSlotRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }
    if (daysOfWeek.length === 0) { setDaysOfWeekError("Select at least one day."); isValid = false; if (!nameError && !phoneNumberError && !emailError && !startDateError && !endDateError && !timeSlotError) daysOfWeekRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }
    if (!petName) { setPetNameError("Pet Name is required."); isValid = false; if (!nameError && !phoneNumberError && !emailError && !startDateError && !endDateError && !timeSlotError && !daysOfWeekError) petNameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }
    if (!petBreed) { setPetBreedError("Pet Breed is required."); isValid = false; if (!nameError && !phoneNumberError && !emailError && !startDateError && !endDateError && !timeSlotError && !daysOfWeekError && !petNameError) petBreedRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }
    if (!address || !selectedCity) { setAddressError("Address and City are required."); isValid = false; if (!nameError && !phoneNumberError && !emailError && !startDateError && !endDateError && !timeSlotError && !daysOfWeekError && !petNameError && !petBreedError) (selectedCity ? addressRef : cityRef).current?.scrollIntoView({ behavior: "smooth", block: "center" }); }

    if (!isValid) return;

    if (startDate && endDate && user) {
      const newBooking = {
        name,
        phoneNumber,
        email,
        startDate,
        endDate,
        timeSlot,
        daysOfWeek,
        walkDuration,
        petType: "Dog",
        petName,
        petBreed,
        petGender,
        energyLevel,
        leashBehavior,
        petAge,
        city: selectedCity!.value,
        address,
        totalWalks,
        totalCost,
        userId: user.id,
        bookingType: "walking",
        packageTitle,
      };

      sessionStorage.setItem("formData", JSON.stringify(newBooking));
      router.push("/services/payment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex items-center justify-center">
      <Toaster position="top-center" />
      <div className="container max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-xl font-bold text-center mb-4">Book Dog Walking</h2>
        <form className="max-w-lg mx-auto space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Package</label>
            <div className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100">
              {packageTitle || "Select a package from the walking page"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Walk Duration</label>
            <div className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100">
              {walkDuration || "Select a package first"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Dog Name</label>
            <input ref={petNameRef} type="text" value={petName} onChange={(e) => setPetName(e.target.value)} className={`mt-1 p-2 w-full border rounded-md ${petNameError ? "border-red-500" : "border-gray-300"}`} placeholder="Enter dog name" />
            {petNameError && <p className="text-red-500 text-xs italic">{petNameError}</p>}
          </div>

          <div ref={petBreedRef}>
            <label className="block text-sm font-medium text-gray-700">Dog Breed</label>
            <Select value={breedOptions.find((option) => option.value === petBreed)} onChange={(option) => setPetBreed(option?.value || "")} options={breedOptions} className={`mt-1 ${petBreedError ? "border-red-500" : ""}`} placeholder="Select or search breed" />
            {petBreedError && <p className="text-red-500 text-xs italic">{petBreedError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Dog Gender</label>
            <select value={petGender} onChange={(e) => setPetGender(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Energy Level</label>
            <select value={energyLevel} onChange={(e) => setEnergyLevel(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Leash Behavior</label>
            <select value={leashBehavior} onChange={(e) => setLeashBehavior(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md">
              <option value="Good">Good</option>
              <option value="Pulls">Pulls</option>
              <option value="Needs Work">Needs Work</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Dog Age</label>
            <select value={petAge} onChange={(e) => setPetAge(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md">
              {/* <option value="< 3 months">< 3 months</option>
              <option value="< 11 years">< 11 years</option> */}
              <option value="11+ years">11+ years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Your Name</label>
            <input ref={nameRef} type="text" value={name} onChange={(e) => setName(e.target.value)} className={`mt-1 p-2 w-full border rounded-md ${nameError ? "border-red-500" : "border-gray-300"}`} placeholder="Enter your name" />
            {nameError && <p className="text-red-500 text-xs italic">{nameError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input ref={phoneNumberRef} type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className={`mt-1 p-2 w-full border rounded-md ${phoneNumberError ? "border-red-500" : "border-gray-300"}`} placeholder="Enter your phone number" />
            {phoneNumberError && <p className="text-red-500 text-xs italic">{phoneNumberError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Your Email</label>
            <input ref={emailRef} type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`mt-1 p-2 w-full border rounded-md ${emailError ? "border-red-500" : "border-gray-300"}`} placeholder="Enter your email" />
            {emailError && <p className="text-red-500 text-xs italic">{emailError}</p>}
          </div>

          <div ref={cityRef}>
            <label className="block text-sm font-medium text-gray-700">Select Your City</label>
            <Select value={selectedCity} onChange={(option) => setSelectedCity(option)} options={cityOptions} className={`mt-1 ${addressError ? "border-red-500" : ""}`} placeholder="Select or search city" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Your Address</label>
            <input ref={addressRef} type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={`mt-1 p-2 w-full border rounded-md ${addressError ? "border-red-500" : "border-gray-300"}`} placeholder="Enter your address" />
            {addressError && <p className="text-red-500 text-xs italic">{addressError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="MMMM d, yyyy" minDate={new Date()} className={`mt-1 p-2 w-full border rounded-md ${startDateError ? "border-red-500" : "border-gray-300"}`} placeholderText="Select start date" />
            {startDateError && <p className="text-red-500 text-xs italic">{startDateError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="MMMM d, yyyy" minDate={startDate ? startDate : new Date()} className={`mt-1 p-2 w-full border rounded-md ${endDateError ? "border-red-500" : "border-gray-300"}`} placeholderText="Select end date" />
            {endDateError && <p className="text-red-500 text-xs italic">{endDateError}</p>}
          </div>

          <div ref={daysOfWeekRef}>
            <label className="block text-sm font-medium text-gray-700">Days of Week (select at least one)</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {dayNames.map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`py-2 px-4 rounded-md shadow ${isDayDisabled(day) ? "bg-gray-300 border-2 border-black cursor-not-allowed" : daysOfWeek.includes(day) ? "bg-blue-500 text-white border-2 border-black" : "text-black border-2 border-black"}`}
                  onClick={() => handleDayToggle(day)}
                  disabled={isDayDisabled(day)}
                >
                  {day}
                </button>
              ))}
            </div>
            {daysOfWeekError && <p className="text-red-500 text-xs italic">{daysOfWeekError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Time Slot</label>
            <select ref={timeSlotRef} value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} className={`mt-1 p-2 w-full border rounded-md ${timeSlotError ? "border-red-500" : "border-gray-300"}`}>
              <option value="">Select a time slot</option>
              {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
            </select>
            {timeSlotError && <p className="text-red-500 text-xs italic">{timeSlotError}</p>}
          </div>

          {totalWalks > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Summary</label>
              <div className="mt-1 p-2 w-full border border-gray-300 rounded-md">
                {totalWalks} walk(s) at {walkDuration} each = {totalCost} ({packageTitle})
              </div>
            </div>
          )}

          <FormReminder message="Please check your email for your walking schedule confirmation. We’ll notify you of any changes!" />

          <div className="flex items-center justify-between">
            <button type="button" onClick={handleNextClick} className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WalkingBookingForm;