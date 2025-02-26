
// Path: app/profile/page.tsx

"use client"
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar'; // Adjust the path as needed
import 'tailwindcss/tailwind.css';

const Profile: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isSidebarOpen && !target.closest('.sidebar')) {
        closeSidebar();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-gray-800 p-4 text-white flex justify-between items-center relative">
        <div className="text-xl font-bold">MyApp</div>
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={toggleSidebar}
        >
          My Profile
        </button>
        {isSidebarOpen && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg z-50 transition-transform duration-300 ease-in-out transform translate-y-0 sidebar">
            <Sidebar />
          </div>
        )}
      </nav>
      
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mt-10">User Profile</h1>
        <p className="text-center mt-4 text-lg">
          Manage your profile, pets, and adoption listings.
        </p>
      </div>
    </div>
  );
};

export default Profile;

