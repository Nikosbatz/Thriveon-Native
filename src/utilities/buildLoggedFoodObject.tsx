import { Food, mealType } from "../types";

type Parameters = {
  food: Food;
  quantityInput: string;
  mealType: mealType;
  selectedServingIndex: number;
};

export default function buildLoggedFoodObject({
  food,
  quantityInput,
  mealType,
  selectedServingIndex,
}: Parameters) {
  const gramWeight =
    food.portions[selectedServingIndex].gramWeight * Number(quantityInput);
  let calories;
  let protein;
  let carbs;
  let fats;

  // grams if by default the food.grams property (100g)
  let grams = food.grams;

  // if food has already been logged calculate the grams based on the logged quantity
  if (
    food.loggedQuantity !== undefined &&
    food.selectedServingIndex !== undefined
  ) {
    grams =
      food.portions[food.selectedServingIndex].gramWeight * food.loggedQuantity;
  }

  calories = Math.floor((food.calories / grams) * gramWeight);
  protein = Math.floor((food.protein / grams) * gramWeight);
  carbs = Math.floor((food.carbs / grams) * gramWeight);
  fats = Math.floor((food.fats / grams) * gramWeight);

  const foodToUpload = {
    ...food,
    foodId: food._id,
    calories: calories,
    loggedQuantity: Number(quantityInput),
    selectedServingIndex: selectedServingIndex,
    protein: protein,
    carbs: carbs,
    fats: fats,
    starred: food.starred,
    mealType: mealType,
  };

  delete foodToUpload._id;
  delete foodToUpload.__v;

  return foodToUpload;
}
