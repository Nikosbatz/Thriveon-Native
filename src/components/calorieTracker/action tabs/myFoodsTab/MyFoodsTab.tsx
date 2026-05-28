import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import { Food, mealType, Recipe } from "@/src/types";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { Info } from "lucide-react-native";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput, TouchableRipple } from "react-native-paper";
import Animated from "react-native-reanimated";
import FoodCard from "./FoodCard";

type Props = {
  selectedMealType: mealType | undefined;
  setSelectedFood: Dispatch<SetStateAction<Food | null>>;
  bottomSheetRef: React.RefObject<BottomSheet | null>;
};

export default function MyFoodsTab({
  selectedMealType,
  setSelectedFood,
  bottomSheetRef,
}: Props) {
  const [searchInput, setSearchInput] = useState("");
  const myFoods: Recipe[] = useUserLogsStore((s) => s.myFoods);
  const [filteredMyFoods, setFilteredMyFoods] = useState(myFoods);

  useEffect(() => {
    const updatedFilteredFoods = myFoods.filter((food) =>
      food.name.toLowerCase().includes(searchInput.toLowerCase()),
    );
    setFilteredMyFoods(updatedFilteredFoods);
  }, [searchInput, myFoods]);

  return (
    <View style={[styles.mainContainer]}>
      {/* Food search */}
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
        onChangeText={setSearchInput}
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

      {/* Create food button */}
      <TouchableRipple
        borderless
        rippleColor={"#66c2b178"}
        onPress={() => router.navigate("/calorieTracker/createFoodScreen")}
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 5,
          padding: 7,
          borderRadius: 8,
          backgroundColor: "#66c2b18d",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text variant="labelLarge" style={{ color: "white", fontSize: 16 }}>
            Create a new food
          </Text>
          <MaterialCommunityIcons name="beaker-plus" size={24} color="white" />
        </View>
      </TouchableRipple>

      {/* Foods List */}

      <Animated.FlatList
        scrollEventThrottle={128}
        data={filteredMyFoods}
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

      {myFoods.length === 0 ? (
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
            elevation: 4,
          }}
        >
          <Info size={24} color={colors.lvPrimaryLight}></Info>
          <Text
            style={{
              color: colors.lvPrimaryLight,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Your custom foods or recipes appear here!
          </Text>
          <Text style={{ color: "rgb(214, 214, 214)", textAlign: "center" }}>
            Try creating a food to have full control over your daily nutrition!
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    gap: 10,
  },
});
