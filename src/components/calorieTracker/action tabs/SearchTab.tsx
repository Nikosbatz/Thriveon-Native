import { getSearchFoods } from "@/src/api/requests";
import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import { Food, mealType } from "@/src/types";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BottomSheet from "@gorhom/bottom-sheet";
import { Search } from "lucide-react-native";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Animated, Pressable, View } from "react-native";
import { ActivityIndicator, Text, TextInput } from "react-native-paper";
import FoodCard from "../FoodCard";

type Props = {
  selectedMealType: mealType | undefined;
  setSelectedFood: Dispatch<SetStateAction<Food | null>>;
  bottomSheetRef: React.RefObject<BottomSheet | null>;
};

export default function SearchTab({
  selectedMealType,
  setSelectedFood,
  bottomSheetRef,
}: Props) {
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchEnded, setSearchEnded] = useState<boolean>(false);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const textInputRef = useRef<any>(null);

  const foodHistory: Food[] = useUserLogsStore((s) => s.foodHistory);

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

  return (
    <>
      {/* Food search input */}
      <TextInput
        ref={textInputRef}
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
              <MaterialIcons name="search" size={21} color={"white"} />
            )}
          />
        }
        right={
          searchInput !== "" ? (
            <TextInput.Icon
              forceTextInputFocus={false}
              rippleColor={colors.lvPrimary20}
              onPress={(e) => {
                setSearchInput("");
              }}
              icon={() => (
                <Entypo
                  name="circle-with-cross"
                  size={20}
                  color="rgb(255, 103, 103)"
                />
              )}
            />
          ) : null
        }
        value={searchInput}
        onChangeText={handleSearchInputChange}
        style={{
          fontSize: 16,
          padding: 0,
          height: 45,
          marginTop: 10,
          borderWidth: 0,
          backgroundColor: colors.lvBackground,
        }}
        placeholderTextColor={colors.lightWhiteText}
        textColor={"white"}
        theme={{ roundness: 30 }}
        //error={hasEmailError()}
      />
      {/* Search results or Logs history container */}
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
            fontSize: 19,
            paddingLeft: 15,
            alignSelf: "flex-start",
            color: colors.lvPrimaryLight,
          }}
        >
          {searchInput.length > 2 ? "Search Results: " : "History"}
        </Text>
        {/* Foods List */}
        {!searchEnded && searchInput.length > 2 ? (
          <ActivityIndicator
            style={{ flex: 1, paddingBottom: 150 }}
            size={50}
            color={colors.lvPrimaryLight}
          />
        ) : (
          <Animated.FlatList
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
        <Pressable
          onPress={() => textInputRef.current?.focus()}
          style={{
            alignItems: "center",
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
          }}
        >
          <View
            style={{
              backgroundColor: "rgb(2, 29, 44)",
              paddingVertical: 26,
              paddingHorizontal: 24,
              width: "85%",
              maxWidth: 340,
              borderRadius: 20, // Slightly rounder for a modern card look
              gap: 14,
              alignItems: "center",
              borderWidth: 1.5,
              borderColor: "rgba(34, 197, 159, 0.25)", // Sharp, translucent electric green border
              // Neon green ambient glow instead of flat black shadow
              shadowColor: "#039a88",
              elevation: 10,
            }}
          >
            {/* Icon Wrapper with a glassmorphic green tint */}
            <View
              style={{
                backgroundColor: "rgba(0, 229, 255, 0.1)", // Brighter vivid green backdrop
                padding: 12,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: "rgba(34, 197, 178, 0.57)",
              }}
            >
              <Search size={26} color="#22a5c5" /> {/* Electric green icon */}
            </View>

            <Text
              variant="headlineSmall"
              style={{
                color: "#FFFFFF", // Crisp white so it pops instantly
                textAlign: "center",
              }}
            >
              Your food history appears here
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: "#A3A3A3", // Lighter bright gray for high legibility
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Try searching for a food and a list of relevant foods will appear!
              ✨
            </Text>
          </View>
        </Pressable>
      )}
      {/* <FoodOptionsSheet
        bottomSheetRef={bottomSheetRef}
        food={selectedFood}
        selectedMealType={selectedMealType}
        // setSelectedMealType={setselectedMealType}
      /> */}
    </>
  );
}
