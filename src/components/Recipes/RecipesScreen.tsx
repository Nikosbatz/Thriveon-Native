import { useRecipesStore } from "@/src/store/useRecipesStore";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { Recipe } from "@/src/types";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RecipeCard from "./RecipeCard";
import RecipesSkeleton from "./RecipesScreenSkeleton";

export default function RecipesScreen() {
  const [searchInput, setSearchInput] = useState("");
  const [activeCategoryChip, setActiveCategoryChip] = useState(
    CATEGORIES_CHIPS[0],
  );
  const insets = useSafeAreaInsets();
  const fetchRecipes = useRecipesStore((s) => s.fetchRecipes);
  const recipes = useRecipesStore((s) => s.recipes);
  const recipesLoading = useRecipesStore((s) => s.recipesLoading);
  // const [filteredRecipes, setFilteredRecipes] = useState<Recipe[] | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await fetchRecipes();
      } catch (error: any) {
        alert(error.message);
      }
    };
    bootstrap();
  }, []);

  const filteredRecipes = useMemo(() => {
    if (!recipes) return [];
    return recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(searchInput.toLowerCase()),
    );
  }, [recipes, searchInput]);
  function handleCategoryChipOnPress(category: CategoryChip) {
    setActiveCategoryChip(category);
  }

  function handleSearchInputChange(text: string) {
    setSearchInput(text);
  }

  if (recipes.length === 0) {
    return <RecipesSkeleton />;
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      {/* Scrollable Content Container */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollPadding,
          {
            paddingBottom:
              mainStyles.mainContainer.paddingBottom + insets.bottom,
          },
        ]}
      >
        {/* HEADER SECTION */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brandTitle}>
              Discover{" "}
              <Text style={{ color: colors.lvPrimary, fontWeight: 700 }}>
                healthy
              </Text>{" "}
              recipes
            </Text>
            <Text style={styles.subHeader}>
              Browse through our collection of healthy recipes
            </Text>
          </View>
        </View>
        {/* Search bar */}
        <TextInput
          mode="outlined"
          activeOutlineColor={colors.lvPrimary50}
          cursorColor="white"
          outlineColor={colors.lvPrimary20}
          keyboardType="default"
          autoCapitalize="none"
          placeholder="Search Food..."
          left={
            <TextInput.Icon
              icon={() => (
                <MaterialIcons name="search" size={21} color={"white"} />
              )}
            />
          }
          right={
            searchInput !== "" ? (
              <TextInput.Icon
                forceTextInputFocus={false}
                rippleColor={colors.lvPrimary20}
                onPress={(e) => {
                  e.preventDefault();
                  handleSearchInputChange("");
                }}
                icon={() => (
                  <Entypo
                    name="circle-with-cross"
                    size={20}
                    color="rgb(255, 103, 103)"
                  />
                )}
              />
            ) : null
          }
          value={searchInput}
          onChangeText={handleSearchInputChange}
          style={{
            fontSize: 16,
            height: 45,
            width: "95%",
            alignSelf: "center",
            marginBottom: 15,
            backgroundColor: colors.lvBackground,
          }}
          placeholderTextColor={colors.lightWhiteText}
          textColor={"white"}
          theme={{ roundness: 30 }}
          //error={hasEmailError()}
        />

        {/* Horizontal categories chips */}
        <ScrollView
          nestedScrollEnabled={true}
          directionalLockEnabled={true}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesStyle}
        >
          {CATEGORIES_CHIPS.map((cat) => {
            const isActive = activeCategoryChip.name === cat.name;

            return (
              <TouchableOpacity
                key={cat.name}
                onPress={() => handleCategoryChipOnPress(cat)}
                style={[
                  styles.chip,
                  isActive && {
                    borderColor: COLORS.cyan,
                    backgroundColor: "#1A2E46",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    isActive && { color: COLORS.cyan, fontWeight: "700" },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {(() => {
          // 1. Initialize a Set to keep track of already displayed recipes
          const displayedRecipeNames = new Set<string>();

          return RECIPE_SECTIONS.map((section) => {
            // 2. First filter by section criteria AND ensure it hasn't been displayed yet
            const currentSectionRecipes = filteredRecipes.filter(
              (recipe) =>
                section.filterFn(recipe) &&
                !displayedRecipeNames.has(recipe.name),
            );

            // 3. Then apply your horizontal category chip filter
            const visibleRecipes = currentSectionRecipes.filter(
              activeCategoryChip.filterFn,
            );

            // 4. Mark these recipes as "displayed" so next sections won't use them
            currentSectionRecipes.forEach((recipe) =>
              displayedRecipeNames.add(recipe.name),
            );

            return (
              <View
                key={section.name}
                style={{
                  marginBottom: 10,
                  display: visibleRecipes.length !== 0 ? "flex" : "none",
                }}
              >
                <Text style={styles.sectionTitle}>{section.name}</Text>

                <ScrollView
                  nestedScrollEnabled={true}
                  directionalLockEnabled={true}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    gap: 20,
                    paddingHorizontal: 10,
                  }}
                >
                  {currentSectionRecipes.map((recipe, index) => (
                    <RecipeCard
                      key={`${recipe.name}-${index}`}
                      recipe={recipe}
                      visible={visibleRecipes.some(
                        (visibleRecipe) => visibleRecipe.name === recipe.name,
                      )}
                    />
                  ))}
                </ScrollView>
              </View>
            );
          });
        })()}
      </ScrollView>
    </View>
  );
}

interface RecipeSection {
  name: string;
  filterFn: (recipe: Recipe) => boolean;
}
export const RECIPE_SECTIONS: RecipeSection[] = [
  {
    name: "High Protein",
    filterFn: (recipe) => recipe.protein >= 35,
  },
  {
    name: "Low Carbs",
    filterFn: (recipe) => recipe.carbs <= 20,
  },
  {
    name: "Low Fats",
    filterFn: (recipe) => recipe.fats <= 10,
  },
  {
    name: "Low Calorie Snacks",
    filterFn: (recipe) => recipe.calories < 300,
  },
];

const COLORS = {
  bg: "#090F1D",
  card: "#161F32",
  textPrimary: "#FFFFFF",
  textMuted: "#A5A9B4",
  cyan: "#00E5FF",
  blue: "#007FFF",
  orange: "#FF6B35",
  green: "#00E676",
};

interface CategoryChip {
  name: string;
  filterFn: (recipe: Recipe) => boolean;
}
export const CATEGORIES_CHIPS: CategoryChip[] = [
  {
    name: "All Meals",
    filterFn: () => true,
  },
  {
    name: "Quick ⏱️",
    filterFn: (recipe) => (recipe.time ? recipe.time < 15 : false),
  },
  {
    name: "Chicken 🍗",
    filterFn: (recipe) =>
      recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes("chicken"),
      ),
  },
  {
    name: "Eggs 🍳",
    filterFn: (recipe) =>
      recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes("egg"),
      ),
  },
  {
    name: "Avocado 🥑",
    filterFn: (recipe) =>
      recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes("avocado"),
      ),
  },
];
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollPadding: {
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    alignSelf: "center",
  },
  brandTitle: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  subHeader: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  iconButton: {
    backgroundColor: COLORS.card,
    padding: 10,
    borderRadius: 14,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  filterButton: {
    paddingLeft: 10,
  },
  categoriesStyle: {
    flexDirection: "row",
    marginBottom: 28,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  chipText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    marginLeft: 25,
  },
});
