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

type FoodType = {
  name: string;
  calories: number;
  grams: number;
  fats: number;
  carbs: number;
  protein: number;
  quantity?: number;
};

type LoggedFoodType = FoodType & {
  _id: string;
  quantity: number;
  mealType: mealType;
};

type BarcodeFoodType = FoodType & {
  brands: string;
  [key: string]: unknown;
};

type userActivity = {
  activityType: string;
  duration: number;
  calories: number;
};
