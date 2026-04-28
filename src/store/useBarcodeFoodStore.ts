import { create } from "zustand";
import { getBarcodeFood } from "../api/requests";
import { Food } from "../types";

interface BarcodeFoodStoreState {
  food: Food | null;
  loadingFood: boolean;
  code: string;
  fetchFood: (code: string) => void;
}

export const useBarcodeFoodStore = create<BarcodeFoodStoreState>((set) => ({
  food: null,
  loadingFood: false,
  code: "",
  fetchFood: async (code: string) => {
    try {
      set({ loadingFood: true });
      set({ code: code });
      const res = await getBarcodeFood(code);
      set({ food: res, loadingFood: false });
    } catch (error) {
      throw new Error();
    }
  },
}));
