interface UserInterface {
  email: string;
  gender: string;
  age: number;
  weight: number;
  height: number;
  goal: string;
  isVerified: boolean;
  onBoardingCompleted: boolean;
  autoLoginEnabled: boolean;
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

type MacrosKeysTypes = { protein: number; fats: number; carbs: number };

type MacroKeys = "fats" | "protein" | "carbs";

type mealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

export interface Portion {
  modifier: string;
  amount: number;
  gramWeight: number;
  label: string;
}

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
  starred: boolean;
}

export interface Food extends BaseFood {
  _id?: string;
  __v?: number;
  quantity?: number;
  loggedQuantity?: number;
  selectedServingIndex?: number;
  mealType?: "Breakfast" | "Lunch" | "Dinner" | "Snack";
}

export interface MyFood extends Food {
  ingredients: Food[];
}

export interface Recipe extends Food {
  imageLink?: string;
  description: string;
  steps: string[];
  ingredients: string[];
  time: number;
}

type userActivity = {
  activityType: string;
  duration: number;
  calories: number;
};
