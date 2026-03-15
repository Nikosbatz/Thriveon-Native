import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import BottomSheet, {
  BottomSheetScrollView,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { Apple, EggFried, Salad, Soup, Trash2 } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Divider, Text, TouchableRipple, useTheme } from "react-native-paper";
import { useSharedValue } from "react-native-reanimated";
import Toast from "react-native-toast-message";

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
  const snapPoints = useMemo(() => ["98%"], []);
  const paperTheme = useTheme();
  const backdropOpacity = useSharedValue(0);

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
    [todaysFoods],
  );

  async function handleFoodRemoval(food: LoggedFoodType) {
    try {
      await removeFood(food);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message,
        text2: "Please try again later",
      });
    }
  }

  // Custom backdrop component
  // const renderBackdrop = useCallback(
  //   (props: any) => (
  //     <BottomSheetBackdrop
  //       {...props}
  //       appearsOnIndex={0}
  //       disappearsOnIndex={-1}
  //       opacity={0}
  //     />
  //   ),
  //   [],
  // );

  return (
    <BottomSheet
      ref={sheetRef}
      onChange={handleSheetChanges}
      index={-1}
      handleIndicatorStyle={{ backgroundColor: "white" }}
      backgroundStyle={{
        backgroundColor: colors.lvBackground,
        elevation: 10,
        borderColor: "white",
      }}
      enablePanDownToClose
      enableDynamicSizing={false}
      snapPoints={snapPoints}
      // backdropComponent={renderBackdrop}
    >
      <Text
        style={{ textAlign: "center", marginBottom: 10, color: "white" }}
        variant="headlineSmall"
      >
        Logged Foods
      </Text>
      {/*Top Meal Tabs */}
      <View style={styles.mealTabsContainer}>
        {mealTypes.map((mealType, index) => (
          <TouchableRipple
            key={index}
            onPress={() => setselectedMealType(mealType)}
            rippleColor={"rgba(0, 205, 224, 0.52)"}
            borderless
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
      <Divider style={styles.divider} />
      {/* Logged Foods Container */}
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
            // Food card container
            <View
              key={index}
              style={{
                width: "100%",
                backgroundColor: colors.lvGradientCard,
                borderRadius: 15,
                paddingLeft: 14,
                padding: 5,
                borderWidth: 1,
                borderColor: colors.lvPrimary10,
              }}
            >
              {/* Food name and Macros text container */}
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  maxWidth: "75%",
                }}
              >
                <Text
                  variant="headlineSmall"
                  style={{
                    fontSize: 18,
                    color: "white",
                    lineHeight: 23,
                  }}
                >
                  {food.name}
                </Text>
                {food.brands ? (
                  <Text
                    variant="headlineSmall"
                    style={{
                      fontSize: 16,
                      color: "rgb(184, 184, 184)",
                      lineHeight: 20,
                    }}
                  >
                    {food.brands}
                  </Text>
                ) : null}

                <View
                  style={{
                    flexDirection: "row",
                    gap: 7,
                  }}
                >
                  {macrosKeys.map((macro, index) => (
                    <Text key={index} style={{ color: colors.lightGrayText }}>
                      {macro}:{" "}
                      <Text style={{ color: "white", fontSize: 16 }}>
                        {food[macro]}
                      </Text>
                    </Text>
                  ))}
                </View>
              </View>
              <View
                style={{
                  position: "absolute",
                  right: "13%",
                  top: "50%",
                  transform: [{ translateX: "0%" }, { translateY: "-40%" }],
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 18, color: colors.lvPrimary }}
                  variant="labelLarge"
                >
                  {food.calories}
                </Text>
                <Text style={{ fontSize: 17, color: "rgb(130, 130, 130)" }}>
                  kcal
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 5,
                  top: "50%",
                  borderRadius: 5,
                  transform: [{ translateY: "-40%" }],
                  padding: 4,
                }}
                onPress={() => handleFoodRemoval(food)}
              >
                <Trash2 size={26} color={paperTheme.colors.error} />
              </TouchableOpacity>
            </View>
          );
        })}
      </BottomSheetScrollView>
    </BottomSheet>
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
  selectedMealTab: { backgroundColor: colors.lvPrimary, color: "black" },
});
