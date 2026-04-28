import { getSearchFoods } from "@/src/api/requests";
import FoodCard from "@/src/components/calorieTracker/FoodCard";
import FoodOptionsSheet from "@/src/components/calorieTracker/FoodOptionsSheet/FoodOptionsSheet";
import ProfileHeader from "@/src/components/profile/ProfileHeader";
import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { Food, mealType } from "@/src/types";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { Info } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function CalorieTrackerScreen() {
  const [selectedMealType, setselectedMealType] =
    useState<mealType>("Breakfast");
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchEnded, setSearchEnded] = useState<boolean>(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const loggedFoodsSheetRef = useRef<BottomSheet>(null);
  const todaysFoods: Food[] = useUserLogsStore((s) => s.todaysFoods);
  const foodHistory: Food[] = useUserLogsStore((s) => s.foodHistory);
  const router = useRouter();

  useEffect(() => {
    // If text is too short, don't even start the timer
    if (searchInput.length <= 2) return;

    const timer = setTimeout(async () => {
      // Search for foods in the backend, based on user input
      const searchedFoods = await getSearchFoods(searchInput);
      setSearchEnded(true);
      setFilteredFoods(searchedFoods);
    }, 700);
    return () => {
      clearTimeout(timer);
    };
  }, [searchInput]);

  async function handleSearchInputChange(text: string) {
    setSearchInput(text);
    setSearchEnded(false);
  }

  function handleBarcodeScannerPress() {
    router.navigate("/calorieTracker/cameraScreen");
  }

  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const lastContentOffset = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentOffset = event.contentOffset.y;

      // Ignore small jitters or bounce effects at the top
      if (currentOffset <= 0) {
        translateY.value = withTiming(0);
        return;
      }

      if (currentOffset > lastContentOffset.value && currentOffset > 0) {
        // SCROLLING DOWN -> Hide the view
        // translateY.value = withTiming(100, { duration: 100 }); // Adjust -100 to your view's height
        opacity.value = withTiming(0, { duration: 200 });
      } else if (currentOffset < lastContentOffset.value) {
        // SCROLLING UP -> Show the view
        // translateY.value = withTiming(0);
        opacity.value = withTiming(1, { duration: 100 });
      }

      lastContentOffset.value = currentOffset;
    },
  });

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      // transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={[styles.mainContainer]}>
      <ProfileHeader />
      <View>
        <Text
          variant="labelLarge"
          style={{ color: "white", textAlign: "center", fontSize: 16 }}
        >
          Select Meal Type
        </Text>
      </View>
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
      {/* Food Search*/}
      <View style={{ backgroundColor: "" }}>
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
                <MaterialIcons name="search" size={24} color={"white"} />
              )}
            />
          }
          right={
            searchInput !== "" ? (
              <TextInput.Icon
                rippleColor={colors.lvPrimary20}
                onPress={() => setSearchInput("")}
                icon={() => (
                  <Entypo
                    name="circle-with-cross"
                    size={26}
                    color="rgb(255, 103, 103)"
                  />
                )}
              />
            ) : null
          }
          value={searchInput}
          onChangeText={handleSearchInputChange}
          style={{
            fontSize: 17,
            padding: 0,
            height: 45,
            borderWidth: 0,
            backgroundColor: colors.lvBackground,
          }}
          placeholderTextColor={colors.lightWhiteText}
          textColor={"white"}
          theme={{ roundness: 30 }}
          //error={hasEmailError()}
        />
      </View>

      {/* Food History and Search Results */}
      <View
        style={{
          gap: 5,
          borderRadius: 20,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          overflow: "hidden",
          flex: 1,
          marginHorizontal: 0,
          marginBottom: 0,
        }}
      >
        <Text
          variant="headlineSmall"
          style={{
            fontSize: 21,
            paddingLeft: 15,
            alignSelf: "flex-start",
            color: colors.lvPrimaryLight,
          }}
        >
          {searchInput.length > 2 ? "Search Results: " : "History"}
        </Text>
        {/* <Divider /> */}
        {/* Foods List */}
        {!searchEnded && searchInput.length > 2 ? (
          <ActivityIndicator
            style={{ flex: 1, paddingBottom: 150 }}
            size={50}
            color={colors.lvPrimaryLight}
          />
        ) : (
          <Animated.FlatList
            onScroll={scrollHandler}
            scrollEventThrottle={128}
            data={
              searchInput.length > 2 ? filteredFoods.slice(0, 35) : foodHistory
            }
            keyExtractor={(item, i) => i.toString()}
            renderItem={({ item, index }) => (
              <FoodCard
                food={item}
                index={index}
                setSelectedFood={setSelectedFood}
                bottomSheetRef={bottomSheetRef}
              />
            )}
            contentContainerStyle={{
              gap: 2,
              paddingBottom: 10,
              paddingHorizontal: 5,
            }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Hint for new users to use search to see the list of foods */}
      {searchInput.length > 2 || foodHistory.length !== 0 ? null : (
        <View
          style={{
            backgroundColor: colors.lvFoodCardBg,
            padding: 15,
            maxWidth: "90%",
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: [{ translateX: "-50%" }],
            borderRadius: 10,
            gap: 10,
            alignItems: "center",
            elevation: 50,
          }}
        >
          <Info size={24} color={colors.lvPrimary}></Info>
          <Text style={{ color: colors.lvPrimaryLight, fontSize: 16 }}>
            Your logged foods history appears here!
          </Text>
          <Text style={{ color: "rgb(214, 214, 214)", textAlign: "center" }}>
            Try searching for a food and a list of relevant foods will appear!
          </Text>
        </View>
      )}

      {/* Open logged foods and scan barcode buttons */}
      {/* <Animated.View
        style={[
          {
            flexDirection: "row",
            position: "absolute",
            bottom: mainStyles.mainContainer.paddingBottom + 15,
            right: "3%",
            transform: [{ translateX: "-10%" }, { translateY: "0%" }],
            backgroundColor: colors.lvPrimary80,
            borderRadius: 10,
          },
          animatedHeaderStyle,
        ]}
      >
        <TouchableRipple
          onPress={() => loggedFoodsSheetRef.current?.snapToIndex(0)}
          rippleColor={"rgba(8, 147, 159, 0.52)"}
          borderless
        >
          <View style={{ alignItems: "center", padding: 5 }}>
            <ListCheck size={30} color={colors.lvBackground}></ListCheck> */}
      {/* Logged Foods Counter Badge */}
      {/* <View
              style={{
                position: "absolute",
                backgroundColor: "rgb(5, 59, 68)",
                borderRadius: "100%",
                right: "10%",
                padding: todaysFoods.length > 0 ? 3 : 0,
              }}
            >
              <Text
                variant="labelLarge"
                style={{
                  textAlign: "center",
                  lineHeight: 15,
                  color: colors.lvPrimaryLight,
                  fontSize: 16,
                  width: todaysFoods.length > 0 ? 17 : 0,
                  height: 17,
                }}
              >
                {todaysFoods.length > 0 ? todaysFoods.length : null}
              </Text>
            </View>
            <Text variant="labelLarge" style={{ fontSize: 12, lineHeight: 10 }}>
              Foods
            </Text>
          </View>
        </TouchableRipple>
        <Divider
          style={{
            width: 0.5,
            height: "100%",
            backgroundColor: colors.lvBackground,
          }}
        />
        <TouchableRipple
          onPress={handleBarcodeScannerPress}
          rippleColor={"rgba(8, 147, 159, 0.52)"}
          borderless
        >
          <View style={{ alignItems: "center", padding: 5 }}>
            <Barcode size={30} color={colors.lvBackground} />
            <Text variant="labelLarge" style={{ fontSize: 12, lineHeight: 10 }}>
              Scan Barcode
            </Text>
          </View>
        </TouchableRipple>
      </Animated.View> */}

      {/* <LoggedFoodsSheet sheetRef={loggedFoodsSheetRef} /> */}
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
    gap: 12,
    flex: 1,
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
  foodCardsContainer: {
    paddingHorizontal: 7,
  },
  foodCardDivider: {
    height: 1,
    backgroundColor: "gray",
  },
});

const mealTypes: mealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];
