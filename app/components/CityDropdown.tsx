 //app/components/CityDropdown.tsx
"use client";
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { getCitiesByState } from '../data/statesCities';

interface Props {
  stateId: number;
  onCityChange: (cityName: string) => void;
  selectedCity: string;
}

const CityDropdown: React.FC<Props> = ({ stateId, onCityChange, selectedCity }) => {
  const [cityOptions, setCityOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    if (stateId) {
      const cities = getCitiesByState(stateId);
      setCityOptions(cities.map(city => ({ label: city.name, value: city.name })));
    } else {
      setCityOptions([]);
    }
  }, [stateId]);

  return (
    <Select
      id="city"
      value={cityOptions.find(option => option.value === selectedCity)}
      options={cityOptions}
      onChange={(option) => onCityChange(option ? option.value : '')}
      className="mt-1"
      placeholder="Select or search city"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: '#d1d5db', // gray-300
          borderRadius: '0.375rem', // rounded-md
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // shadow-sm
          '&:hover': {
            borderColor: '#f97316', // orange-500
          },
        }),
        menu: (base) => ({
          ...base,
          borderRadius: '0.375rem', // rounded-md
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // shadow-md
        }),
        option: (base, { isFocused }) => ({
          ...base,
          backgroundColor: isFocused ? '#fef3c7' : 'white', // orange-50 on hover
          color: '#374151', // gray-700
          '&:active': {
            backgroundColor: '#fed7aa', // orange-100
          },
        }),
      }}
    />
  );
};

export default CityDropdown;