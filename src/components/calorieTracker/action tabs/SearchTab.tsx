import { getSearchFoods } from "@/src/api/requests";
import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import { Food, mealType } from "@/src/types";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BottomSheet from "@gorhom/bottom-sheet";
import { Info } from "lucide-react-native";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Animated, View } from "react-native";
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

  //   const translateY = useSharedValue(0);
  //   const opacity = useSharedValue(1);
  //   const lastContentOffset = useSharedValue(0);
  //   const scrollHandler = useAnimatedScrollHandler({
  //     onScroll: (event) => {
  //       const currentOffset = event.contentOffset.y;

  //       // Ignore small jitters or bounce effects at the top
  //       if (currentOffset <= 0) {
  //         translateY.value = withTiming(0);
  //         return;
  //       }

  //       if (currentOffset > lastContentOffset.value && currentOffset > 0) {
  //         // SCROLLING DOWN -> Hide the view
  //         // translateY.value = withTiming(100, { duration: 100 }); // Adjust -100 to your view's height
  //         opacity.value = withTiming(0, { duration: 200 });
  //       } else if (currentOffset < lastContentOffset.value) {
  //         // SCROLLING UP -> Show the view
  //         // translateY.value = withTiming(0);
  //         opacity.value = withTiming(1, { duration: 100 });
  //       }

  //       lastContentOffset.value = currentOffset;
  //     },
  //   });

  return (
    <>
      {/* Food search input */}
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
              forceTextInputFocus={false}
              rippleColor={colors.lvPrimary20}
              onPress={(e) => {
                setSearchInput("");
              }}
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
            fontSize: 21,
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
            elevation: 5,
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
      {/* <FoodOptionsSheet
        bottomSheetRef={bottomSheetRef}
        food={selectedFood}
        selectedMealType={selectedMealType}
        // setSelectedMealType={setselectedMealType}
      /> */}
    </>
  );
}
