import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import { Food, mealType } from "@/src/types";
import buildLoggedFoodObject from "@/src/utilities/buildLoggedFoodObject";
import Ionicons from "@expo/vector-icons/Ionicons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import { ArrowDown, ArrowUp, Check } from "lucide-react-native";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BackHandler,
  TextInput as RNTextInput,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  Divider,
  Menu,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import Toast from "react-native-toast-message";
import { Tooltip } from "../../UI/ToolTip";
import MacrosInfo from "./MacrosInfo";

type FoodSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  food: Food | null;
  selectedMealType: mealType | undefined;
  setSelectedMealType?: Dispatch<SetStateAction<mealType>>;
  initialIndex?: number;
  enablePanDownToClose?: boolean;
  setFoodLogged?: Dispatch<SetStateAction<boolean>>;
  snapPoint?: string;
  isIngredient?: boolean;
  setAddedIngredients?: Dispatch<SetStateAction<Food[]>>;
  addedIngredients?: Food[];
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
  // below props are mandatory for ingredient usage of the component
  isIngredient,
  setAddedIngredients,
  addedIngredients,
}: FoodSheetProps) {
  // Hooks
  const [quantityInput, setQuantityInput] = useState(
    String(food?.loggedQuantity ?? "1"),
  );
  const quantityInputRef = useRef<RNTextInput>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showServingMenu, setShowServingMenu] = useState(false);
  const snapPoints = useMemo(() => [snapPoint ?? "90%"], [snapPoint]);
  const [prevFood, setPrevFood] = useState<Food | null>(food);
  const [selectedServingIndex, setSelectedServingIndex] = useState(
    food?.selectedServingIndex ?? 0,
  );
  const handleAddFood = useUserLogsStore((s) => s.handleAddFood);
  const logsLoading = useUserLogsStore((s) => s.logsLoading);

  // Handle hardware back button / back gesture safely
  React.useEffect(() => {
    const onBackPress = () => {
      if (sheetOpen) {
        bottomSheetRef.current?.close();
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
  }, [sheetOpen, bottomSheetRef]);

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

  // handler for default usage of the component for logging foods
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

  // Handler in case of adding foods in food creating
  function handleAddIngredient() {
    if (!food) {
      return;
    }

    const addedFood = buildLoggedFoodObject({
      food,
      quantityInput,
      mealType: "Breakfast",
      selectedServingIndex,
    });

    if (addedIngredients) {
      const updatedIngredients = addedIngredients.slice();
      updatedIngredients.push(addedFood);
      setAddedIngredients ? setAddedIngredients(updatedIngredients) : null;
    }

    bottomSheetRef.current?.close();
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
        // backgroundColor: colors.lvBackground,
        backgroundColor: "#090F1D",
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
            alignItems: "center",
            gap: 5,
          }}
        >
          <View style={{ width: "65%" }}>
            <Text
              variant="headlineSmall"
              style={{
                color: "white",

                fontSize: 18,
                lineHeight: 21,
              }}
            >
              {food?.name}
            </Text>
            {food?.brands && (
              <Text
                style={{
                  color: "rgb(206, 206, 206)",
                  fontSize: 14,
                  lineHeight: 21,
                }}
              >
                {food.brands}
              </Text>
            )}
          </View>
          <View style={{ flexDirection: "row" }}>
            {food?.starred ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Tooltip text="This food is certified by our team">
                  <Ionicons
                    name="shield-checkmark-sharp"
                    size={22}
                    color="rgb(4, 195, 151)"
                  />
                </Tooltip>
              </View>
            ) : null}

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
        </View>

        {/* MealType Picker and TextInput Container */}
        <View style={[styles.flexRowView, {}]}>
          {/* MealType Picker */}
          <View style={{ flex: 1, width: "70%" }}>
            <Text
              variant="labelLarge"
              style={{ color: colors.lightGrayText, fontFamily: "QuickSand" }}
            >
              Serving
            </Text>
            <Menu
              visible={showServingMenu}
              onDismiss={() => setShowServingMenu(false)}
              style={{}}
              contentStyle={{
                // backgroundColor: "rgb(29, 32, 43)",
                backgroundColor: "#161F32",
                borderRadius: 20,
                borderWidth: 1,
                borderColor: colors.lvPrimary10,
                marginTop: 37,
              }}
              anchor={
                <TouchableRipple
                  borderless
                  rippleColor="rgba(255, 255, 255, 0.15)"
                  style={{
                    alignItems: "center",
                    alignSelf: "center",
                    marginBottom: 10,
                    borderRadius: 30,
                  }}
                  onPress={() => setShowServingMenu(true)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 10,
                      borderRadius: 30,
                      backgroundColor: "#161F32",
                      borderWidth: 1,
                      borderColor: colors.lvPrimary10,
                      minWidth: "100%",
                    }}
                  >
                    <Text
                      variant="labelLarge"
                      style={{
                        color: "white",
                        textAlign: "left",
                        fontSize: 16,
                      }}
                    >
                      {food?.portions[selectedServingIndex]?.label}
                    </Text>
                    {showServingMenu ? (
                      <ArrowUp size={22} color={"white"} />
                    ) : (
                      <ArrowDown size={22} color={"white"} />
                    )}
                  </View>
                </TouchableRipple>
              }
            >
              {food?.portions.map((portion, index) => (
                <React.Fragment key={index}>
                  <Menu.Item
                    onPress={() => {
                      setShowServingMenu(false);
                      setSelectedServingIndex(index);
                    }}
                    titleStyle={{
                      color: "white",
                      fontWeight: "600",
                      fontFamily: "quicksand",
                      fontSize: 15,
                    }}
                    title={portion.label}
                  />
                  {index < food?.portions.length - 1 && (
                    <Divider
                      style={{
                        backgroundColor: colors.lvPrimary10,
                        marginHorizontal: 10,
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </Menu>
          </View>
          {/* Quantity Input */}
          <View style={{ width: "40%" }}>
            <Text
              variant="labelLarge"
              style={{ color: colors.lightGrayText, fontFamily: "QuickSand" }}
            >
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
              outlineColor={colors.lvPrimary10}
              activeOutlineColor={colors.lvPrimary10}
              cursorColor="white"
              placeholderTextColor={colors.lightGrayText}
              textColor={"white"}
              maxLength={6}
              theme={{ roundness: 30 }}
            ></TextInput>
          </View>
          {/* <MenuPicker
            selectedOption={selectedMealType}
            setSelectedOption={setSelectedMealType}
            options={mealTypes}
          /> */}
        </View>

        <Text
          variant="labelLarge"
          style={{
            color: "rgb(171, 171, 171)",
            backgroundColor: "#161F32",
            padding: 3,
            paddingHorizontal: 10,
            borderRadius: 20,
            alignSelf: "flex-start",
            fontFamily: "QuickSand",
          }}
        >
          Grams in total:{" "}
          <Text
            variant="labelLarge"
            style={{
              color: "white",
              fontSize: 15,
              fontFamily: "QuickSandSemiBold",
            }}
          >
            {(
              Number(quantityInput) *
              (food?.portions[selectedServingIndex]?.gramWeight ?? 0)
            ).toFixed(1)}
            g
          </Text>
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
            isIngredient ? handleAddIngredient() : handleLogFood();
          }}
          loading={logsLoading}
          disabled={logsLoading}
        >
          <Text
            variant="labelLarge"
            style={{ color: colors.lvBackground, fontSize: 17 }}
          >
            {isIngredient ? "Add ingredient" : "Log Food"}
          </Text>
        </Button>
      </BottomSheetView>
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
    backgroundColor: "#161F32",
    fontSize: 18,
    fontFamily: "QuickSand",
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
