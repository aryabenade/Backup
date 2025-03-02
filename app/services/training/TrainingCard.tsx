//app/services/training/TrainingCard.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";

type TrainingPackageProps = {
  title: string;
  price: string;
  originalPrice: string;
  sessionsPerWeek: number;
  duration: string;
  features: string[];
};

const TrainingCard: React.FC<TrainingPackageProps> = ({
  title,
  price,
  originalPrice,
  sessionsPerWeek,
  duration,
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
        <div className="text-center mb-4">
          <span className="text-red-500 line-through mr-2">{originalPrice}</span>
          <span className="text-2xl font-bold text-gray-800">{price}</span>
        </div>
        <div className="text-center mb-4 text-gray-600">
          <p>{sessionsPerWeek} sessions per week</p>
          <p>Duration: {duration}</p>
        </div>
        <ul className="text-sm text-gray-700 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className="text-green-500 mr-2">✔</span> {feature}
            </li>
          ))}
        </ul>
      </div>
      <Link
        href={`/services/training/form?title=${encodeURIComponent(
          title
        )}&price=${encodeURIComponent(price)}&sessionsPerWeek=${sessionsPerWeek}`}
        passHref
      >
        <button
          className={`mt-6 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleClick}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Book Training"}
        </button>
      </Link>
    </div>
  );
};

export default TrainingCard;