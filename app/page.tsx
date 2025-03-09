// // //app/page.tsx
// // "use client";
// // import React, { useEffect } from 'react';
// // import Navbar from './components/Navbar';

// // const Home: React.FC = () => {

// //   // useEffect(()=>{
// //   //   Notification.requestPermission()
// //   // },[])
// //   // setTimeout(() => {

// //   //   const notification = new Notification("hello")
// //   // }, 1000);
// //   return (
// //     <div>
// //         <Navbar />
// //       <div className="container mx-auto p-4 min-h-screen">
// //         <h1 className="text-4xl font-bold text-center mt-10">
// //           Welcome to Pet Care and Adoption Platform
// //         </h1>
// //         <p className="text-center mt-4 text-lg">
// //           Find your perfect pet or rehome your beloved companion. We also offer grooming and vet consultation services.
// //         </p>
// //         <div className="flex justify-center mt-8">
// //           <a
// //             href="/sign-in"
// //             className="bg-blue-500 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-600"
// //           >
// //             Get Started
// //           </a>
// //         </div>
// //       </div>
// //     </div>

// //   );
// // };

// // export default Home;

// "use client";
// import React from 'react';
// import Navbar from './components/Navbar';
// import { FaPaw, FaHome, FaBone } from 'react-icons/fa'; // Cartoon-style icons

// const Home: React.FC = () => {
//   return (
//     <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
//       <Navbar />
//       <div className="container mx-auto px-4 py-12">
//         {/* Hero Section */}
//         <section className="flex flex-col items-center justify-center text-center mt-16">
//           <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 dark:text-white leading-tight">
//             Welcome to <span className="text-blue-600 dark:text-blue-400">Pet Hub</span>
//           </h1>
//           <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
//             Discover your perfect pet, rehome a companion, or book grooming, vet, and training services with ease.
//           </p>
//           <div className="mt-8 space-x-4">
//             <a
//               href="/sign-in"
//               className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-blue-700 transition duration-300"
//             >
//               Get Started
//             </a>
//             <a
//               href="/adopt-a-pet"
//               className="inline-block bg-transparent border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-600 hover:text-white transition duration-300"
//             >
//               Explore Pets
//             </a>
//           </div>
//         </section>

//         {/* Main Section with Cartoon Icons */}
//         <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
//           <a
//             href="/adopt-a-pet"
//             className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition flex items-center space-x-4 hover:bg-blue-50 dark:hover:bg-blue-900"
//           >
//             <FaPaw className="text-blue-600 dark:text-blue-400 text-4xl" />
//             <div>
//               <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Adopt a Pet</h3>
//               <p className="mt-2 text-gray-600 dark:text-gray-300">Find a furry friend to bring home today.</p>
//             </div>
//           </a>
//           <a
//             href="/list-a-pet"
//             className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition flex items-center space-x-4 hover:bg-blue-50 dark:hover:bg-blue-900"
//           >
//             <FaHome className="text-blue-600 dark:text-blue-400 text-4xl" />
//             <div>
//               <h3 className="text-xl font-semibold text-gray-800 dark:text-white">List a Pet</h3>
//               <p className="mt-2 text-gray-600 dark:text-gray-300">Rehome your pet with a loving family.</p>
//             </div>
//           </a>
//           <a
//             href="/services"
//             className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition flex items-center space-x-4 hover:bg-blue-50 dark:hover:bg-blue-900"
//           >
//             <FaBone className="text-blue-600 dark:text-blue-400 text-4xl" />
//             <div>
//               <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Pet Services</h3>
//               <p className="mt-2 text-gray-600 dark:text-gray-300">Grooming, vet care, and training at your fingertips.</p>
//             </div>
//           </a>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default Home;

"use client";
import React from 'react';
import Navbar from './components/Navbar';
import { FaPaw, FaHome, FaBone } from 'react-icons/fa'; // Cartoon-style icons

const Home: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4 min-h-screen">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center mt-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 leading-tight">
            Welcome to <span className="text-orange-500">Pet Hub</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl">
            Discover your perfect pet, rehome a companion, or book grooming, vet, and training services with ease.
          </p>
          <div className="mt-8 space-x-4">
            <a
              href="/sign-in"
              className="inline-block bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-orange-600 transition duration-300"
            >
              Get Started
            </a>
            <a
              href="/adopt-a-pet"
              className="inline-block bg-transparent border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-500 hover:text-white transition duration-300"
            >
              Explore Pets
            </a>
          </div>
        </section>

        {/* Main Section with Cartoon Icons */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/adopt-a-pet"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex items-center space-x-4 hover:bg-orange-50"
          >
            <FaPaw className="text-orange-500 text-4xl" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Adopt a Pet</h3>
              <p className="mt-2 text-gray-600">Find a furry friend to bring home today.</p>
            </div>
          </a>
          <a
            href="/list-a-pet"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex items-center space-x-4 hover:bg-orange-50"
          >
            <FaHome className="text-orange-500 text-4xl" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">List a Pet</h3>
              <p className="mt-2 text-gray-600">Rehome your pet with a loving family.</p>
            </div>
          </a>
          <a
            href="/services"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex items-center space-x-4 hover:bg-orange-50"
          >
            <FaBone className="text-orange-500 text-4xl" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Pet Services</h3>
              <p className="mt-2 text-gray-600">Grooming, vet care, and training at your fingertips.</p>
            </div>
          </a>
        </section>
      </div>
    </div>
  );
};

export default Home;