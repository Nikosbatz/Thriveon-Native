import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import BottomSheet, {
  BottomSheetScrollView,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { Apple, EggFried, Salad, Soup, Trash2 } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Divider, Text, useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";

// const SCREEN_WIDTH = Dimensions.get("window").width;

type LoggedFoodsSheetProps = {
  sheetRef: React.RefObject<BottomSheet | null>;
};
type todaysFoodsByMealType = {
  Breakfast: LoggedFoodType[];
  Lunch: LoggedFoodType[];
  Dinner: LoggedFoodType[];
  Snack: LoggedFoodType[];
};
type macroKey = "fats" | "protein" | "carbs";

const macrosKeys: macroKey[] = ["protein", "carbs", "fats"];

const mealTypes: mealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];
const mealIcons = {
  Breakfast: EggFried,
  Lunch: Soup,
  Dinner: Salad,
  Snack: Apple,
};

export default function LoggedFoodsSheet({ sheetRef }: LoggedFoodsSheetProps) {
  // Hooks
  const [selectedMealType, setselectedMealType] =
    useState<mealType>("Breakfast");
  const [sheetOpen, setSheetOpen] = useState(false);
  const todaysFoods: LoggedFoodType[] = useUserLogsStore((s) => s.todaysFoods);
  const removeFood = useUserLogsStore((s) => s.removeFood);
  const headerHeight = useHeaderHeight();
  const bottomBarHeight = useBottomTabBarHeight();
  const snapPoints = useMemo(() => ["30%", "80%"], []);
  const paperTheme = useTheme();

  //TODO: maybe add todaysFoodsByMeal property to Zustand store (It should be calculated when todaysFoods changes)
  const todaysFoodsByMeal = useMemo<todaysFoodsByMealType>(() => {
    const grouped: todaysFoodsByMealType = {
      Breakfast: [],
      Lunch: [],
      Dinner: [],
      Snack: [],
    };
    for (const food of todaysFoods) {
      grouped[food.mealType]?.push(food);
    }
    return grouped;
  }, [todaysFoods]);

  // Called when Sheet closes or opens
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        setSheetOpen(false);
      } else {
        setSheetOpen(true);
      }
    },
    [todaysFoods]
  );

  async function handleFoodRemoval(food: LoggedFoodType) {
    try {
      await removeFood(food);
    } catch (error: any) {
      Toast.show({
        type: "fail",
        text1: error.message,
        text2: "Please try again later",
      });
    }
  }

  return (
    <View
      style={{
        position: "absolute",
        height: SCREEN_HEIGHT,
        bottom: 0,
        width: SCREEN_WIDTH,
        backgroundColor: "",
      }}
    >
      <BottomSheet
        ref={sheetRef}
        onChange={handleSheetChanges}
        index={-1}
        handleIndicatorStyle={{ backgroundColor: "white" }}
        backgroundStyle={{
          backgroundColor: colors.lvBackground,
          elevation: 10,
        }}
        enablePanDownToClose
        enableDynamicSizing={false}
        snapPoints={snapPoints} // Add this
      >
        <Text
          style={{ textAlign: "center", marginBottom: 10, color: "white" }}
          variant="headlineSmall"
        >
          Logged Foods
        </Text>
        <View style={styles.mealTabsContainer}>
          {mealTypes.map((mealType, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.3}
              onPress={() => setselectedMealType(mealType)}
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
            </TouchableOpacity>
          ))}
        </View>
        <Divider style={styles.divider} />
        <BottomSheetScrollView
          style={{
            width: "100%",
          }}
          contentContainerStyle={{
            gap: 2,
            paddingBottom: 10,
            paddingHorizontal: 5,
            paddingTop: 5,
          }}
        >
          {todaysFoodsByMeal[selectedMealType].map((food, index) => {
            const Icon = mealIcons[selectedMealType];
            return (
              <View
                key={index}
                style={{
                  width: "100%",
                  backgroundColor: colors.lvGradientCard,
                  borderRadius: 15,
                  paddingLeft: 14,
                  padding: 5,
                  borderWidth: 1,
                  borderColor: colors.primary20,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 15,
                  }}
                >
                  {/* <Icon
                    color={colors[selectedMealType]}
                    style={{ backgroundColor: "white", borderRadius: 8 }}
                    size={30}
                  /> */}
                  <View>
                    <Text
                      variant="headlineSmall"
                      style={{ fontSize: 22, color: "white" }}
                    >
                      {food.name}
                    </Text>
                    <View style={{ flexDirection: "row", gap: 7 }}>
                      {macrosKeys.map((macro, index) => (
                        <Text
                          key={index}
                          style={{ color: colors.lightGrayText }}
                        >
                          {macro}:{" "}
                          <Text style={{ color: "white", fontSize: 16 }}>
                            {food[macro]}
                          </Text>
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>
                <Text
                  style={{
                    position: "absolute",
                    right: 55,
                    top: "50%",
                    transform: [{ translateX: "0%" }, { translateY: "-40%" }],
                    fontSize: 19,
                    color: "rgba(219, 132, 26, 1)",
                  }}
                >
                  {food.calories} cal
                </Text>
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    right: 5,
                    top: "50%",
                    borderRadius: 5,
                    transform: [{ translateY: "-40%" }],
                    // backgroundColor: "tra",
                    padding: 4,
                  }}
                  onPress={() => handleFoodRemoval(food)}
                >
                  <Trash2 size={30} color={paperTheme.colors.error} />
                </TouchableOpacity>
              </View>
            );
          })}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 6,
    paddingHorizontal: 10,
    alignItems: "center",
    // height: "100%",
    gap: 15,
  },
  divider: {
    width: SCREEN_WIDTH,
    height: 1,
  },
  mealTabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.lvGradientCard,
    padding: 2,
    marginHorizontal: 20,
    marginBottom: 4,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 2,
  },
  mealTab: {
    fontSize: 15,
    borderWidth: 0,
    borderColor: "gray",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0)",
    color: "white",
  },
  selectedMealTab: { backgroundColor: "white", color: "black" },
});
