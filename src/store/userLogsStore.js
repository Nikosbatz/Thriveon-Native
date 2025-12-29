import { create } from "zustand";
import { deleteUserLogsFood, getFoods, postFood } from "../api/requests";

//TODO: define type fo the store (convert the fine to .tsx)
// TODO: User food logs list is not synced across web app and react native because of the case of meal types (e.g "BreakFast instead of Breakfast")

export const useUserLogsStore = create((set, get) => ({
  logsLoading: true,
  foodsLoading: true,
  foods: [],
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
      const todaysFoods = await getFoods("/foods/userlogs");
      set({ todaysFoods });
      get().updateTodayMacros();
      set({ logsLoading: false });
    } catch (error) {
      set({ logsLoading: false });
      //TODO: fix error message (Check backend to seperate cases where logs is empty or could not access DB data )
      throw new Error(
        "Could not fetch user data or there are no user logs for today..."
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
          (food) => food._id !== foodToDelete._id
        ),
      }));
      get().updateTodayMacros();
    } catch (err) {
      throw new Error("Could not delete food...");
    }
  },
  handleAddFood: async (food, gramsInput, mealType) => {
    const calories = Math.round((food.calories / food.grams) * gramsInput);
    const protein = Math.round((food.protein / food.grams) * gramsInput);
    const carbs = Math.round((food.carbs / food.grams) * gramsInput);
    const fats = Math.round((food.fats / food.grams) * gramsInput);

    const foodToUpload = {
      name: food.name,
      calories: calories,
      grams: gramsInput,
      protein: protein,
      carbs: carbs,
      fats: fats,
      mealType: mealType,
    };

    // POST request to upload food
    set({ logsLoading: true });

    try {
      const res = await postFood(foodToUpload, "/foods/userlogs");
      console.log("foods length: ", res.message.length);

      set((state) => ({
        todaysFoods: res.message,
      }));
      get().updateTodayMacros();
      set({ logsLoading: false });
    } catch (err) {
      set({ logsLoading: false });
      throw new Error(err.message);
    }
  },
}));
