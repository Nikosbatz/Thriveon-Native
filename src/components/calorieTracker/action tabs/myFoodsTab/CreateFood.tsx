import TextInputWithLabel from "@/src/components/UI/TextInputWithLabel";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { Food } from "@/src/types";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { ArrowBigRight, PlusCircle } from "lucide-react-native";
import React, { useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Divider } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import IngredientFoodCard from "./IngredientFoodCard";
import SearchSheet from "./SearchSheet";

export default function CreateFood() {
  // Main Food State
  const [foodName, setFoodName] = useState("");
  const [servingsInput, setServingsInput] = useState("");
  const [addedIngredients, setAddedIngredients] = useState<Food[]>([]);
  const [nextButtonEnabled, setNextButtonEnabled] = useState(false);
  const searchSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  // Input Validation
  useMemo(() => {
    if (
      foodName.length >= 2 &&
      servingsInput.length > 0 &&
      !Number.isNaN(servingsInput) &&
      Number(servingsInput) > 0 &&
      addedIngredients.length > 0
    ) {
      setNextButtonEnabled(true);
    } else if (nextButtonEnabled) {
      setNextButtonEnabled(false);
    }
  }, [foodName, servingsInput, addedIngredients]);

  function handleNextButtonPress() {
    router.navigate({
      pathname: "/calorieTracker/NewFoodPreviewScreen",
      params: {
        ingredientsList: JSON.stringify(addedIngredients),
        foodName: foodName,
        servingsInput: servingsInput,
      },
    });
  }

  return (
    <View
      style={{
        flex: 1,
        // paddingBottom: mainStyles.mainContainer.paddingBottom,
      }}
    >
      <View
        style={{
          // backgroundColor: colors.lvHeader,
          padding: 10,
          borderRadius: 15,
          gap: 10,
          flex: 1,
        }}
      >
        <View>
          <TextInputWithLabel
            label={"Food name"}
            placeholder="Enter here"
            style={{ fontSize: 17 }}
            input={foodName}
            setInput={setFoodName}
          />
          <Divider />
        </View>
        <View>
          <TextInputWithLabel
            label={"How many servings"}
            placeholder="Enter here"
            style={{ fontSize: 17 }}
            keyboardType="number-pad"
            input={servingsInput}
            setInput={setServingsInput}
          />
          <Divider />
        </View>
        <Button
          textColor="white"
          icon={() => <PlusCircle color={colors.lvPrimary80} />}
          onPress={() => searchSheetRef.current?.expand()}
          rippleColor={"rgba(24, 64, 56, 0.4)"}
          style={{}}
        >
          Add foods
        </Button>
        <ScrollView
          contentContainerStyle={{}}
          showsVerticalScrollIndicator={false}
        >
          {addedIngredients.map((food, index) => (
            <IngredientFoodCard
              key={index}
              food={food}
              addedIngredients={addedIngredients}
              setAddedIngredients={setAddedIngredients}
            />
          ))}
        </ScrollView>
        <Button
          mode={"contained"}
          style={{
            backgroundColor: colors.lvPrimary80,
            marginBottom:
              mainStyles.mainContainer.paddingBottom + insets.bottom,
            marginHorizontal: 15,
            marginTop: 0,
          }}
          icon={() => (
            <ArrowBigRight
              color={
                nextButtonEnabled ? colors.lvBackground : "rgba(0, 0, 0, 0.29)"
              }
            />
          )}
          textColor={colors.lvBackground}
          onPress={() => handleNextButtonPress()}
          disabled={!nextButtonEnabled}
        >
          Next
        </Button>
      </View>

      <SearchSheet
        sheetRef={searchSheetRef}
        addedIngredients={addedIngredients}
        setAddedIngredients={setAddedIngredients}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
