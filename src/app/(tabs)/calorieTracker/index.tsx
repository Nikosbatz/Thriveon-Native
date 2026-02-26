import FoodCard from "@/src/components/calorieTracker/FoodCard";
import FoodOptionsSheet from "@/src/components/calorieTracker/FoodOptionsSheet";
import LoggedFoodsSheet from "@/src/components/calorieTracker/LoggedFoodsSheet";
import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { Barcode, ListCheck } from "lucide-react-native";
import { useRef, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Divider, Text, TextInput, TouchableRipple } from "react-native-paper";

export default function CalorieTrackerScreen() {
  const [selectedMealType, setselectedMealType] = useState<string>("Breakfast");
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedFood, setSelectedFood] = useState<FoodType | null>(null);
  const [filteredFoods, setFilteredFoods] = useState<FoodType[]>([]);
  // const tabBarHeight = useBottomTabBarHeight();
  // const headerHeight = useHeaderHeight();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const loggedFoodsSheetRef = useRef<BottomSheet>(null);
  const foods: FoodType[] = useUserLogsStore((s) => s.foods);
  const todaysFoods: LoggedFoodType[] = useUserLogsStore((s) => s.todaysFoods);
  const router = useRouter();

  function handleSearchInputChange(text: string) {
    setSearchInput(text);
    if (text.length > 1) {
      const words = text.split(" ");
      setFilteredFoods(
        foods.filter((food) => {
          for (const word of words) {
            if (!food.name.toLowerCase().includes(word.toLowerCase())) {
              return false;
            }
          }
          return true;
        }),
      );
    }
    if (text.length === 0) {
      setFilteredFoods([]);
    }
  }

  function handleBarcodeScannerPress() {
    router.navigate("/calorieTracker/cameraScreen");
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
          {searchInput.length < 2 ? "History" : "Search Results"}
        </Text>
        {/* <Divider /> */}
        {/* Foods List */}
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
          contentContainerStyle={{
            gap: 2,
            paddingBottom: 10,
            paddingHorizontal: 5,
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Open logged foods button */}
      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          bottom: 15,
          right: "0%",
          transform: [{ translateX: "-10%" }, { translateY: "0%" }],
          width: "auto",
          backgroundColor: colors.lvPrimary,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <TouchableRipple
          onPress={() => loggedFoodsSheetRef.current?.snapToIndex(0)}
          rippleColor={"rgba(8, 147, 159, 0.52)"}
          borderless
        >
          <View style={{ alignItems: "center", padding: 5 }}>
            <ListCheck size={30} color={colors.lvBackground}></ListCheck>
            {/* Logged Foods Counter Badge */}
            <View
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
                  lineHeight: 10,
                  color: colors.lvPrimaryLight,
                  fontSize: 16,
                  width: todaysFoods.length > 0 ? 11 : 0,
                  height: 11,
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
      </View>

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
  selectedMealTab: { backgroundColor: colors.lvPrimary, color: "black" },
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
