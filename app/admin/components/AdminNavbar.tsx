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
      </div>
    </nav>
  );
};

export default AdminNavbar;
