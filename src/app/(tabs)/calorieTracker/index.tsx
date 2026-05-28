import ActionSelectionBar from "@/src/components/calorieTracker/action tabs/ActionSelectionBar";
import MyFoodsTab from "@/src/components/calorieTracker/action tabs/myFoodsTab/MyFoodsTab";
import SearchTab from "@/src/components/calorieTracker/action tabs/SearchTab";
import FoodOptionsSheet from "@/src/components/calorieTracker/FoodOptionsSheet/FoodOptionsSheet";
import ProfileHeader from "@/src/components/profile/ProfileHeader";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { Food, mealType } from "@/src/types";
import BottomSheet from "@gorhom/bottom-sheet";
import { ArrowDown, ArrowUp } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Divider, Menu, Text } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CalorieTrackerScreen() {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [selectedMealType, setselectedMealType] = useState<
    mealType | undefined
  >();
  const [selectedActionTabId, setSelectedActionTabId] =
    useState<string>("search");
  const [showMealSelectionMenu, setShowMealSelectionMenu] =
    useState<boolean>(true);
  const openSelectioMenuRef = useRef<View>(null);
  const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 });
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  // UseEffect for initiail meal selection Menu coordinates calculation
  // useEffect(() => {
  //   console.log(openSelectioMenuRef.current !== null);
  //   if (openSelectioMenuRef.current) {
  //     openSelectioMenuRef.current?.measure(
  //       (x, y, width, height, pageX, pageY) => {
  //         setMenuAnchor({ x: x + 13, y: y + 79 });
  //         setShowMealSelectionMenu(true);
  //       },
  //     );
  //   }
  // }, []);

  const openMenu = () => {
    // openSelectioMenuRef.current?.measure(
    //   (x, y, width, height, pageX, pageY) => {
    //     setMenuAnchor({ x: x - 9, y: y + 79 });
    //     setShowMealSelectionMenu(true);
    //   },
    // );
    setShowMealSelectionMenu(true);
  };

  // Create shared opacity values for each tab
  const searchOpacity = useSharedValue(1);
  const myFoodsOpacity = useSharedValue(0);

  // Animate the values whenever the active tab ID changes
  useEffect(() => {
    searchOpacity.value = withTiming(selectedActionTabId === "search" ? 1 : 0, {
      duration: 200,
    });
    myFoodsOpacity.value = withTiming(
      selectedActionTabId === "myFoods" ? 1 : 0,
      { duration: 200 },
    );
  }, [selectedActionTabId]);

  // Create the animated styles
  const searchStyle = useAnimatedStyle(() => ({
    opacity: searchOpacity.value,
  }));

  const myFoodsStyle = useAnimatedStyle(() => ({
    opacity: myFoodsOpacity.value,
  }));

  return (
    <View
      style={[
        styles.mainContainer,
        {
          paddingBottom: mainStyles.mainContainer.paddingBottom + insets.bottom,
        },
      ]}
    >
      <ProfileHeader />

      <View style={{ backgroundColor: "transparent", alignSelf: "center" }}>
        <Menu
          visible={showMealSelectionMenu}
          onDismiss={() =>
            selectedMealType ? setShowMealSelectionMenu(false) : null
          }
          style={{ alignSelf: "center" }}
          anchor={
            <TouchableOpacity
              style={{
                alignItems: "center",
                alignSelf: "center",
                marginBottom: 10,
              }}
              onPress={openMenu}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 7,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: selectedMealType
                    ? mealTypeColors[selectedMealType]
                    : colors.lvPrimary20,
                  width: 150,
                }}
              >
                <Text
                  variant="labelLarge"
                  style={{ color: "white", textAlign: "center", fontSize: 14 }}
                >
                  {selectedMealType ? selectedMealType : "Select meal type"}
                </Text>
                {showMealSelectionMenu ? (
                  <ArrowUp size={22} color={"white"} />
                ) : (
                  <ArrowDown size={22} color={"white"} />
                )}
              </View>
            </TouchableOpacity>
          }
          /* 2. CONTROL THE OFFSET RELATIVE TO THE BUTTON HERE
        Instead of adding hardcoded pixel numbers to a screen-wide 'y' state,
        use 'marginTop' to push the menu down exactly relative to your button.
      */
          contentStyle={{
            backgroundColor: colors.lvBackground,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.lvPrimary20,
            marginTop: 31,
            alignSelf: "center",
          }}
        >
          {mealTypes.map((mealType, index) => (
            <React.Fragment key={index}>
              <Menu.Item
                onPress={() => {
                  setShowMealSelectionMenu(false);
                  setselectedMealType(mealType);
                }}
                titleStyle={{
                  color: "white",
                  fontWeight: "900",
                  fontFamily: "quicksand",
                }}
                title={mealType}
              />
              {index < mealTypes.length - 1 && (
                <Divider
                  style={{
                    backgroundColor: colors.lvPrimary10,
                    marginHorizontal: 10,
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </Menu>
      </View>

      {/* Action selection buttons */}
      <ActionSelectionBar
        selectedTabId={selectedActionTabId}
        setSelectedTabId={setSelectedActionTabId}
      />

      {/* Search tab goes HERE */}
      <View style={{ flex: 1 }}>
        {/* Search Tab Wrapper */}
        <Animated.View
          style={[styles.tabOverlay, searchStyle]}
          pointerEvents={selectedActionTabId === "search" ? "auto" : "none"}
        >
          <SearchTab
            selectedMealType={selectedMealType}
            setSelectedFood={setSelectedFood}
            bottomSheetRef={bottomSheetRef}
          />
        </Animated.View>

        {/* MyFoods Tab Wrapper */}
        <Animated.View
          style={[styles.tabOverlay, myFoodsStyle]}
          pointerEvents={selectedActionTabId === "myFoods" ? "auto" : "none"}
        >
          <MyFoodsTab
            setSelectedFood={setSelectedFood}
            selectedMealType={selectedMealType}
            bottomSheetRef={bottomSheetRef}
          />
        </Animated.View>
      </View>

      {/* <AnotherTab /> */}

      <FoodOptionsSheet
        bottomSheetRef={bottomSheetRef}
        food={selectedFood}
        selectedMealType={selectedMealType}
        setSelectedMealType={setselectedMealType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  mealTabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.lvGradientCard,
    padding: 4,
    marginHorizontal: 20,
    marginVertical: 15,
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
  tabOverlay: {
    ...StyleSheet.absoluteFillObject, // Stacks them directly on top of each other
  },
  selectedMealTab: { backgroundColor: colors.lvPrimary, color: "black" },
  foodCardsContainer: {
    paddingHorizontal: 7,
  },
  foodCardDivider: {
    height: 1,
    backgroundColor: "gray",
  },
});

const mealTypes: mealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

const mealTypeColors = {
  Breakfast: "rgba(3, 232, 198, 0.73)",
  Lunch: "rgba(3, 114, 232, 0.73)",
  Dinner: "rgba(11, 3, 232, 0.73)",
  Snack: "rgba(1, 200, 87, 0.73)",
};
