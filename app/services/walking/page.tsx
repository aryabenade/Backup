 // app/services/walking/page.tsx

import React from "react";
import { walkingPackages } from "./data";
import WalkingCard from "@/app/services/walking/WalkingCard";

const WalkingPackagesPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Pet Walking Packages</h1>
      <div className="flex justify-center gap-6 flex-wrap">
        {walkingPackages.map((pkg, index) => (
          <WalkingCard
            key={index}
            title={pkg.title}
            pricePerWalk={pkg.pricePerWalk}
            walkDuration={pkg.walkDuration}
            description={pkg.description}
            features={pkg.features}
          />
        ))}
      </div>
    </div>
  );
};

export default WalkingPackagesPage;