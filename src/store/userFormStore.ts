import { create } from "zustand";

interface FormData {
  age?: string;
  weight?: string;
  height?: string;
  goal?: number;
  gender?: string;
  activity?: string;
}

interface onBoardingFormState {
  formData: FormData;
  updateForm: (partialData: FormData) => void;
}

export const useOnBoardingFormStore = create<onBoardingFormState>((set) => ({
  formData: {
    goal: -1,
    age: "",
    weight: "",
    height: "",
    gender: "",
    activity: "",
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
