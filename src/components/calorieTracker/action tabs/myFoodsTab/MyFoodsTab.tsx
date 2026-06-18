import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import { Food, mealType, MyFood } from "@/src/types";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { PlusIcon } from "lucide-react-native";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
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
  const myFoods: MyFood[] = useUserLogsStore((s) => s.myFoods);
  const [filteredMyFoods, setFilteredMyFoods] = useState(myFoods);
  const textInputRef = useRef<any>(null);

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
        onChangeText={setSearchInput}
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

      {/* Create food button */}
      <TouchableRipple
        borderless
        rippleColor={"#01a9ac78"}
        onPress={() => router.navigate("/calorieTracker/createFoodScreen")}
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 5,
          padding: 7,
          borderRadius: 8,
          backgroundColor: colors.lvPrimary50,
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

      {/* Hint for new users to create a new food */}
      {myFoods.length === 0 ? (
        <Pressable
          onPress={() => router.navigate("/calorieTracker/createFoodScreen")}
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
              paddingVertical: 20,
              paddingHorizontal: 10,
              width: "85%",
              maxWidth: 340,
              borderRadius: 20,
              gap: 14,
              alignItems: "center",
              borderWidth: 1.5,
              borderColor: "rgba(34, 197, 159, 0.25)",
              shadowColor: "#039a88",
              elevation: 10,
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(0, 229, 255, 0.1)",
                padding: 12,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: "rgba(34, 197, 178, 0.57)",
              }}
            >
              <PlusIcon size={26} color="#22a5c5" />
            </View>
            <Text
              variant="headlineSmall"
              style={{
                color: "#FFFFFF",
                textAlign: "center",
              }}
            >
              Your custom foods or recipes appear here!
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: "#A3A3A3",
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Try creating a new food or recipe to customize your nutrition
              exactly as you want! ✨
            </Text>
          </View>
        </Pressable>
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
