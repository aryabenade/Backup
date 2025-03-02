// //app/list-a-pet/new/page.tsx
// //part 1
// "use client";

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useUser } from '@clerk/nextjs';
// import { Pet } from '../../types';
// import toast, { Toaster } from 'react-hot-toast';
// import { BeatLoader } from 'react-spinners';
// import FormReminder from '@/app/components/FormReminder';
// import { catBreeds } from '@/app/data/catBreeds';
// import { dogBreeds } from '@/app/data/dogBreeds';
// import Select from 'react-select';


// const PetListingForm: React.FC = () => {
//     const { user } = useUser();
//     const router = useRouter();
//     const [name, setName] = useState('');
//     const [age, setAge] = useState('');
//     const [ageUnit, setAgeUnit] = useState('weeks'); // Default age unit
//     const [state, setState] = useState('');
//     const [city, setCity] = useState('');
//     const [contact, setContact] = useState('');
//     const [image, setImage] = useState<File | null>(null);
//     const [formSubmitted, setFormSubmitted] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [petType, setPetType] = useState('Dog');
//     const [petBreed, setPetBreed] = useState('');
//     const [breedOptions, setBreedOptions] = useState<{ label: string, value: string }[]>([]);


//     // Validation states
//     const [nameError, setNameError] = useState<string | null>(null);
//     const [ageError, setAgeError] = useState<string | null>(null);
//     const [petBreedError, setPetBreedError] = useState<string | null>(null);
//     const [stateError, setStateError] = useState<string | null>(null);
//     const [cityError, setCityError] = useState<string | null>(null);
//     const [contactError, setContactError] = useState<string | null>(null);
//     const [imageError, setImageError] = useState<string | null>(null);



//     useEffect(() => {
//         if (petType === 'Cat') {
//             setBreedOptions(catBreeds.map(breed => ({ label: breed, value: breed })));
//         } else if (petType === 'Dog') {
//             setBreedOptions(dogBreeds.map(breed => ({ label: breed, value: breed })));
//         }
//     }, [petType]);


//     // Function to handle image upload
//     const handleImageUpload = async (file: File): Promise<string> => {
//         try {
//             const formData = new FormData();
//             formData.append('file', file);
//             formData.append('upload_preset', 'my_upload_preset'); // Use your actual upload preset name
//             const response = await fetch('/api/uploadImage', {
//                 method: 'POST',
//                 body: formData,
//             });

//             if (!response.ok) {
//                 throw new Error(`Image upload failed with status: ${response.status}`);
//             }

//             const data = await response.json();
//             return data.url; // This is the URL of the uploaded image
//         } catch (uploadError: any) {
//             toast.error(`Image upload failed: ${uploadError.message}`);
//             throw uploadError; // Re-throw to be caught in handleSubmit
//         }
//     };

//     // Email validation regex
//     const validateEmail = (email: string) => {
//         const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return regex.test(email);
//     };

//     // Function to handle form submission
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         // Reset previous errors
//         setNameError(null);
//         setAgeError(null);
//         setPetBreedError(null);
//         setStateError(null);
//         setCityError(null);
//         setContactError(null);
//         setImageError(null);
//         setError(null);

//         let isValid = true;

//         // Name validation
//         if (!name) {
//             setNameError('Pet Name is required.');
//             isValid = false;
//         }

//         // Age validation
//         if (!age) {
//             setAgeError('Age is required.');
//             isValid = false;
//         } else if (isNaN(Number(age)) || parseInt(age, 10) <= 0) {
//             setAgeError('Age must be a valid positive number.');
//             isValid = false;
//         } else {
//             const ageNumber = parseInt(age, 10);
//             if (petType === 'Dog' && (ageNumber > 30 || (ageUnit === 'years' && ageNumber > 20))) {
//                 setAgeError('Please enter a valid age for a dog (up to 20 years).');
//                 isValid = false;
//             } else if (petType === 'Cat' && (ageNumber > 30 || (ageUnit === 'years' && ageNumber > 20))) {
//                 setAgeError('Please enter a valid age for a cat (up to 20 years).');
//                 isValid = false;
//             }
//         }

