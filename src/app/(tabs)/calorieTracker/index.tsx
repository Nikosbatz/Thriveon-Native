import ActionSelectionBar from "@/src/components/calorieTracker/action tabs/ActionSelectionBar";
import MyFoodsTab from "@/src/components/calorieTracker/action tabs/myFoodsTab/MyFoodsTab";
import SearchTab from "@/src/components/calorieTracker/action tabs/SearchTab";
import FoodOptionsSheet from "@/src/components/calorieTracker/FoodOptionsSheet/FoodOptionsSheet";
import ProfileHeader from "@/src/components/profile/ProfileHeader";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { Food, mealType } from "@/src/types";
import BottomSheet from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowDown, ArrowUp } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Divider, Menu, Text, TouchableRipple } from "react-native-paper";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function CalorieTrackerScreen() {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [selectedMealType, setselectedMealType] =
    useState<mealType>("Breakfast");
  const [selectedActionTabId, setSelectedActionTabId] =
    useState<string>("search");
  const [showMealSelectionMenu, setShowMealSelectionMenu] =
    useState<boolean>(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  const openMenu = () => {
    setShowMealSelectionMenu(true);
  };

  // Re-animated values initialized uniformly
  const searchOpacity = useSharedValue(1);
  const searchTranslateX = useSharedValue(0);
  const myFoodsOpacity = useSharedValue(0);
  const myFoodsTranslateX = useSharedValue(SCREEN_WIDTH); // Starts offscreen right

  const slidingAnimDuration = 250; // Smoother fluid curve length

  useEffect(() => {
    if (selectedActionTabId === "barcodeScanner") return;

    const isActiveSearch = selectedActionTabId === "search";
    const config = {
      duration: slidingAnimDuration,
      easing: Easing.bezier(0.25, 1, 0.5, 1), // Premium ease-out curve
    };

    // --- Search Tab Animation ---
    searchOpacity.value = withTiming(isActiveSearch ? 1 : 0, config);
    searchTranslateX.value = withTiming(
      isActiveSearch ? 0 : -SCREEN_WIDTH,
      config,
    );

    // --- My Foods Tab Animation ---
    myFoodsOpacity.value = withTiming(!isActiveSearch ? 1 : 0, config);
    myFoodsTranslateX.value = withTiming(
      !isActiveSearch ? 0 : SCREEN_WIDTH,
      config,
    );
  }, [selectedActionTabId]);

  const searchStyle = useAnimatedStyle(() => ({
    opacity: searchOpacity.value,
    transform: [{ translateX: searchTranslateX.value }],
  }));

  const myFoodsStyle = useAnimatedStyle(() => ({
    opacity: myFoodsOpacity.value,
    transform: [{ translateX: myFoodsTranslateX.value }],
  }));

  return (
    <LinearGradient
      colors={["#031f3bcc", "#040f20ee", "#010713"]}
      // colors={["#090F1D", "#090F1D", "#090F1D"]}
      locations={[0, 0.4, 0.9]}
      style={[
        styles.mainContainer,
        {
          paddingBottom: mainStyles.mainContainer.paddingBottom + insets.bottom,
        },
      ]}
    >
      <ProfileHeader />

      {/* Menu dropdown block alignment */}
      <View style={styles.menuAnchorWrapper}>
        <Menu
          visible={showMealSelectionMenu}
          onDismiss={() =>
            selectedMealType ? setShowMealSelectionMenu(false) : null
          }
          anchor={
            <TouchableRipple
              borderless
              rippleColor="rgba(255, 255, 255, 0.15)"
              style={styles.rippleBounds}
              onPress={openMenu}
            >
              <View
                style={[
                  styles.dropdownButton,
                  {
                    borderColor: selectedMealType
                      ? mealTypeColors[selectedMealType]
                      : colors.lvPrimary20 || "rgba(255,255,255,0.2)",
                  },
                ]}
              >
                <Text variant="labelLarge" style={styles.dropdownButtonText}>
                  {selectedMealType ? selectedMealType : "Select meal type"}
                </Text>
                {showMealSelectionMenu ? (
                  <ArrowUp size={18} color="white" />
                ) : (
                  <ArrowDown size={18} color="white" />
                )}
              </View>
            </TouchableRipple>
          }
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
                  setShowMealSelectionMenu(false);
                  setselectedMealType(meal);
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

      {/* Action Segment Selector */}
      <ActionSelectionBar
        selectedTabId={selectedActionTabId}
        setSelectedTabId={setSelectedActionTabId}
      />

      {/* Smooth Sliding View Canvas Stack */}
      <View style={styles.tabsCanvasContainer}>
        {/* Search Tab Frame */}
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

        {/* MyFoods Tab Frame */}
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

      <FoodOptionsSheet
        bottomSheetRef={bottomSheetRef}
        food={selectedFood}
        selectedMealType={selectedMealType}
        setSelectedMealType={setselectedMealType}
        snapPoint="86%"
      />
    </LinearGradient>
  );
}

// --- TYPE MAP MOCKS AND STYLING DECLARATIONS ---

const mealTypes: mealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

const mealTypeColors = {
  Breakfast: "rgba(3, 232, 198, 0.73)",
  Lunch: "rgba(3, 114, 232, 0.73)",
  Dinner: "rgba(11, 3, 232, 0.73)",
  Snack: "rgba(1, 200, 87, 0.73)",
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  menuAnchorWrapper: {
    backgroundColor: "transparent",
    alignSelf: "center",
    zIndex: 50,
  },
  rippleBounds: {
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 12,
    borderRadius: 24,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    backgroundColor: "rgba(22, 31, 50, 0.5)",
    width: 170,
  },
  dropdownButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  menuContent: {
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 48,
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
  tabsCanvasContainer: {
    flex: 1,
    position: "relative",
    overflow: "hidden", // Keeps components completely masked when out of viewport bounds
  },
  tabOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
