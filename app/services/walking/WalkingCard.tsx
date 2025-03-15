//app/services/walking/WalkingCard.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

type WalkingPackageProps = {
  title: string;
  pricePerWalk: string;
  walkDuration: string;
  description: string;
  features: string[];
};

const WalkingCard: React.FC<WalkingPackageProps> = ({
  title,
  pricePerWalk,
  walkDuration,
  description,
  features,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
  };

  return (
    <div className="bg-white border rounded-2xl shadow-lg p-6 flex flex-col justify-between w-full max-w-sm">
      <div>
        <h2 className="text-lg font-semibold text-center mb-4">{title}</h2>
        <p className="text-center text-sm text-gray-600 mb-4">{description}</p>
        <div className="text-center mb-4">
          <span className="text-2xl font-bold text-gray-800">{pricePerWalk}</span>
          <span className="text-sm text-gray-600">/walk</span>
        </div>
        <ul className="text-sm text-gray-700 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className="text-green-500 mr-2">✔</span> {feature}
            </li>
          ))}
        </ul>
      </div>
      <Link href={`/services/walking/form?title=${encodeURIComponent(title)}`} passHref>
        <button
          className={`mt-6 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleClick}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Book Walks"}
        </button>
      </Link>
    </div>
  );
};

export default WalkingCard;