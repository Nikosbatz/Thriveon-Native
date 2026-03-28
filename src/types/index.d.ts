interface UserInterface {
  email: string;
  gender: string;
  age: number;
  weight: number;
  height: number;
  goal: string;
  isVerified: boolean;
  onBoardingCompleted: boolean;
  healthGoals: {
    weight: number;
    water: number;
  };
  nutritionGoals: {
    calories: number;
    protein: number;
    fats: number;
    carbs: number;
  };
}

type UserInterfaceKeys =
  | keyof UserInterface
  | keyof UserInterface["healthGoals"]
  | keyof UserInterface["nutritionGoals"];

type MacrosKeys = { protein: number; fats: number; carbs: number };

type mealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

// 1. The raw building block
export interface Portion {
  modifier: string;
  amount: number;
  gramWeight: number;
  label: string;
}

// 2. The shared properties (The Source of Truth)
interface BaseFood {
  name: string;
  calories: number;
  grams: number;
  fats: number;
  carbs: number;
  protein: number;
  portions: Portion[];
  brands?: string;
  code?: string;
}

// 3. The "Unified" App Type
// We make UI-specific fields optional so the compiler knows they *might* be there
export interface Food extends BaseFood {
  _id?: string;
  quantity?: number;
  loggedQuantity?: number;
  selectedServingIndex?: number;
  mealType?: "Breakfast" | "Lunch" | "Dinner" | "Snack";
}

type userActivity = {
  activityType: string;
  duration: number;
  calories: number;
};
