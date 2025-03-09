

// import React, { useRef } from 'react';
// import Link from 'next/link';
// import 'tailwindcss/tailwind.css';
// import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
// import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';


// const Sidebar: React.FC = () => {
//   const userButtonRef = useRef<HTMLDivElement>(null);

//   const handleClick = () => {
//     if (userButtonRef.current) {
//       userButtonRef.current.querySelector('button')?.click();
//     }
//   };

//   return (
//     <div className="p-4">
//       <ul className="space-y-0">
//         <li className='text-black flex items-center cursor-pointer border-b hover:text-blue-500 border-gray-300 pb-2' onClick={handleClick}>
//           <SignedOut>
//             <SignInButton>
//               <button className="text-white hover:text-gray-400 dark:text-gray-800 dark:hover:text-gray-600">
//                 <FaUserCircle size={24} />
//               </button>
//             </SignInButton>
//           </SignedOut>
//           <SignedIn>
//             <div className='flex items-center'>
//               <div ref={userButtonRef}>
//                 <UserButton />
//               </div>
//               <span className='ml-2 font-semibold'>My Profile</span>
//             </div>
//           </SignedIn>
//         </li>
//         <li className="border-b border-gray-300 py-2 flex items-center">
//           <FaShoppingCart className="mr-2 text-gray-800" />
//           <Link href="/profile/orders" className="block p-2 text-gray-800 hover:text-blue-500 font-semibold">
//             My Orders
//           </Link>
//         </li>
//         {/* Add more links as needed */}
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;

import React, { useRef } from 'react';
import Link from 'next/link';
import 'tailwindcss/tailwind.css';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { FaUserCircle, FaShoppingCart, FaPaw, FaHeart } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  const userButtonRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (userButtonRef.current) {
      userButtonRef.current.querySelector('button')?.click();
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <ul className="space-y-2">
        <li
          className="flex items-center cursor-pointer border-b border-gray-200 pb-2 text-gray-800 hover:text-orange-500 transition duration-300"
          onClick={handleClick}
        >
          <SignedOut>
            <SignInButton>
              <button className="text-gray-800 hover:text-orange-500 transition duration-300">
                <FaUserCircle size={24} />
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center">
              <div ref={userButtonRef}>
                <UserButton />
              </div>
              <span className="ml-2 font-semibold">My Profile</span>
            </div>
          </SignedIn>
        </li>
        <li className="border-b border-gray-200 py-2 flex items-center">
          <FaShoppingCart className="mr-2 text-orange-500" />
          <Link
            href="/profile/orders"
            className="block p-2 text-gray-800 hover:text-orange-500 font-semibold transition duration-300"
          >
            My Orders
          </Link>
        </li>
        <li className="border-b border-gray-200 py-2 flex items-center">
          <FaPaw className="mr-2 text-orange-500" />
          <Link
            href="/profile/adoption-request"
            className="block p-2 text-gray-800 hover:text-orange-500 font-semibold transition duration-300"
          >
            Adoption Requests
          </Link>
        </li>
        <li className="border-b border-gray-200 py-2 flex items-center">
          <FaHeart className="mr-2 text-orange-500" />
          <Link
            href="/profile/favorites"
            className="block p-2 text-gray-800 hover:text-orange-500 font-semibold transition duration-300"
          >
            Favorites
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;