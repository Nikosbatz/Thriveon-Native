import { colors } from "@/src/theme/colors";
import { MacroKeys, Recipe } from "@/src/types";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { Clock, Flame } from "lucide-react-native";
import { Image, StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";

type Props = {
  recipe: Recipe;
  visible: boolean;
};
export default function RecipeCard({ recipe, visible }: Props) {
  const handleSelectRecipe = () => {
    // Encodes name string safely for URLs (e.g., "High Protein Egg Salad")
    router.push({
      pathname: "/(tabs)/discover/recipeDetails",
      params: { id: recipe.name },
    });
  };

  return (
    <TouchableRipple
      borderless
      rippleColor={"rgba(171, 170, 170, 0.33)"}
      onPress={handleSelectRecipe}
      style={[styles.recipeCard, { display: visible ? "flex" : "none" }]}
    >
      <View>
        {/* Recipe Cover Image Mock */}
        <View style={styles.imagePlaceholder}>
          {/* Replace source with real URI when fetching data */}
          <Image
            resizeMode="cover"
            source={{
              uri: recipe.imageLink,
            }}
            style={styles.cardImage}
          />
          {/* Floating Energy Badge */}
          <View style={styles.floatingBadge}>
            <Flame color={COLORS.orange} size={14} fill={COLORS.orange} />
            <Text style={styles.badgeText}>{recipe.calories}kcal</Text>
          </View>
        </View>

        {/* Details & Macros Block */}
        <View style={styles.cardDetails}>
          <View style={styles.titleRow}>
            <Text style={styles.recipeName}>{recipe.name}</Text>
            {/* <TouchableOpacity style={styles.addMacroButton}>
              <Plus color="#FFFFFF" size={18} strokeWidth={3} />
            </TouchableOpacity> */}
          </View>

          <View style={styles.timeRow}>
            <Clock color={COLORS.textMuted} size={14} />
            <Text style={styles.timeText}>{recipe.time} min</Text>
          </View>

          {/* Macro bars */}
          <View style={styles.macroRow}>
            {macroKeys.map((macro) => (
              <View key={macro} style={styles.macroColumn}>
                <Text style={styles.macroLabel}>{macro.toUpperCase()}</Text>
                <Text style={styles.macroValue}>{recipe[macro]}</Text>
                <View
                  style={[styles.miniBar, { backgroundColor: colors[macro] }]}
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
}

const macroKeys: MacroKeys[] = ["protein", "carbs", "fats"];

// Explicit UI Color palette extracted from your screenshot
const COLORS = {
  bg: "#090F1D", // Deep dark navy background
  card: "#161F32", // Muted dark blue for widgets/cards
  textPrimary: "#FFFFFF",
  textMuted: "#A5A9B4", // Light gray used for sub-labels
  cyan: "#00E5FF", // Protein & Highlight accent
  blue: "#007FFF", // Fats accent
  orange: "#FF6B35", // Burned/Calories accent
  green: "#00E676", // Carbs accent
};

const styles = StyleSheet.create({
  recipeCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
    width: SCREEN_WIDTH * 0.65,
  },
  imagePlaceholder: {
    height: 150,
    backgroundColor: "#243146",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  floatingBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "rgba(0,0,0,0.65)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  cardDetails: {
    padding: 12,
    width: "100%",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  recipeName: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "bold",
    maxWidth: "80%",
  },
  addMacroButton: {
    backgroundColor: "#00A3FF",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 16,
  },
  timeText: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginLeft: 4,
  },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(165, 169, 180, 0.1)",
    paddingTop: 14,
  },
  macroColumn: {
    flex: 1,
  },
  macroLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  macroValue: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 2,
  },
  miniBar: {
    height: 4,
    width: "75%",
    borderRadius: 2,
    marginTop: 6,
  },
});
