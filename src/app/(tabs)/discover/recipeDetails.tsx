import RecipeDetails from "@/src/components/Recipes/RecipeDetails";
import { useRecipesStore } from "@/src/store/useRecipesStore";
import { useLocalSearchParams } from "expo-router";

export default function RecipeDetailsRoute() {
  const recipes = useRecipesStore((s) => s.recipes);
  const { id } = useLocalSearchParams<{ id: string }>();

  // Find the specific recipe (using item name or an id property if your Recipe type has it)
  // Assuming name or map index matches your unique key requirements:
  const recipe = recipes.find((r) => r.name === id);

  if (!recipe) return null;

  return <RecipeDetails recipe={recipe} />;
}
