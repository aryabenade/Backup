// app/data/statesCities.ts
import statesCitiesDataJson from './countries+states+cities.json';
import { State, City } from '../types';

interface CountryWithStatesAndCities {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  phone_code: string;
  capital: string;
  currency: string;
  states: {
    id: number;
    name: string;
    state_code: string;
    latitude: string;
    longitude: string;
    country_id: number;
    cities: City[];
  }[];
}

const countriesData: CountryWithStatesAndCities[] = statesCitiesDataJson as CountryWithStatesAndCities[];

// Filter for India (iso2: 'IN')
const india = countriesData.find(country => country.iso2 === 'IN');

// Extract Indian states and cities
export const states: State[] = india?.states.map(({ id, name, country_id }) => ({ id, name, country_id })) || [];

export const getCitiesByState = (stateId: number): City[] => {
  const state = india?.states.find(state => state.id === stateId);
  return state ? state.cities : [];
};
