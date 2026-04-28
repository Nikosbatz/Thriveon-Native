import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import { Food, mealType } from "@/src/types";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import { Beef, Check, Droplets, Wheat } from "lucide-react-native";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { TextInput as RNTextInput, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import MenuPicker from "../../UI/MenuPicker";
import MacrosInfo from "./MacrosInfo";

type FoodSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  food: Food | null;
  selectedMealType: mealType;
  setSelectedMealType: Dispatch<SetStateAction<mealType>>;
  initialIndex?: number;
  enablePanDownToClose?: boolean;
  setFoodLogged?: Dispatch<SetStateAction<boolean>>;
  snapPoint?: string;
};

export type macroKey = "fats" | "protein" | "carbs";

const macrosKeys: macroKey[] = ["protein", "carbs", "fats"];

const macrosInfo = {
  macrosLabels: ["Protein", "Carbs", "Fats"],
  macrosIcons: [Beef, Wheat, Droplets],
};

export default function FoodOptionsSheet({
  bottomSheetRef,
  food,
  selectedMealType,
  setSelectedMealType,
  initialIndex,
  enablePanDownToClose,
  setFoodLogged,
  snapPoint,
}: FoodSheetProps) {
  // Hooks
  const [quantityInput, setQuantityInput] = useState(
    String(food?.loggedQuantity ?? "1"),
  );
  const quantityInputRef = useRef<RNTextInput>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const snapPoints = useMemo(() => [snapPoint ?? "90%"], []);
  const [prevFood, setPrevFood] = useState<Food | null>(food);
  const [selectedServingIndex, setSelectedServingIndex] = useState(
    food?.selectedServingIndex ?? 0,
  );
  const handleAddFood = useUserLogsStore((s) => s.handleAddFood);
  const logsLoading = useUserLogsStore((s) => s.logsLoading);

  // Called when Sheet closes or opens
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setSheetOpen(false);
      if (quantityInputRef.current?.isFocused()) {
        quantityInputRef.current.blur();
      }
    } else {
      setSheetOpen(true);
    }
  }, []);

  async function handleLogFood() {
    try {
      await handleAddFood(
        food,
        quantityInput,
        selectedMealType,
        selectedServingIndex,
      );
      Toast.show({
        type: "success",
        text1: "",
        text2: "",
      });
      bottomSheetRef.current?.close();
      setFoodLogged ? setFoodLogged(true) : null;
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Food log failed!",
        text2: "There was an error logging your food!",
      });
    }
  }

  function handleQuantityInputChange(text: string) {
    if (/^\d*\.?\d*$/.test(text)) {
      setQuantityInput(text);
    }
  }

  // When sheet is opened set the selected foods quantityInput and selectedServingIndex based on the foods data
  // This condition is used in case the food is from food history and has logged foods data in its object
  if (
    prevFood !== undefined &&
    (prevFood?.name !== food?.name ||
      prevFood?.loggedQuantity !== food?.loggedQuantity)
  ) {
    setQuantityInput(String(food?.loggedQuantity ?? "1"));
    setSelectedServingIndex(food?.selectedServingIndex ?? 0);
    setPrevFood(food);
  }

  // Calculate current food calories based on input
  const currentCalories = calculateCurrentCalories(
    food,
    selectedServingIndex,
    quantityInput,
  );

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

  return (
    <BottomSheet
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      handleIndicatorStyle={{ backgroundColor: "white" }}
      index={initialIndex ?? -1}
      backgroundStyle={{
        backgroundColor: colors.lvBackground,
        elevation: 10,
      }}
      snapPoints={snapPoints}
      enablePanDownToClose={enablePanDownToClose ?? true}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={styles.contentContainer}>
        {/* Food Name and Calories Container */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            variant="headlineSmall"
            style={{
              color: "white",
              width: "75%",
              fontSize: 18,
              lineHeight: 21,
            }}
          >
            {food?.name}
          </Text>

          <Text
            variant="headlineSmall"
            style={{
              fontSize: 17,
              color: "rgba(162, 162, 162, 1)",
            }}
          >
            kcal{" "}
            <Text variant="headlineSmall" style={{ color: colors.primary }}>
              {currentCalories}
            </Text>
          </Text>
        </View>

        {/* MealType Picker and TextInput Container */}
        <View style={[styles.flexRowView, {}]}>
          {/* MealType Picker */}
          <View style={{ flex: 1, width: "70%" }}>
            <Text variant="labelLarge" style={{ color: colors.lightGrayText }}>
              Serving
            </Text>
            <MenuPicker
              selectedOptionIndex={
                food?.portions[selectedServingIndex]?.label ?? 0
              }
              setSelectedOptionIndex={setSelectedServingIndex}
              options={food?.portions.map((portion) => portion.label) ?? []}
            />
          </View>
          {/* Quantity Input */}
          <View style={{ width: "40%" }}>
            <Text variant="labelLarge" style={{ color: colors.lightGrayText }}>
              Quantity
            </Text>
            <TextInput
              ref={quantityInputRef}
              mode="outlined"
              keyboardType="number-pad"
              value={quantityInput}
              onChangeText={(text) => handleQuantityInputChange(text)}
              placeholder="Quantity"
              style={styles.textInput}
              outlineColor="transparent"
              activeOutlineColor={colors.lvPrimary50}
              cursorColor="white"
              placeholderTextColor={colors.lightGrayText}
              textColor={"white"}
              maxLength={6}
              theme={{ roundness: 10 }}
            ></TextInput>
          </View>
          {/* <MenuPicker
            selectedOption={selectedMealType}
            setSelectedOption={setSelectedMealType}
            options={mealTypes}
          /> */}
        </View>
        <Text variant="labelLarge" style={{ color: "white" }}>
          Grams in total:{" "}
          {(
            Number(quantityInput) *
            (food?.portions[selectedServingIndex]?.gramWeight ?? 0)
          ).toFixed(1)}
          g
        </Text>

        {/* Macros Values Component */}
        <MacrosInfo
          food={food}
          quantityInput={quantityInput}
          selectedServingIndex={selectedServingIndex}
        />

        <Text
          style={{
            color: "rgba(206, 206, 206, 0.66)",
            fontSize: 11,
            alignSelf: "center",
          }}
          variant="labelLarge"
        >
          The above amounts are relative to daily goal consumption.
        </Text>

        <Button
          mode="contained-tonal"
          textColor="white"
          style={{
            alignSelf: "stretch",
            backgroundColor: colors.lvPrimary80,
            alignContent: "center",
          }}
          icon={() => <Check color={colors.lvBackground}></Check>}
          onPress={() => {
            handleLogFood();
          }}
          loading={logsLoading}
          disabled={logsLoading}
        >
          <Text
            variant="labelLarge"
            style={{ color: colors.lvBackground, fontSize: 17 }}
          >
            Log Food
          </Text>
        </Button>
      </BottomSheetView>
    </BottomSheet>
  );
}

