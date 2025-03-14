import React from "react";
import { onlineVetPackages, inPersonVetPackages } from "../vet/data";
import VetCard from './VetCard';

const VetPackages = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Vet Packages and Rates</h1>

      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold mb-4">Online Vet Services</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          {onlineVetPackages.map((pkg, index) => (
            <VetCard
              key={index}
              title={pkg.title}
              price={pkg.price}
              originalPrice={pkg.originalPrice}
              features={pkg.features}
              consultationType="Online Consultation" // Set for online packages
            />
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold mb-4">In-Person Vet Services</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          {inPersonVetPackages.map((pkg, index) => (
            <VetCard
              key={index}
              title={pkg.title}
              price={pkg.price}
              originalPrice={pkg.originalPrice}
              features={pkg.features}
              consultationType="Home Consultation" // Set for in-person packages
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VetPackages;