//app/components/StateDropdown.tsx

'use client';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { states } from '../data/statesCities';

interface Props {
  onStateChange: (stateName: string, stateId: number) => void;
  selectedState: string;
}

const StateDropdown: React.FC<Props> = ({ onStateChange, selectedState }) => {
  const [stateOptions, setStateOptions] = useState<{ label: string, value: string, id: number }[]>([]);

  useEffect(() => {
    setStateOptions(states.map(state => ({ label: state.name, value: state.name, id: state.id })));
  }, []);

  return (
    <Select
      id="state"
      value={stateOptions.find(option => option.value === selectedState)}
      options={stateOptions}
      onChange={(option) => onStateChange(option ? option.value : '', option ? option.id : 0)}
      className={`mt-1`}
      placeholder="Select or search state"
    />
  );
};

export default StateDropdown;