const mealTypes: mealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(0,0,0)",
  },
  contentContainer: {
    flex: 1,
    padding: 6,
    paddingHorizontal: 10,
    minHeight: SCREEN_HEIGHT - 300,
    gap: 15,
  },
  picker: {
    height: 51,
    width: SCREEN_WIDTH / 2 - 25,
    backgroundColor: colors.lvSecondary,
    color: "white",
  },
  textInput: {
    // width: SCREEN_WIDTH / 2 - 25,
    height: 45,
    backgroundColor: "rgb(45, 61, 69)",
    fontSize: 18,
  },
  divider: {
    width: SCREEN_WIDTH - 20,
    marginVertical: 5,
    height: 1,
  },
  flexRowView: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 10,
    backgroundColor: "",
    width: "100%",
    justifyContent: "space-between",
  },
  macrosContainer: {
    // backgroundColor: "red",
    width: "100%",
    justifyContent: "flex-start",
    gap: 15,
  },
  macroTextContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    borderRadius: 20,
    // backgroundColor: colors.lvGradientCard,
    width: "97%",
    // borderWidth: 1.5,
  },
});

function calculateCurrentCalories(
  food: Food | null,
  selectedServingIndex: number,
  quantityInput: string,
) {
  if (!food) {
    return 0;
  }
  let currentCalories = food?.calories;
  if (food?.loggedQuantity && food.portions[selectedServingIndex]) {
    const loggedGramsWeight =
      food.portions[Number(food.selectedServingIndex)].gramWeight *
      Number(food.loggedQuantity);
    const currentInputGramsWeight =
      food.portions[selectedServingIndex].gramWeight * Number(quantityInput);

    currentCalories = Math.round(
      (food.calories * currentInputGramsWeight) / loggedGramsWeight,
    );
  } else {
    const weightInGrams =
      food.portions[selectedServingIndex]?.gramWeight * Number(quantityInput);

    currentCalories = Math.round(
      (food?.calories * weightInGrams) / food?.grams,
    );
  }

  return currentCalories;
}
