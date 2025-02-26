//app/components/CityDropdown.tsx
'use client';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { getCitiesByState } from '../data/statesCities';

interface Props {
  stateId: number;
  onCityChange: (cityName: string) => void;
  selectedCity: string;
}

const CityDropdown: React.FC<Props> = ({ stateId, onCityChange, selectedCity }) => {
  const [cityOptions, setCityOptions] = useState<{ label: string, value: string }[]>([]);

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
      className={`mt-1`}
      placeholder="Select or search city"
    />
  );
};

export default CityDropdown;
