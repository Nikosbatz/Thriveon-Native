import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { Food, mealType } from "@/src/types";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Text, TouchableRipple } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DiaryFoodCard from "./DiaryFoodCard";

const screenWidth = Dimensions.get("window").width;

export default function Diary() {
  const insets = useSafeAreaInsets();
  const todaysFoods: Food[] = useUserLogsStore((s) => s.todaysFoods);
  const [selectedMealType, setselectedMealType] =
    useState<mealType>("Breakfast");
  const [showEmptyPieChart, setShowEmptyPieChart] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const index = mealTypes.indexOf(selectedMealType);
    const newOffset = index * screenWidth;

    Animated.timing(scrollX, {
      toValue: newOffset,
      duration: 200,
      useNativeDriver: true,
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

  // 1. Calculate totals for the selected meal type
  const selectedMealFoods = todaysFoodsByMeal[selectedMealType];

  const totalCalories = useMemo(() => {
    return selectedMealFoods.reduce(
      (sum, food) => sum + (food.calories || 0),
      0,
    );
  }, [selectedMealFoods]);

  const macroTotals = useMemo(() => {
    return {
      protein: selectedMealFoods.reduce(
        (sum, food) => sum + (food.protein || 0),
        0,
      ),
      carbs: selectedMealFoods.reduce(
        (sum, food) => sum + (food.carbs || 0),
        0,
      ),
      fats: selectedMealFoods.reduce((sum, food) => sum + (food.fats || 0), 0),
    };
  }, [selectedMealFoods]);

  // 2. Format data specifically for react-native-chart-kit
  const chartData = useMemo(() => {
    const { protein, carbs, fats } = macroTotals;
    const totalMacros = protein + carbs + fats;

    if (totalMacros === 0) {
      setShowEmptyPieChart(true);
      const emptyLegendColor = "rgba(255, 255, 255, 0.4)";

      return [
        {
          name: "Protein (0g)",
          population: 0,
          color: colors.protein,
          legendFontColor: emptyLegendColor,
          legendFontSize: 14,
        },
        {
          name: "Carbs (0g)",
          population: 0,
          color: colors.carbs,
          legendFontColor: emptyLegendColor,
          legendFontSize: 14,
        },
        {
          name: "Fats (0g)",
          population: 0,
          color: colors.fats,
          legendFontColor: emptyLegendColor,
          legendFontSize: 14,
        },
      ];
    }

    return [
      {
        name: `Protein (${Math.round(protein)}g)`,
        population: protein,
        color: colors.protein,
        legendFontColor: "#FFF",
        legendFontSize: 14,
      },
      {
        name: `Carbs (${Math.round(carbs)}g)`,
        population: carbs,
        color: colors.carbs,
        legendFontColor: "#FFF",
        legendFontSize: 14,
      },
      {
        name: `Fats (${Math.round(fats)}g)`,
        population: fats,
        color: colors.fats,
        legendFontColor: "#FFF",
        legendFontSize: 14,
      },
    ];
  }, [macroTotals]);

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
        <View style={[styles.mealTabsContainer]}>
          {mealTypes.map((mealType, index) => (
            <TouchableRipple
              key={index}
              rippleColor={"rgba(51, 52, 52, 0.77)"}
              borderless
              onPress={() => setselectedMealType(mealType)}
              style={{ borderRadius: 10 }}
            >
              <Text
                variant="labelLarge"
                style={[
                  styles.mealTab,
                  selectedMealType === mealType
                    ? {
                        backgroundColor: colors[selectedMealType],
                        color: "white",
                      }
                    : { color: "white" },
                ]}
              >
                {mealType}
              </Text>
            </TouchableRipple>
          ))}
        </View>

        {/* Dynamic Card Area (Stays static at the top, or shifts data gracefully) */}
        <View
          style={[
            mainStyles.dashboardCard,
            {
              marginHorizontal: 10,
              marginTop: 10,
              paddingVertical: 15,
            },
          ]}
        >
          <Text
            variant="labelLarge"
            style={{
              padding: 7,
              alignSelf: "center",
              borderRadius: 8,
              color: "white",
              fontSize: 20,
              textAlign: "center",
              marginBottom: 5,
            }}
          >
            {selectedMealType} breakdown
          </Text>

          <Text
            variant="labelLarge"
            style={{
              color: colors.calories,
              fontSize: 18,
              textAlign: "center",
              alignItems: "center",
            }}
          >
            {totalCalories} kcal
          </Text>

          {/* Render Pie Chart */}
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PieChart
              data={chartData}
              width={screenWidth - 22}
              height={130}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"-20"}
              center={[40, 0]}
              absolute={false}
            />
          </View>
        </View>

        {/* 
          Foods Sliding Windows Container 
          Taking up remaining structural space.
        */}
        <View style={{ flex: 1, marginTop: 15 }}>
          <Animated.View
            style={{
              flexDirection: "row",
              width: "400%",
              height: "100%",
              transform: [
                {
                  translateX: scrollX.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -1],
                  }),
                },
              ],
            }}
          >
            {Object.entries(todaysFoodsByMeal).map(([mealType, foods]) => {
              return (
                <View
                  key={mealType}
                  style={{ width: screenWidth, height: "100%" }}
                >
                  <ScrollView
                    contentContainerStyle={{
                      paddingBottom: insets.bottom + 10,
                    }}
                    showsVerticalScrollIndicator={false}
                  >
                    {foods.length === 0 ? (
                      <View style={{ alignItems: "center", marginTop: 40 }}>
                        <Text
                          variant="labelLarge"
                          style={{
                            color: "white",
                            fontSize: 16,
                            width: "80%",
                            textAlign: "center",
                            opacity: 0.6,
                          }}
                        >
                          Your {mealType} foods appear here!
                        </Text>
                      </View>
                    ) : (
                      foods.map((food, index) => (
                        <View
                          key={index}
                          style={{
                            borderRadius: 20,
                            alignItems: "center",
                          }}
                        >
                          <DiaryFoodCard food={food} />
                        </View>
                      ))
                    )}
                  </ScrollView>
                </View>
              );
            })}
          </Animated.View>
        </View>
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
    borderRadius: 10,
    backgroundColor: "rgba(178, 22, 22, 0)",
  },

  macroGramsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    borderTopWidth: 0.5,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingTop: 10,
  },
});

const mealTypes: mealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

type todaysFoodsByMealType = {
  Breakfast: Food[];
  Lunch: Food[];
  Dinner: Food[];
  Snack: Food[];
};
