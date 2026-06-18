import { create } from "zustand";
import { getRecipes } from "../api/requests";
import { Recipe } from "../types";

interface RecipeStore {
  recipesLoading: boolean;
  recipes: Recipe[];
  fetchRecipes: () => Promise<void>;
}

export const useRecipesStore = create<RecipeStore>((set, get) => ({
  recipesLoading: false,
  recipes: [],
  fetchRecipes: async () => {
    try {
      set({ recipesLoading: true });
      const recipes = await getRecipes();
      set({ recipesLoading: false, recipes: recipes });
    } catch (error) {
      throw new Error("Could not fetch recipes");
    }
  },
}));
