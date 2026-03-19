import { getSearchFoods } from "@/src/api/requests";
import FoodCard from "@/src/components/calorieTracker/FoodCard";
import FoodOptionsSheet from "@/src/components/calorieTracker/FoodOptionsSheet";
import LoggedFoodsSheet from "@/src/components/calorieTracker/LoggedFoodsSheet";
import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { Barcode, ListCheck } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Divider,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";

export default function CalorieTrackerScreen() {
  const [selectedMealType, setselectedMealType] =
    useState<mealType>("Breakfast");
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchEnded, setSearchEnded] = useState<boolean>(false);
  const [selectedFood, setSelectedFood] = useState<FoodType | null>(null);
  const [filteredFoods, setFilteredFoods] = useState<BarcodeFoodType[]>([]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const loggedFoodsSheetRef = useRef<BottomSheet>(null);
  const foods: BarcodeFoodType[] = useUserLogsStore((s) => s.foods);
  const todaysFoods: LoggedFoodType[] = useUserLogsStore((s) => s.todaysFoods);
  const foodHistory: LoggedFoodType[] = useUserLogsStore((s) => s.foodHistory);
  const router = useRouter();

  useEffect(() => {
    // If text is too short, don't even start the timer
    if (searchInput.length <= 2) return;

    const timer = setTimeout(async () => {
      const searchData = await getSearchFoods(searchInput);
      setSearchEnded(true);
      // Do your filtering logic with the fresh data
      const words = searchInput.split(" ");
      const searchedFoods = foods.filter((food) => {
        for (const word of words) {
          if (!food.name.toLowerCase().includes(word.toLowerCase())) {
            return false;
          }
        }
        return true;
      });
      searchedFoods.push(...searchData);
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
          <FlatList
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

      {/* Open logged foods and scan barcode buttons */}
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
      </View>

      <LoggedFoodsSheet sheetRef={loggedFoodsSheetRef}></LoggedFoodsSheet>
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

const mealTypes: mealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];
