import { getSearchFoods } from "@/src/api/requests";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { Food } from "@/src/types";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import { ActivityIndicator, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FoodCard from "../../FoodCard";
import FoodOptionsSheet from "../../FoodOptionsSheet/FoodOptionsSheet";

type FoodSheetProps = {
  sheetRef: React.RefObject<BottomSheet | null>;
  addedIngredients: Food[];
  setAddedIngredients?: Dispatch<SetStateAction<Food[]>>;
};

export default function SearchSheet({
  sheetRef,
  setAddedIngredients,
  addedIngredients,
}: FoodSheetProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const snapPoints = useMemo(() => ["100%"], []);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchEnded, setSearchEnded] = useState<boolean>(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const foodOptionsSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  // Handle hardware back button / back gesture safely
  React.useEffect(() => {
    const onBackPress = () => {
      if (sheetOpen) {
        sheetRef.current?.close();
        return true; // Stop default behavior (don't exit app/screen)
      }
      return false; // Let default back behavior happen
    };

    // addEventListener returns a NativeEventSubscription object
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );

    // Clean up by calling .remove() directly on the subscription
    return () => subscription.remove();
  }, [sheetOpen, sheetRef]);

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

  // Called when Sheet closes or opens
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setSheetOpen(false);
    } else {
      setSheetOpen(true);
    }
  }, []);

  // BackDrop component used as prop to BottomSheet
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.9}
      />
    ),
    [],
  );

  async function handleSearchInputChange(text: string) {
    setSearchInput(text);
    setSearchEnded(false);
  }

  return (
    <BottomSheet
      ref={sheetRef}
      onChange={handleSheetChanges}
      handleIndicatorStyle={{ backgroundColor: "white" }}
      index={-1}
      backgroundStyle={{
        backgroundColor: colors.lvBackground,
        elevation: 10,
      }}
      snapPoints={["100%"]}
      // enableDynamicSizing
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
    >
      <View
        style={[
          styles.contentContainer,
          {
            paddingBottom:
              mainStyles.mainContainer.paddingBottom + insets.bottom,
          },
        ]}
      >
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
          {/* Foods List */}
          {!searchEnded && searchInput.length > 2 ? (
            <ActivityIndicator
              style={{ flex: 1, paddingBottom: 150 }}
              size={50}
              color={colors.lvPrimaryLight}
            />
          ) : (
            <BottomSheetScrollView keyboardShouldPersistTaps="handled">
              {filteredFoods.slice(0, 50).map((food, index) => (
                <View key={food._id || food.name}>
                  <FoodCard
                    food={food}
                    index={index}
                    bottomSheetRef={foodOptionsSheetRef}
                    setSelectedFood={setSelectedFood}
                  />
                </View>
              ))}
            </BottomSheetScrollView>
          )}
        </View>

        <FoodOptionsSheet
          bottomSheetRef={foodOptionsSheetRef}
          food={selectedFood}
          selectedMealType={"Breakfast"}
          snapPoint={"110%"}
          isIngredient={true}
          addedIngredients={addedIngredients}
          setAddedIngredients={setAddedIngredients}
          // setSelectedMealType={setselectedMealType}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(0,0,0)",
  },
  contentContainer: {
    flex: 1,
    padding: 6,
    paddingHorizontal: 10,
    gap: 15,
    paddingBottom: mainStyles.mainContainer.paddingBottom,
  },
});
