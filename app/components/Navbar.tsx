// Navbar component in app/components/Navbar.tsx
import React from 'react';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';
import Toggle from './Toggle';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 sticky top-0 p-4  dark:bg-gray-200">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold dark:text-gray-800">
          <Link href="/">
            Pet Care & Adoption
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-white hover:text-gray-400 dark:text-gray-800 dark:hover:text-gray-600">Home</Link>
          <Link href="/adopt-a-pet" className="text-white hover:text-gray-400 dark:text-gray-800 dark:hover:text-gray-600">Adopt a Pet</Link>
          <Link href="/list-a-pet" className="text-white hover:text-gray-400 dark:text-gray-800 dark:hover:text-gray-600">List a Pet</Link>
          <Link href="/services" className="text-white hover:text-gray-400 dark:text-gray-800 dark:hover:text-gray-600">Services</Link>

          <SignedOut>
            <SignInButton >
              <button className="text-white hover:text-gray-400 dark:text-gray-800 dark:hover:text-gray-600">
                <FaUserCircle size={24} />
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          {/* <Toggle /> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;