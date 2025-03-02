// // Navbar component in app/components/Navbar.tsx
// import React from 'react';
// import Link from 'next/link';
// import { FaUserCircle } from 'react-icons/fa';
// import Toggle from './Toggle';
// import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

// const Navbar: React.FC = () => {
//   return (
//     <nav className="bg-gray-800 sticky top-0 p-4  dark:bg-gray-200">
//       <div className="container mx-auto flex justify-between items-center">
//         <div className="text-white text-2xl font-bold dark:text-gray-800">
//           <Link href="/">
//             Pet Care & Adoption
//           </Link>
//         </div>
//         <div className="flex items-center space-x-4">
//           <Link href="/" className="text-white hover:text-gray-400 dark:text-gray-800 dark:hover:text-gray-600">Home</Link>
//           <Link href="/adopt-a-pet" className="text-white hover:text-gray-400 dark:text-gray-800 dark:hover:text-gray-600">Adopt a Pet</Link>
//           <Link href="/list-a-pet" className="text-white hover:text-gray-400 dark:text-gray-800 dark:hover:text-gray-600">List a Pet</Link>
//           <Link href="/services" className="text-white hover:text-gray-400 dark:text-gray-800 dark:hover:text-gray-600">Services</Link>

//           <SignedOut>
//             <SignInButton >
//               <button className="text-white hover:text-gray-400 dark:text-gray-800 dark:hover:text-gray-600">
//                 <FaUserCircle size={24} />
//               </button>
//             </SignInButton>
//           </SignedOut>
//           <SignedIn>
//             <UserButton />
//           </SignedIn>
//           {/* <Toggle /> */}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaBars } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import 'tailwindcss/tailwind.css';
import NotificationDropdown from '../profile/notifications/NotificationDropdown';
import { useUser } from '@clerk/nextjs';

const Navbar: React.FC = () => {
  // const { user, isLoaded } = useUser();
  // const allowedEmail = "benadearya@gmail.com"
  // const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // useEffect(() => {
  //   if (isLoaded) {
  //     const userEmail = user?.primaryEmailAddress?.emailAddress;

  //     if (user && userEmail == allowedEmail) {
  //       // router.replace('/sign-in'); // Prevents back button issues
  //       setIsAuthorized(true);
  //     }
  //     //  else {
  //     // }
  //   }
  // }, [user, isLoaded]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <nav className="bg-gray-800 sticky top-0 p-4 dark:bg-gray-200 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold dark:text-gray-800">
          <Link href="/">
            Pet Hub
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-white hover:text-gray-400 dark:text-gray-800 dark:hover:text-gray-600">Home</Link>
          <Link href="/adopt-a-pet" className="text-white hover:text-gray-400 dark:text-gray-800 dark:hover:text-gray-600">Adopt a Pet</Link>
          <Link href="/list-a-pet" className="text-white hover:text-gray-400 dark:text-gray-800 dark:hover:text-gray-600">List a Pet</Link>
          <Link href="/services" className="text-white hover:text-gray-400 dark:text-gray-800 dark:hover:text-gray-600">Services</Link>
          {/* {
            isAuthorized && <Link href="/groomer" className="text-white hover:text-gray-400 dark:text-gray-800 dark:hover:text-gray-600">Groomer</Link>
          }
          {
            isAuthorized && <Link href="/vet" className="text-white hover:text-gray-400 dark:text-gray-800 dark:hover:text-gray-600">Vet</Link>
          } */}
          <NotificationDropdown />
          <FaBars
            size={24}
            className="cursor-pointer text-white hover:text-gray-400 dark:text-gray-800 dark:hover:text-gray-600"
            onClick={toggleSidebar}
          />
        </div>
        {isSidebarOpen && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg z-50 transition-transform duration-300 ease-in-out transform translate-y-0 sidebar">
            <Sidebar />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
