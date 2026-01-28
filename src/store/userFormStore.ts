import { create } from "zustand";

interface FormData {
  age: number;
  weight: number;
  height: number;
  goal: string;
  gender: string;
  activity: number;
}

interface onBoardingFormState {
  formData: FormData;
  updateForm: (partialData: Partial<FormData>) => void;
}

export const useOnBoardingFormStore = create<onBoardingFormState>((set) => ({
  formData: {
    goal: "",
    age: 0,
    weight: 0,
    height: 0,
    gender: "",
    activity: 0,
  },
  updateForm: (partialData) => {
    set((state) => ({
      formData: {
        ...state.formData,
        ...partialData,
      },
    }));
  },
}));
