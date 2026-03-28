import { useAuth } from "@/src/context/authContext";
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

// const SCREEN_WIDTH = Dimensions.get("window").width;

type FoodSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  food: Food | null;
  selectedMealType: mealType;
  setSelectedMealType: Dispatch<SetStateAction<mealType>>;
  initialIndex?: number;
  enablePanDownToClose?: boolean;
  setFoodLogged?: Dispatch<SetStateAction<boolean>>;
};

export type macroKey = "fats" | "protein" | "carbs";

const macrosKeys: macroKey[] = ["protein", "carbs", "fats"];

const macrosInfo = {
  macrosLabels: ["Protein", "Carbs", "Fats"],
  macrosIcons: [Beef, Wheat, Droplets],
};

//TODO: add a grams choice in all foods portions
//TODO: fix bug trying to read portions array on items that portions array is empty (Partialy solved by the previous TODO)

export default function FoodOptionsSheet({
  bottomSheetRef,
  food,
  selectedMealType,
  setSelectedMealType,
  initialIndex,
  enablePanDownToClose,
  setFoodLogged,
}: FoodSheetProps) {
  // Hooks
  const [quantityInput, setQuantityInput] = useState(
    String(
      food && "selectedServingIndex" in food
        ? (food.selectedServingIndex ?? "1")
        : "1",
    ),
  );
  const quantityInputRef = useRef<RNTextInput>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const snapPoints = useMemo(() => ["98%"], []);
  const [prevFood, setPrevFood] = useState<Food | null>(food);
  const [selectedServingIndex, setSelectedServingIndex] = useState(
    food && "selectedServingIndex" in food
      ? (food.selectedServingIndex ?? 0)
      : 0,
  );
  const handleAddFood = useUserLogsStore((s) => s.handleAddFood);
  const logsLoading = useUserLogsStore((s) => s.logsLoading);
  const { user } = useAuth();

  // Called when Sheet closes or opens
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setSheetOpen(false);
      // setQuantityInput("100");
      if (quantityInputRef.current?.isFocused()) {
        quantityInputRef.current.blur();
      }
      setSelectedServingIndex(0);
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
        text1: "Food Logged Successfully",
        text2: "",
      });
      bottomSheetRef.current?.close();
      setFoodLogged ? setFoodLogged(true) : null;
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Food Log Failed!",
        text2: "There was an error logging your food!",
      });
    }
  }

  function handleQuantityInputChange(text: string) {
    if (/^\d*\.?\d*$/.test(text)) {
      setQuantityInput(text);
    }
  }

  // When a food is selected, check whether a "quantity" property exists,
  // if "quantity" exists make its value is the default quantityInput value
  if (
    prevFood?.name !== food?.name ||
    prevFood?.loggedQuantity !== food?.loggedQuantity
  ) {
    setQuantityInput(String(food?.loggedQuantity ?? "1"));
    setPrevFood(food);
  }

  // Calculate Macros and Calories based on food quantity
  const currentCalories = Math.floor(
    ((food?.calories ?? 0) / (food?.grams ?? 0)) *
      Number(quantityInput) *
      (food?.portions[selectedServingIndex].gramWeight ?? 1),
  );

  console.log(food);

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
            style={{ color: "white", width: "75%" }}
          >
            {food?.name}
          </Text>
          <Text
            variant="headlineSmall"
            style={{
              fontSize: 20,
              color: "rgba(162, 162, 162, 1)",
            }}
          >
            cal{" "}
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
              selectedOptionIndex={food?.portions[selectedServingIndex].label}
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
              activeOutlineColor="transparent"
              cursorColor="white"
              placeholderTextColor={colors.lightGrayText}
              textColor={"white"}
              maxLength={6}
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
          {Number(quantityInput) *
            (food?.portions[selectedServingIndex].gramWeight ?? 0)}
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
    height: 53,
    backgroundColor: colors.lvPrimary20,
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
