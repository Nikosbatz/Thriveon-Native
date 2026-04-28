import { create } from "zustand";
import {
  deleteUserLogsFood,
  getFoods,
  getUserWeightLogs,
  postFood,
  postUserWeightLogs,
} from "../api/requests";

//TODO: define type for the store (convert the fine to .tsx)

const initialState = {
  logsLoading: true,
  foodsLoading: true,
  weightLogsLoading: false,
  weightLogs: [],
  foods: [],
  foodHistory: [],
  todaysFoods: [],
  todaysMacros: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  },
  mealCalories: [
    { name: "Breakfast", value: 0 },
    { name: "Lunch", value: 0 },
    { name: "Dinner", value: 0 },
    { name: "Snacks", value: 0 },
  ],
};

export const useUserLogsStore = create((set, get) => ({
  ...initialState,
  resetLogs: () => {
    set(initialState);
  },

  fetchUserWeightLogs: async () => {
    set({ weightLogsLoading: true });
    try {
      const logs = await getUserWeightLogs();
      set({ weightLogs: logs });
      set({ weightLogsLoading: false });
    } catch (error) {
      set({ weightLogsLoading: false });
      throw new Error(error.message);
    }
  },
  postUserWeight: async (weight) => {
    set({ weightLogsLoading: true });
    try {
      const weightLogs = await postUserWeightLogs(weight);
      set({ weightLogs: weightLogs });
      set({ weightLogsLoading: false });
    } catch (error) {
      set({ weightLogsLoading: false });
      throw new Error("Could not post weight...\nPlease try later!");
    }
  },
  // Fetch all foods
  loadFoods: async () => {
    set({ foodsLoading: true });
    try {
      const foods = await getFoods("/foods");
      set({ foods });
      set({ foodsLoading: false });
    } catch (error) {
      set({ foodsLoading: false });
      throw new Error("Could not communicate with server...");
    }
  },

  // Fetch today's foods
  getTodayFoods: async () => {
    set({ logsLoading: true });
    try {
      const { data, foodHistory } = await getFoods("/foods/userlogs");
      set({ todaysFoods: data, foodHistory: foodHistory });
      get().updateTodayMacros();
      set({ logsLoading: false });
    } catch (error) {
      set({ logsLoading: false });
      //TODO: fix error message (Check backend to seperate cases where logs is empty or could not access DB data )
      throw new Error(
        "Could not fetch user data or there are no user logs for today...",
      );
    }
  },

  // Recalculate macros from todaysFoods
  updateTodayMacros: () => {
    const { todaysFoods } = get();

    const newMacros = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    };

    const newMealCalories = [
      { name: "Breakfast", value: 0 },
      { name: "Lunch", value: 0 },
      { name: "Dinner", value: 0 },
      { name: "Snacks", value: 0 },
    ];

    for (const food of todaysFoods) {
      newMacros.calories += food.calories;
      newMacros.carbs += food.carbs;
      newMacros.fats += food.fats;
      newMacros.protein += food.protein;

      const meal = newMealCalories.find((m) => m.name === food.mealType);
      if (meal) meal.value += food.calories;
    }

    set({
      todaysMacros: newMacros,
      mealCalories: newMealCalories,
    });
  },
  removeFood: async (foodToDelete) => {
    try {
      const res = await deleteUserLogsFood(foodToDelete);
      set((state) => ({
        todaysFoods: state.todaysFoods.filter(
          (food) => food._id !== foodToDelete._id,
        ),
      }));
      get().updateTodayMacros();
    } catch (err) {
      throw new Error("Could not delete food...");
    }
  },
  handleAddFood: async (
    food,
    quantityInput,
    mealType,
    selectedServingIndex,
  ) => {
    const gramWeight =
      food.portions[selectedServingIndex].gramWeight * quantityInput;
    let calories;
    let protein;
    let carbs;
    let fats;

    // grams if by default the food.grams property (100g)
    let grams = food.grams;

    // if food has already been logged calculate the grams based on the logged quantity
    if (food.loggedQuantity) {
      grams =
        food.portions[food.selectedServingIndex].gramWeight *
        food.loggedQuantity;
    }

    calories = Math.floor((food.calories / grams) * gramWeight);
    protein = Math.floor((food.protein / grams) * gramWeight);
    carbs = Math.floor((food.carbs / grams) * gramWeight);
    fats = Math.floor((food.fats / grams) * gramWeight);

    const foodToUpload = {
      ...food,
      foodId: food._id,
      calories: calories,
      loggedQuantity: quantityInput,
      selectedServingIndex: selectedServingIndex,
      protein: protein,
      carbs: carbs,
      fats: fats,
      mealType: mealType,
    };

    delete foodToUpload._id;
    delete foodToUpload.__v;

    set({ logsLoading: true });
    try {
      const res = await postFood(foodToUpload, "/foods/userlogs");

      set((state) => ({
        todaysFoods: res.message,
        foodHistory: res.foodHistory,
      }));
      get().updateTodayMacros();
      set({ logsLoading: false });
    } catch (err) {
      set({ logsLoading: false });
      throw new Error(err.message);
    }
  },
}));
