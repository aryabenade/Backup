import React from 'react';
import Link from 'next/link';

const AdminNavbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 sticky top-0 p-4 dark:bg-gray-200">
      <div className="container mx-auto flex justify-center items-center">
        <div className="text-white text-center text-2xl font-bold dark:text-gray-800">
          <Link href="/admin">
            Admin Dashboard
          </Link>
        </div>
        {/* <div className="flex items-center space-x-4">
          <Link href="/admin/petlist" className="text-white hover:text-gray-400 dark:text-gray-800 dark:hover:text-gray-600">All Pets</Link>
          <Link href="/admin/grooming" className="text-white hover:text-gray-400 dark:text-gray-800 dark:hover:text-gray-600">Grooming</Link>
          <Link href="/admin/vet" className="text-white hover:text-gray-400 dark:text-gray-800 dark:hover:text-gray-600">Vet</Link>
        </div> */}
      </div>
    </nav>
  );
};

export default AdminNavbar;
