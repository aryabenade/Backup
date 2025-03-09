// //app/components/StateDropdown.tsx
"use client";
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { states } from '../data/statesCities';

interface Props {
  onStateChange: (stateName: string, stateId: number) => void;
  selectedState: string;
}

const StateDropdown: React.FC<Props> = ({ onStateChange, selectedState }) => {
  const [stateOptions, setStateOptions] = useState<{ label: string; value: string; id: number }[]>([]);

  useEffect(() => {
    setStateOptions(states.map(state => ({ label: state.name, value: state.name, id: state.id })));
  }, []);

  return (
    <Select
      id="state"
      value={stateOptions.find(option => option.value === selectedState)}
      options={stateOptions}
      onChange={(option) => onStateChange(option ? option.value : '', option ? option.id : 0)}
      className="mt-1"
      placeholder="Select or search state"
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

export default StateDropdown;