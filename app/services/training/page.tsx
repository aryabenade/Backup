//app/services/training/page.tsx
import React from "react";
import { dogTrainingPackages, catTrainingPackages } from "./data";
import TrainingCard from "@/app/services/training/TrainingCard"; // Import the new component

const TrainingPackages = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">
        Dog Training Packages
      </h1>
      <div className="flex justify-center gap-6 flex-wrap">
        {dogTrainingPackages.map((pkg, index) => (
         <TrainingCard
         key={index}
         title={pkg.title}
         price={pkg.price}
         originalPrice={pkg.originalPrice}
         sessionsPerWeek={pkg.sessionsPerWeek}
         duration={pkg.duration}
         features={pkg.features}
       />
        ))}
      </div>
      <h1 className="text-3xl font-bold text-center mb-10 mt-10">
        Cat Training Packages
      </h1>
      <div className="flex justify-center gap-6 flex-wrap">
        {catTrainingPackages.map((pkg, index) => (
          <TrainingCard
          key={index}
          title={pkg.title}
          price={pkg.price}
          originalPrice={pkg.originalPrice}
          sessionsPerWeek={pkg.sessionsPerWeek}
          duration={pkg.duration}
          features={pkg.features}
        />
        ))}
      </div>
    </div>
  );
};

export default TrainingPackages;