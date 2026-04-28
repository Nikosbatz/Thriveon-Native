import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { Food, mealType } from "@/src/types";
import { LinearGradient } from "expo-linear-gradient";
import { Apple, LucideIcon, Moon, Sun, Utensils } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GoalTextPair from "../profile/GoalTextPair";
import DiaryFoodCard from "./DiaryFoodCard";

const screenWidth = Dimensions.get("window").width;

export default function Diary() {
  const insets = useSafeAreaInsets();
  const todaysFoods: Food[] = useUserLogsStore((s) => s.todaysFoods);
  const [selectedMealType, setselectedMealType] =
    useState<mealType>("Breakfast");
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const index = mealTypes.indexOf(selectedMealType);
    const newOffset = index * screenWidth;

    Animated.timing(scrollX, {
      toValue: newOffset,
      duration: 200, // Speed of transition
      useNativeDriver: true, // Use hardware acceleration
    }).start();
  }, [selectedMealType]);

  const todaysFoodsByMeal = useMemo<todaysFoodsByMealType>(() => {
    const grouped: todaysFoodsByMealType = {
      Breakfast: [],
      Lunch: [],
      Dinner: [],
      Snack: [],
    };
    for (const food of todaysFoods) {
      grouped[food.mealType ?? "Breakfast"]?.push(food);
    }
    return grouped;
  }, [todaysFoods]);

  return (
    <LinearGradient
      colors={["#06173b", "#06173b", "#020712", "#020712", "#020712"]}
      locations={[0, 0.05, 0.4, 0.5, 1]}
      style={{ flex: 1, paddingTop: insets.top + 10 }}
    >
      <View
        style={{
          flex: 1,
          paddingBottom: mainStyles.mainContainer.paddingBottom,
        }}
      >
        {/* MealType selection buttons */}
        <View style={styles.mealTabsContainer}>
          {mealTypes.map((mealType, index) => (
            <TouchableRipple
              key={index}
              rippleColor={"rgba(0, 234, 255, 0.52)"}
              borderless
              onPress={() => setselectedMealType(mealType)}
              style={{ borderRadius: 10 }}
            >
              <Text
                variant="labelLarge"
                style={[
                  styles.mealTab,
                  selectedMealType === mealType ? styles.selectedMealTab : null,
                ]}
              >
                {mealType}
              </Text>
            </TouchableRipple>
          ))}
        </View>

        <ScrollView
          contentContainerStyle={{ gap: 30 }}
          showsVerticalScrollIndicator={true}
        >
          {/* Nutrients sum values */}
          <View
            style={[
              mainStyles.dashboardCard,
              { marginHorizontal: 10, marginTop: 10 },
            ]}
          >
            <Text
              variant="labelLarge"
              style={{
                color: "rgb(255, 255, 255)",
                fontSize: 20,
                textAlign: "center",
              }}
            >
              {selectedMealType} nutrients
            </Text>
            <View
              style={[
                {
                  justifyContent: "center",
                  gap: 10,
                  flexDirection: "row",
                },
              ]}
            >
              <GoalTextPair
                goalKey={"calories"}
                value={todaysFoodsByMeal[selectedMealType].reduce(
                  (sum, food) => sum + food.calories,
                  0,
                )}
                unit="kcal"
              />
              {macrosKeys.map((macro, index) => (
                <GoalTextPair
                  key={index}
                  goalKey={macro}
                  value={todaysFoodsByMeal[selectedMealType].reduce(
                    (sum, food) => sum + food[macro],
                    0,
                  )}
                  unit={"g"}
                />
              ))}
            </View>
          </View>
          {/* Foods list container */}
          <Animated.View
            style={{
              flexDirection: "row",
              width: "400%",
              marginTop: 0,
              transform: [
                {
                  translateX: scrollX.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -1], // Inverts the direction so it slides left
                  }),
                },
              ],
            }}
          >
            {Object.entries(todaysFoodsByMeal).map(([mealType, foods]) => {
              const IconComponent = mealTypeIcons[mealType as mealType];
              return (
                <View key={mealType} style={{ gap: 3 }}>
                  {foods.length === 0 ? (
                    <View
                      style={{
                        width: screenWidth,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        variant="labelLarge"
                        style={{
                          color: "white",
                          fontSize: 16,
                          width: "80%",
                          textAlign: "center",
                        }}
                      >
                        Your {mealType} foods appear here!
                      </Text>
                    </View>
                  ) : null}
                  {foods.map((food, index) => (
                    <View
                      key={index}
                      style={{
                        // backgroundColor: colors.lvGradientCard,
                        borderRadius: 20,
                        padding: 0,
                        width: screenWidth,
                        alignItems: "center",
                      }}
                    >
                      <DiaryFoodCard food={food} />
                    </View>
                  ))}
                </View>
              );
            })}
          </Animated.View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    gap: 12,
    flex: 1,
    backgroundColor: colors.lvBackground,
    paddingBottom: mainStyles.mainContainer.paddingBottom + 10,
  },
  mealTabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.lvGradientCard,
    padding: 4,
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  mealTab: {
    fontSize: 15,
    borderWidth: 0,
    borderColor: "gray",
    padding: 10,
    color: "white",
    borderRadius: 10,
    backgroundColor: "rgba(178, 22, 22, 0)",
  },
  selectedMealTab: { backgroundColor: colors.lvPrimary, color: "black" },
});

const mealTypes: mealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

const mealTypeIcons: Record<mealType, LucideIcon> = {
  Breakfast: Sun,
  Lunch: Utensils,
  Dinner: Moon,
  Snack: Apple,
};

type todaysFoodsByMealType = {
  Breakfast: Food[];
  Lunch: Food[];
  Dinner: Food[];
  Snack: Food[];
};

type macroKey = "fats" | "protein" | "carbs";

const macrosKeys: macroKey[] = ["protein", "carbs", "fats"];