//         // Breed validation
//         if (!petBreed) {
//             setPetBreedError('Pet Breed is required.');
//             isValid = false;
//         }

//         // State validation
//         if (!state) {
//             setStateError('State is required.');
//             isValid = false;
//         }

//         // City validation
//         if (!city) {
//             setCityError('City is required.');
//             isValid = false;
//         }

//         // Contact validation
//         if (!contact) {
//             setContactError('Contact information is required.');
//             isValid = false;
//         } else if (!validateEmail(contact)) {
//             setContactError('Please enter a valid email address.');
//             isValid = false;
//         }

//         // Image validation
//         if (!image) {
//             setImageError('Image is required.');
//             isValid = false;
//         }

//         if (!isValid) {
//             return; // Stop submission if there are validation errors
//         }

//         let imageUrl: string | null = null;
//         try {
//             setLoading(true);
//             if (image) {
//                 imageUrl = await handleImageUpload(image);
//             }

//             if (!user?.id) {
//                 setError('User is not authenticated');
//                 return;
//             }

//             const newPet: Pet = {
//                 name,
//                 age: parseInt(age, 10),
//                 ageUnit,
//                 petType,
//                 petBreed,
//                 state,
//                 city,
//                 contact,
//                 image: imageUrl,
//                 userId: user.id,  // Ensure userId is not undefined
//             };
//             const response = await fetch('/api/pets', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(newPet),
//             });

//             if (response.ok) {
//                 setFormSubmitted(true);
//                 setError(null);
//                 toast.success('Pet posted successfully!', {
//                     position: 'bottom-center',
//                 });
//                 setTimeout(() => {
//                     router.push('/list-a-pet');
//                 }, 2000);
//             } else {
//                 const errorMessage = await response.text();
//                 setError(`Failed to post pet: ${errorMessage}`);
//                 toast.error(`Failed to post pet: ${errorMessage}`, {
//                     position: 'bottom-center',
//                 });
//             }
//         } catch (err: any) {
//             setError(`Failed to post pet: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
//             toast.error(`Failed to post pet: ${err instanceof Error ? err.message : 'An unknown error occurred'}`, {
//                 position: 'bottom-center',
//             });
//         } finally {
//             setLoading(false);
//         }
//     };
// //part 1 ends here

