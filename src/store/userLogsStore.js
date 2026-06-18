import moment from "moment";
import { create } from "zustand";
import {
  deleteRecipe,
  deleteUserLogsFood,
  getFoods,
  getUserWaterIntake,
  getUserWeightLogs,
  postFood,
  postRecipe,
  postUserWaterIntake,
  postUserWeightLogs,
} from "../api/requests";
import buildLoggedFoodObject from "../utilities/buildLoggedFoodObject";

//TODO: define type for the store (convert the fine to .tsx)

const initialState = {
  selectedDate: moment().format("YYYY-MM-DD"),
  logsLoading: true,
  foodsLoading: true,
  weightLogsLoading: false,
  weightLogs: [],
  waterIntake: 0,
  foods: [],
  myFoods: [],
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
  setSelectedDate: (date) => set({ selectedDate: date }),
  resetLogs: () => {
    set(initialState);
  },

  fetchUserWeightLogs: async () => {
    set({ weightLogsLoading: true });
    try {
      const logs = await getUserWeightLogs(get().selectedDate);
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
      const weightLogs = await postUserWeightLogs(weight, get().selectedDate);
      set({ weightLogs: weightLogs });
      set({ weightLogsLoading: false });
    } catch (error) {
      set({ weightLogsLoading: false });
      throw new Error("Could not post weight...\nPlease try later!");
    }
  },

  getWaterIntake: async () => {
    try {
      const data = await getUserWaterIntake(get().selectedDate);
      set({ waterIntake: data });
    } catch (error) {
      throw new Error(error.message);
    }
  },
  // Optimistic update
  postWaterIntake: async (water) => {
    try {
      set({ waterIntake: water });
      const waterIntake = await postUserWaterIntake(water, get().selectedDate);
    } catch (error) {
      throw new Error(error.message);
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
      const { data, foodHistory, myFoods } = await getFoods(
        "/foods/userlogs",
        get().selectedDate,
      );

      set({
        todaysFoods: data,
        foodHistory: foodHistory,
        myFoods: myFoods ?? [],
      });
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
      await deleteUserLogsFood(foodToDelete, get().selectedDate);
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
    const foodToUpload = buildLoggedFoodObject({
      food,
      quantityInput,
      mealType,
      selectedServingIndex,
    });

    set({ logsLoading: true });
    try {
      const res = await postFood(
        foodToUpload,
        "/foods/userlogs",
        get().selectedDate,
      );

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

  handleLogRecipe: async (recipe, mealType) => {
    try {
      const recipeToUpload = {
        ...recipe,
        foodId: recipe._id,
        calories: recipe.calories,
        protein: recipe.protein,
        carbs: recipe.carbs,
        fats: recipe.fats,
        starred: recipe.starred,
        mealType: mealType,
      };

      delete recipeToUpload._id;
      delete recipeToUpload.__v;

      const res = await postFood(
        recipeToUpload,
        "/foods/userlogs",
        get().selectedDate,
      );

      set({
        todaysFoods: res.message,
      });
      get().updateTodayMacros();
    } catch (err) {
      console.log(err);
    }
  },

  handleCreateMyFood: async (myFood) => {
    set({ logsLoading: true });
    try {
      const myFoods = await postRecipe(myFood);

      set({ myFoods: myFoods });
      set({ logsLoading: false });
    } catch (err) {
      set({ logsLoading: false });
      throw new Error(err.message);
    }
  },

  deleteRecipe: async (recipe) => {
    set({ logsLoading: true });

    try {
      const updatedMyFoods = await deleteRecipe(recipe);
      updatedMyFoods ? set({ myFoods: updatedMyFoods }) : null;
      set({ logsLoading: false });
    } catch (err) {
      set({ logsLoading: false });
      throw new Error(err.message);
    }
  },
}));
