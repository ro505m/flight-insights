import { create } from "zustand";

export interface FiltersState {
  yearRange: [number, number];
  airlines: string[];
  origins: string[];
  setYearRange: (r: [number, number]) => void;
  setAirlines: (a: string[]) => void;
  setOrigins: (o: string[]) => void;
  reset: () => void;
}

const DEFAULT_YEARS: [number, number] = [2018, 2022];

export const useFilters = create<FiltersState>((set) => ({
  yearRange: DEFAULT_YEARS,
  airlines: [],
  origins: [],
  setYearRange: (yearRange) => set({ yearRange }),
  setAirlines: (airlines) => set({ airlines }),
  setOrigins: (origins) => set({ origins }),
  reset: () => set({ yearRange: DEFAULT_YEARS, airlines: [], origins: [] }),
}));