import FoodCard from "@/src/components/calorieTracker/FoodCard";
import FoodOptionsSheet from "@/src/components/calorieTracker/FoodOptionsSheet";
import LoggedFoodsSheet from "@/src/components/calorieTracker/LoggedFoodsSheet";
import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { ListCheck } from "lucide-react-native";
import { useRef, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Divider, Text, TextInput } from "react-native-paper";

export default function CalorieTrackerScreen() {
  const [selectedMealType, setselectedMealType] = useState<string>("Breakfast");
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedFood, setSelectedFood] = useState<FoodType | null>(null);
  const [filteredFoods, setFilteredFoods] = useState<FoodType[]>([]);
  const tabBarHeight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const loggedFoodsSheetRef = useRef<BottomSheet>(null);
  const foods: FoodType[] = useUserLogsStore((s) => s.foods);

  console.log("JS Memory:", (globalThis.performance as any).memory);

  function handleSearchInputChange(text: string) {
    setSearchInput(text);
    if (text.length > 1) {
      console.log(text);
      setFilteredFoods(foods.filter((food) => food.name.includes(text)));
    }
    if (text.length === 0) {
      setFilteredFoods([]);
    }
  }

  return (
    <View
      style={[
        styles.mainContainer,
        // { paddingBottom: tabBarHeight + headerHeight },
      ]}
    >
      {/* MealType selection buttons */}
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
      {/* Food Search*/}
      <View>
        <TextInput
          mode="outlined"
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
          value={searchInput}
          onChangeText={handleSearchInputChange}
          style={{
            fontSize: 17,
            padding: 0,
            height: 45,
            backgroundColor: colors.lvHeader,
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
          backgroundColor: colors.lvGradientCard,
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
            fontSize: 22,
            paddingLeft: 0,
            alignSelf: "center",
            color: "rgba(250, 242, 255, 1)",
          }}
        >
          {searchInput.length < 2 ? "History" : "Search Results"}
        </Text>
        <Divider />
        <FlatList
          data={searchInput.length < 2 ? foodHistory : filteredFoods}
          keyExtractor={(item, i) => i.toString()}
          renderItem={({ item, index }) => (
            <FoodCard
              food={item}
              index={index}
              setSelectedFood={setSelectedFood}
              bottomSheetRef={bottomSheetRef}
            />
          )}
          contentContainerStyle={{ gap: 2, paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Button
        icon={() => <ListCheck color={colors.lvBackground}></ListCheck>}
        style={{
          position: "absolute",
          bottom: 5,
          left: "50%",
          transform: [{ translateX: "-50%" }, { translateY: "0%" }],
          width: 150,
          backgroundColor: colors.lvPrimary80,
        }}
        mode="contained"
        onPress={() => loggedFoodsSheetRef.current?.snapToIndex(0)}
      >
        <Text variant="labelMedium" style={{ color: colors.lvBackground }}>
          Logged Foods
        </Text>
      </Button>

      <LoggedFoodsSheet sheetRef={loggedFoodsSheetRef}></LoggedFoodsSheet>
      <FoodOptionsSheet
        bottomSheetRef={bottomSheetRef}
        food={selectedFood}
        selectedMealType={selectedMealType}
        setselectedMealType={setselectedMealType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 20,
    gap: 12,
    flex: 1,
    backgroundColor: colors.lvBackground,
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
  selectedMealTab: { backgroundColor: colors.frostWhite, color: "black" },
  foodCardsContainer: {
    paddingHorizontal: 7,
  },
  foodCardDivider: {
    height: 1,
    backgroundColor: "gray",
  },
});

const mealTypes: string[] = ["Breakfast", "Lunch", "Dinner", "Snack"];
const foodHistory: FoodType[] = [
  {
    name: "Fish",
    calories: 128,
    grams: 100,
    protein: 26,
    carbs: 0,
    fats: 2.7,
  },
  {
    name: "Broccoli",
    calories: 35,
    grams: 100,
    protein: 2.8,
    carbs: 7,
    fats: 0.4,
  },
  {
    name: "Rice",
    calories: 130,
    grams: 100,
    protein: 2.7,
    carbs: 28,
    fats: 0.3,
  },
];