// //part 2
//     return (
//         <div className="min-h-screen bg-gray-100 py-6 flex items-center justify-center">
//             <Toaster position="top-center" />
//             <div className="container max-w-md bg-white shadow-md rounded-lg p-8">
//                 <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
//                     Post a Pet for Adoption
//                 </h1>
//                 {formSubmitted ? (
//                     <div className="text-center text-green-600 text-lg mb-6">
//                         <BeatLoader color="#36D7B7" size={16} />
//                         <p className="mt-2">Your pet has been posted successfully! Redirecting...</p>
//                     </div>
//                 ) : (
//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         {error && (
//                             <div className="text-center text-red-500 text-sm mb-4">
//                                 {error}
//                             </div>
//                         )}
//                         <div>
//                             <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
//                                 Pet Name
//                             </label>
//                             <input
//                                 type="text"
//                                 id="name"
//                                 value={name}
//                                 onChange={(e) => setName(e.target.value)}
//                                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${nameError ? 'border-red-500' : ''}`}
//                                 placeholder="Enter pet name"
//                             />
//                             {nameError && <p className="text-red-500 text-xs italic">{nameError}</p>}
//                         </div>
//                         <div>
//                             <label htmlFor="age" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
//                                 Age
//                             </label>
//                             <div className="flex space-x-2">
//                                 <input
//                                     type="number"
//                                     id="age"
//                                     value={age}
//                                     onChange={(e) => setAge(e.target.value)}
//                                     className={`shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${ageError ? 'border-red-500' : ''}`}
//                                     placeholder="Enter pet age"
//                                 />
//                                 <select
//                                     value={ageUnit}
//                                     onChange={(e) => setAgeUnit(e.target.value)}
//                                     className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                 >
//                                     <option value="weeks">Weeks</option>
//                                     <option value="months">Months</option>
//                                     <option value="years">Years</option>
//                                 </select>
//                             </div>
//                             {ageError && <p className="text-red-500 text-xs italic">{ageError}</p>}
//                         </div>
//                         <div>
//                         <label htmlFor="petType" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>What type of pet?</label>
//                         <select id="petType" value={petType} onChange={(e) => setPetType(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow appearance-none">
//                             <option value="Dog">Dog</option>
//                             <option value="Cat">Cat</option>
//                         </select>
//                     </div>
//                     <div>
//                         <label htmlFor="petBreed" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>Breed of your pet?</label>
//                         <Select
//                             id="petBreed"
//                             value={breedOptions.find(option => option.value === petBreed)}
//                             onChange={(option) => setPetBreed(option?.value || '')}
//                             options={breedOptions}
//                             className={`mt-1 ${petBreedError ? 'border-red-500' : 'border-gray-300'}`}
//                             placeholder="Select or search breed"
//                         />
//                         {petBreedError && <p className="text-red-500 text-xs italic">{petBreedError}</p>}
//                     </div>
//                         <div>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div>
//                                     <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
//                                         State
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="state"
//                                         value={state}
//                                         onChange={(e) => setState(e.target.value)}
//                                         className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${stateError ? 'border-red-500' : ''}`}
//                                         placeholder="Enter state"
//                                     />
//                                     {stateError && <p className="text-red-500 text-xs italic">{stateError}</p>}
//                                 </div>
//                                 <div>
//                                     <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
//                                         City
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="city"
//                                         value={city}
//                                         onChange={(e) => setCity(e.target.value)}
//                                         className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${cityError ? 'border-red-500' : ''}`}
//                                         placeholder="Enter city"
//                                     />
//                                     {cityError && <p className="text-red-500 text-xs italic">{cityError}</p>}
//                                 </div>
//                             </div>
//                         </div>
// {/* part 2 ends here */}
// {/* part 3 */}
//                         <div>
//                             <label htmlFor="contact" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
//                                 Contact Information
//                             </label>
//                             <input
//                                 type="text"
//                                 id="contact"
//                                 value={contact}
//                                 onChange={(e) => setContact(e.target.value)}
//                                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${contactError ? 'border-red-500' : ''}`}
//                                 placeholder="Enter your email address"
//                             />
//                             {contactError && <p className="text-red-500 text-xs italic">{contactError}</p>}
//                         </div>
//                         <div>
//                             <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
//                                 Upload Image
//                             </label>
//                             <input
//                                 type="file"
//                                 id="image"
//                                 accept="image/*"
//                                 onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
//                                 className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${imageError ? 'border-red-500' : ''}`}
//                             />
//                             {imageError && <p className="text-red-500 text-xs italic">{imageError}</p>}
//                         </div>
//                         <FormReminder message="You'll receive adoption requests via email from potential adopters. Keep an eye on your inbox to review and respond to these requests. Thank you for helping give your pet a new loving home!
// "/>
//                         <div className="flex items-center justify-between">
//                             <button
//                                 type="submit"
//                                 className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                                 disabled={loading}
//                             >
//                                 {loading ? (
//                                     <div className="flex items-center justify-center">
//                                         <BeatLoader color="white" size={8} margin={3} />
//                                         <span className="ml-2">Posting...</span>
//                                     </div>
//                                 ) : (
//                                     'Post for Adoption'
//                                 )}
//                             </button>
//                         </div>
//                     </form>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default PetListingForm;
// // part 3 ends here

//app/list-a-pet/new/page.tsx
//part 1
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Pet } from '../../types';
import toast, { Toaster } from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';
import FormReminder from '@/app/components/FormReminder';
import { catBreeds } from '@/app/data/catBreeds';
import { dogBreeds } from '@/app/data/dogBreeds';
import Select from 'react-select';
import StateDropdown from '@/app/components/StateDropdown';
import CityDropdown from '@/app/components/CityDropdown'

