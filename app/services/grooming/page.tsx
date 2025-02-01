// app/services/grooming/page.tsx
import React from "react";
import {dogPackages, catPackages} from "./data";
import GroomingCard from '../../components/GroomingCard';

const GroomingPackages = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">
        Dog Grooming Packages
      </h1>
      <div className="flex justify-center gap-6 flex-wrap">
        {dogPackages.map((pkg, index) => (
          <GroomingCard
            key={index}
            title={pkg.title}
            price={pkg.price}
            originalPrice={pkg.originalPrice}
            features={pkg.features}
          />
        ))}
      </div>
      <h1 className="text-3xl font-bold text-center mb-10 mt-10">
        Cat Grooming Packages
      </h1>
      <div className="flex justify-center gap-6 flex-wrap">
        {catPackages.map((pkg, index) => (
          <GroomingCard
            key={index}
            title={pkg.title}
            price={pkg.price}
            originalPrice={pkg.originalPrice}
            features={pkg.features}
          />
        ))}
      </div>
    </div>
  );
};

export default GroomingPackages;
