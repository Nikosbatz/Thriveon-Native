type User = {};

type mealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

type FoodType = {
  name: string;
  calories: number;
  grams: number;
  fats: number;
  carbs: number;
  protein: number;
};

type LoggedFoodType = FoodType & {
  _id: string;
  mealType: mealType;
};