const PetListingForm: React.FC = () => {
    const { user } = useUser();
    const router = useRouter();
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [ageUnit, setAgeUnit] = useState('weeks'); // Default age unit
    const [contact, setContact] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [petType, setPetType] = useState('Dog');
    const [petBreed, setPetBreed] = useState('');
    const [breedOptions, setBreedOptions] = useState<{ label: string, value: string }[]>([]);
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedStateId, setSelectedStateId] = useState(0);


    // Validation states
    const [nameError, setNameError] = useState<string | null>(null);
    const [ageError, setAgeError] = useState<string | null>(null);
    const [petBreedError, setPetBreedError] = useState<string | null>(null);
    const [stateError, setStateError] = useState<string | null>(null);
    const [cityError, setCityError] = useState<string | null>(null);
    const [contactError, setContactError] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);

    // Handler for state selection
    const handleStateChange = (stateName: string, stateId: number) => {
        setSelectedState(stateName);
        setSelectedStateId(stateId);
    };

    useEffect(() => {
        if (petType === 'Cat') {
            setBreedOptions(catBreeds.map(breed => ({ label: breed, value: breed })));
        } else if (petType === 'Dog') {
            setBreedOptions(dogBreeds.map(breed => ({ label: breed, value: breed })));
        }
    }, [petType]);


    // Function to handle image upload
    const handleImageUpload = async (file: File): Promise<string> => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'my_upload_preset'); // Use your actual upload preset name
            const response = await fetch('/api/uploadImage', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Image upload failed with status: ${response.status}`);
            }

            const data = await response.json();
            return data.url; // This is the URL of the uploaded image
        } catch (uploadError: any) {
            toast.error(`Image upload failed: ${uploadError.message}`);
            throw uploadError; // Re-throw to be caught in handleSubmit
        }
    };

    // Email validation regex
    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Function to handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset previous errors
        setNameError(null);
        setAgeError(null);
        setPetBreedError(null);
        setStateError(null);
        setCityError(null);
        setContactError(null);
        setImageError(null);
        setError(null);

        let isValid = true;

        // Name validation
        if (!name) {
            setNameError('Pet Name is required.');
            isValid = false;
        }

        // Age validation
        if (!age) {
            setAgeError('Age is required.');
            isValid = false;
        } else if (isNaN(Number(age)) || parseInt(age, 10) <= 0) {
            setAgeError('Age must be a valid positive number.');
            isValid = false;
        } else {
            const ageNumber = parseInt(age, 10);
            if (petType === 'Dog' && (ageNumber > 30 || (ageUnit === 'years' && ageNumber > 20))) {
                setAgeError('Please enter a valid age for a dog (up to 20 years).');
                isValid = false;
            } else if (petType === 'Cat' && (ageNumber > 30 || (ageUnit === 'years' && ageNumber > 20))) {
                setAgeError('Please enter a valid age for a cat (up to 20 years).');
                isValid = false;
            }
        }

        // Breed validation
        if (!petBreed) {
            setPetBreedError('Pet Breed is required.');
            isValid = false;
        }

        // Validation logic
        if (!selectedState) {
            setStateError('State is required.');
            isValid = false;
        }

        if (!selectedCity) {
            setCityError('City is required.');
            isValid = false;
        }

        // Contact validation
        if (!contact) {
            setContactError('Contact information is required.');
            isValid = false;
        } else if (!validateEmail(contact)) {
            setContactError('Please enter a valid email address.');
            isValid = false;
        }

        // Image validation
        if (!image) {
            setImageError('Image is required.');
            isValid = false;
        }

       

        if (!isValid) {
            return; // Stop submission if there are validation errors
        }

        let imageUrl: string | null = null;
        try {
            setLoading(true);
            if (image) {
                imageUrl = await handleImageUpload(image);
            }

            if (!user?.id) {
                setError('User is not authenticated');
                return;
            }

            const newPet: Pet = {
                name,
                age: parseInt(age, 10),
                ageUnit,
                petType,
                petBreed,
                state: selectedState,
                city: selectedCity,
                contact,
                image: imageUrl,
                userId: user.id,  // Ensure userId is not undefined
            };
            const response = await fetch('/api/pets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPet),
            });

            if (response.ok) {
                setFormSubmitted(true);
                setError(null);
                toast.success('Pet posted successfully!', {
                    position: 'bottom-center',
                });
                setTimeout(() => {
                    router.push('/list-a-pet');
                }, 2000);
            } else {
                const errorMessage = await response.text();
                setError(`Failed to post pet: ${errorMessage}`);
                toast.error(`Failed to post pet: ${errorMessage}`, {
                    position: 'bottom-center',
                });
            }
        } catch (err: any) {
            setError(`Failed to post pet: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
            toast.error(`Failed to post pet: ${err instanceof Error ? err.message : 'An unknown error occurred'}`, {
                position: 'bottom-center',
            });
        } finally {
            setLoading(false);
        }
    };
    //part 1 ends here

    //part 2
    return (
        <div className="min-h-screen bg-gray-100 py-6 flex items-center justify-center">
            <Toaster position="top-center" />
            <div className="container max-w-md bg-white shadow-md rounded-lg p-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Post a Pet for Adoption
                </h1>
                {formSubmitted ? (
                    <div className="text-center text-green-600 text-lg mb-6">
                        <BeatLoader color="#36D7B7" size={16} />
                        <p className="mt-2">Your pet has been posted successfully! Redirecting...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="text-center text-red-500 text-sm mb-4">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
                                Pet Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${nameError ? 'border-red-500' : ''}`}
                                placeholder="Enter pet name"
                            />
                            {nameError && <p className="text-red-500 text-xs italic">{nameError}</p>}
                        </div>
                        <div>
                            <label htmlFor="age" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
                                Age
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="number"
                                    id="age"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    className={`shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${ageError ? 'border-red-500' : ''}`}
                                    placeholder="Enter pet age"
                                />
                                <select
                                    value={ageUnit}
                                    onChange={(e) => setAgeUnit(e.target.value)}
                                    className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="weeks">Weeks</option>
                                    <option value="months">Months</option>
                                    <option value="years">Years</option>
                                </select>
                            </div>
                            {ageError && <p className="text-red-500 text-xs italic">{ageError}</p>}
                        </div>
                        <div>
                            <label htmlFor="petType" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>What type of pet?</label>
                            <select id="petType" value={petType} onChange={(e) => setPetType(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow appearance-none">
                                <option value="Dog">Dog</option>
                                <option value="Cat">Cat</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="petBreed" className="block text-sm font-medium text-gray-700" style={{ fontWeight: '500', fontSize: '1rem' }}>Breed of your pet?</label>
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
                            <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
                                State
                            </label>
                            <StateDropdown selectedState={selectedState} onStateChange={handleStateChange} />
                            {stateError && <p className="text-red-500 text-xs italic">{stateError}</p>}
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
                                City
                            </label>
                            <CityDropdown stateId={selectedStateId} selectedCity={selectedCity} onCityChange={setSelectedCity} />
                            {cityError && <p className="text-red-500 text-xs italic">{cityError}</p>}
                        </div>
                        {/* part 2 ends here */}
                        {/* part 3 */}
                        <div>
                            <label htmlFor="contact" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
                                Contact Information
                            </label>
                            <input
                                type="text"
                                id="contact"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${contactError ? 'border-red-500' : ''}`}
                                placeholder="Enter your email address"
                            />
                            {contactError && <p className="text-red-500 text-xs italic">{contactError}</p>}
                        </div>
                        <div>
                            <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2" style={{ fontWeight: '500', fontSize: '1rem' }}>
                                Upload Image
                            </label>
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${imageError ? 'border-red-500' : ''}`}
                            />
                            {imageError && <p className="text-red-500 text-xs italic">{imageError}</p>}
                        </div>
                        <FormReminder message="You'll receive adoption requests via email from potential adopters. Keep an eye on your inbox to review and respond to these requests. Thank you for helping give your pet a new loving home!
"/>
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <BeatLoader color="white" size={8} margin={3} />
                                        <span className="ml-2">Posting...</span>
                                    </div>
                                ) : (
                                    'Post for Adoption'
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PetListingForm;
// part 3 ends here
