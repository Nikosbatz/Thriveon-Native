import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { mealType, Recipe } from "@/src/types";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SCREEN_HEIGHT } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  ActivityIndicator,
  Divider,
  Menu,
  RadioButton,
  Text,
} from "react-native-paper";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BigAnimatedTick from "../UI/BigAnimatedTick";
import SmallAnimatedTick from "../UI/SmallAnimatedTick";

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

const HEADER_MAX_HEIGHT = SCREEN_HEIGHT * 0.3;
const HEADER_MIN_HEIGHT = 60;

interface RecipeDetailsProps {
  recipe: Recipe;
}

export default function RecipeDetails({ recipe }: RecipeDetailsProps) {
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [recipeLogged, setRecipeLogged] = useState<boolean>(false);
  const [loggingRecipe, setLoggingRecipe] = useState<boolean>(false);
  const [mealTypeMenuAnchor, setMealTypeMenuAnchor] = useState({ x: 0, y: 0 });
  const [selectedMealType, setSelectedMealType] = useState<mealType | null>(
    null,
  );
  const [showMealTypeSelectioMenu, setShowMealTypeSelectioMenu] =
    useState<boolean>(false);
  const addButtonRef = useRef<View>(null);

  const handleLogRecipe = useUserLogsStore((s) => s.handleLogRecipe);

  const minHeaderHeight = HEADER_MIN_HEIGHT + insets.top;
  const scrollDistance = HEADER_MAX_HEIGHT - minHeaderHeight;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const animatedHeaderStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, scrollDistance],
      [HEADER_MAX_HEIGHT, minHeaderHeight],
      Extrapolation.CLAMP,
    );
    return { height };
  });

  const animatedImageStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, scrollDistance * 0.6, scrollDistance],
      [1, 0.3, 0],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  const animatedTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [scrollDistance * 0.7, scrollDistance],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  const onBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/discover");
    }
  };

  const handleRecipeLogPress = async (selectedMealType?: mealType) => {
    // if mealType === null then prompt user to select a mealtype
    if (!selectedMealType) {
      addButtonRef.current?.measure((fx, fy, width, height, px, py) => {
        setMealTypeMenuAnchor({ x: px, y: py + height });
        setShowMealTypeSelectioMenu(true);
      });
      return;
    }
    setLoggingRecipe(true);
    try {
      await handleLogRecipe(recipe, selectedMealType);

      setRecipeLogged(true);
      // Revert foodLogged back to false after 500ms
      setTimeout(() => {
        setRecipeLogged(false);
        setSelectedMealType(null);
      }, 1500);
    } catch (error) {
      console.log(error);
    } finally {
      setLoggingRecipe(false);
    }
  };

  const toggleStep = (index: number) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter((i) => i !== index));
    } else {
      setCompletedSteps([...completedSteps, index]);
    }
  };

  return (
    <View style={styles.container}>
      {/* ANIMATED HEADER */}
      <Animated.View style={[styles.imageContainer, animatedHeaderStyle]}>
        <Animated.Image
          source={{
            uri: recipe.imageLink,
          }}
          style={[styles.recipeImage, animatedImageStyle]}
          resizeMode="cover"
        />

        <Animated.View style={[styles.imageOverlayInfo, animatedImageStyle]}>
          {recipe.time && (
            <View style={styles.badge}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color={COLORS.cyan}
              />
              <Text style={styles.badgeText}>{recipe.time} mins</Text>
            </View>
          )}
          {recipe.protein >= 35 && (
            <View style={[styles.badge, { borderColor: colors["protein"] }]}>
              <Text style={[styles.badgeText, { color: colors["protein"] }]}>
                High Protein 💪
              </Text>
            </View>
          )}
        </Animated.View>
      </Animated.View>

      {/* STICKY TOP ACTION ROW */}
      <View
        style={[
          styles.topActions,
          { paddingTop: insets.top + 5, height: minHeaderHeight },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.iconButton}
          onPress={onBackPress}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Animated.View
          style={[styles.headerTitleContainer, animatedTitleStyle]}
        >
          <Text numberOfLines={1} style={styles.headerTitle}>
            {recipe.name}
          </Text>
        </Animated.View>

        {recipeLogged ? (
          <SmallAnimatedTick size={40} />
        ) : (
          <TouchableOpacity
            ref={addButtonRef}
            style={[styles.iconButton, styles.logButtonAction]}
            onPress={() => handleRecipeLogPress()}
          >
            {loggingRecipe ? (
              <ActivityIndicator size={24} color={colors.lvSecondary} />
            ) : (
              <Ionicons name="add" size={24} color={COLORS.bg} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* SCROLLABLE DETAILS CONTENT */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: HEADER_MAX_HEIGHT + 15,
            paddingBottom:
              mainStyles.mainContainer.paddingBottom + insets.bottom + 10,
          },
        ]}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Text style={styles.title}>{recipe.name}</Text>
        <Text style={styles.description}>
          Fuel your body with this nutritious, macro-friendly meal designed to
          keep your health goals on track.
        </Text>

        {/* MACROS ROW */}
        <View style={styles.macrosContainer}>
          <View style={styles.macroBox}>
            <Text style={[styles.macroValue, { color: COLORS.orange }]}>
              {recipe.calories}
            </Text>
            <Text style={styles.macroLabel}>Calories</Text>
          </View>
          <View style={styles.macroBox}>
            <Text style={[styles.macroValue, { color: colors["protein"] }]}>
              {recipe.protein}g
            </Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          <View style={styles.macroBox}>
            <Text style={[styles.macroValue, { color: colors["carbs"] }]}>
              {recipe.carbs}g
            </Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
          <View style={styles.macroBox}>
            <Text style={[styles.macroValue, { color: colors["fats"] }]}>
              {recipe.fats || 0}g
            </Text>
            <Text style={styles.macroLabel}>Fats</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* INGREDIENTS SECTION */}
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {recipe.ingredients.map((ingredient, index) => (
          <View key={index} style={styles.ingredientRow}>
            <View style={styles.bulletPoint} />
            <Text style={styles.ingredientText}>{ingredient}</Text>
          </View>
        ))}

        <View style={styles.divider} />

        {/* INSTRUCTIONS / STEPS SECTION */}
        <Text style={styles.sectionTitle}>Preparation</Text>
        {recipe.steps && recipe.steps.length > 0 ? (
          <View style={styles.timelineContainer}>
            {recipe.steps.map((step, index) => {
              const isCompleted = completedSteps.includes(index);
              const isNextCompleted = completedSteps.includes(index + 1);
              const isLastItem = index === recipe.steps.length - 1;

              return (
                <View key={index} style={styles.stepWrapper}>
                  {/* Vertical connecting line line logic */}
                  {!isLastItem && (
                    <View
                      style={[
                        styles.verticalLine,
                        isCompleted && isNextCompleted
                          ? styles.verticalLineCompleted // White line if both ends are completed
                          : styles.verticalLineUncompleted, // Faded/muted line otherwise
                      ]}
                    />
                  )}

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.stepRow}
                    onPress={() => toggleStep(index)}
                  >
                    <View style={styles.radioWrapper}>
                      <View style={styles.radioBackgroundCover} />
                      <RadioButton
                        value={String(index)}
                        status={isCompleted ? "checked" : "unchecked"}
                        onPress={() => toggleStep(index)}
                        color={COLORS.cyan}
                        uncheckedColor={COLORS.textMuted}
                      />
                    </View>

                    <Text
                      style={[
                        styles.stepText,
                        isCompleted && styles.stepTextCompleted,
                      ]}
                    >
                      {step}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={styles.emptyText}>
            Mix ingredients thoroughly and prepare according to your macro
            requirements.
          </Text>
        )}
      </Animated.ScrollView>
      <BigAnimatedTick foodName={recipe.name} visible={recipeLogged} />
      <Menu
        visible={showMealTypeSelectioMenu}
        onDismiss={() => setShowMealTypeSelectioMenu(false)}
        anchor={mealTypeMenuAnchor}
        contentStyle={[
          styles.menuContent,
          {
            backgroundColor: colors.lvBackground || "#161F32",
            borderColor: colors.lvPrimary20 || "rgba(255,255,255,0.1)",
          },
        ]}
      >
        {mealTypes.map((meal, index) => (
          <React.Fragment key={meal}>
            <Menu.Item
              onPress={() => {
                setShowMealTypeSelectioMenu(false);
                setSelectedMealType(meal);
                handleRecipeLogPress(meal);
              }}
              titleStyle={styles.menuItemTitle}
              title={meal}
            />
            {index < mealTypes.length - 1 && (
              <Divider
                style={{
                  backgroundColor:
                    colors.lvPrimary10 || "rgba(255,255,255,0.05)",
                  marginHorizontal: 12,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </Menu>
    </View>
  );
}

const mealTypes: mealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.bg,
    zIndex: 1,
    overflow: "hidden",
  },
  recipeImage: {
    width: "100%",
    height: "100%",
  },
  topActions: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  menuContent: {
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 0,
    minWidth: 170,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  menuItemTitle: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  headerTitleContainer: {
    flex: 1,
    marginHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
  },
  iconButton: {
    backgroundColor: "rgba(9, 15, 29, 0.7)",
    padding: 8,
    borderRadius: 50,
  },
  logButtonAction: {
    backgroundColor: COLORS.cyan,
  },
  imageOverlayInfo: {
    position: "absolute",
    bottom: 15,
    left: 20,
    flexDirection: "row",
    gap: 10,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(9, 15, 29, 0.85)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.cyan,
    gap: 4,
  },
  badgeText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: mainStyles.mainContainer.paddingBottom,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  macrosContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  macroBox: {
    alignItems: "center",
    flex: 1,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  macroLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(165, 169, 180, 0.15)",
    marginVertical: 24,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingRight: 10,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.cyan,
    marginRight: 12,
  },
  ingredientText: {
    color: "white",
    fontSize: 15,
    lineHeight: 22,
  },
  /* TIMELINE RELATED STYLES */
  timelineContainer: {
    position: "relative",
    paddingLeft: 4,
  },
  stepWrapper: {
    position: "relative",
  },
  verticalLine: {
    position: "absolute",
    // 16px aligns perfectly down the center of the React Native Paper Radio button
    left: 16,
    top: 32,
    bottom: -12,
    width: 2,
    zIndex: 1,
  },
  verticalLineCompleted: {
    backgroundColor: "#069bb69f",
  },
  verticalLineUncompleted: {
    backgroundColor: "rgba(165, 169, 180, 0.15)",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start", // Changed to flex-start for multi-line instructions
    paddingVertical: 4,
  },
  radioWrapper: {
    marginRight: 12,
    position: "relative",
    zIndex: 2,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  radioBackgroundCover: {
    // Blocks out the timeline line beneath the button circular frame
    position: "absolute",
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.bg,
  },
  stepText: {
    flex: 1,
    color: "white",
    fontSize: 15,
    lineHeight: 22,
    paddingTop: 5, // Vertically aligns text structure seamlessly with the radio height
  },
  stepTextCompleted: {
    color: "rgba(165, 169, 180, 0.4)",
    textDecorationLine: "line-through",
  },
  emptyText: {
    color: COLORS.textMuted,
    fontStyle: "italic",
  },
});
