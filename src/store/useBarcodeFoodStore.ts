import { create } from "zustand";
import { getBarcodeFood } from "../api/requests";

interface BarcodeFoodStoreState {
  food: BarcodeFoodType | null;
  loadingFood: boolean;
  code: string;
  fetchFood: (code: string) => void;
}

export const useBarcodeFoodStore = create<BarcodeFoodStoreState>((set) => ({
  food: null,
  loadingFood: false,
  code: "",
  fetchFood: async (code: string) => {
    set({ loadingFood: true });
    set({ code: code });
    const res = await getBarcodeFood(code);
    set({ food: res, loadingFood: false });
  },
}));
