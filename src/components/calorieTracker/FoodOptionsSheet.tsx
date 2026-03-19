import { useAuth } from "@/src/context/authContext";
import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
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
import { Button, Divider, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import MenuPicker from "../UI/MenuPicker";
import ProgressBar from "../UI/ProgressBar";

// const SCREEN_WIDTH = Dimensions.get("window").width;

type FoodSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  food: FoodType | BarcodeFoodType | null;
  selectedMealType: mealType;
  setSelectedMealType: Dispatch<SetStateAction<mealType>>;
  initialIndex?: number;
  enablePanDownToClose?: boolean;
  setFoodLogged?: Dispatch<SetStateAction<boolean>>;
};

type macroKey = "fats" | "protein" | "carbs";

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
}: FoodSheetProps) {
  // Hooks
  const [quantityInput, setQuantityInput] = useState(
    String(food?.loggedQuantity ?? "100"),
  );
  const quantityInputRef = useRef<RNTextInput>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const snapPoints = useMemo(() => ["98%"], []);
  const [prevFood, setPrevFood] = useState<FoodType | BarcodeFoodType | null>(
    food,
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
    } else {
      setSheetOpen(true);
    }
  }, []);

  async function handleLogFood() {
    try {
      await handleAddFood(food, quantityInput, selectedMealType);
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

  // When a food is selected, check whether a "quantity" property exists,
  // if "quantity" exists make its value is the default quantityInput value
  if (
    prevFood?.name !== food?.name ||
    prevFood?.loggedQuantity !== food?.loggedQuantity
  ) {
    setQuantityInput(String(food?.loggedQuantity ?? "100"));
    setPrevFood(food);
  }

  // Calculate Macros and Calories based on food quantity
  const currentMacros = macrosKeys.map((macro) => {
    const macroValue = food?.[macro] ?? 0;
    const grams = food?.loggedQuantity ?? food?.grams ?? 0;
    if (grams === 0) return 0;
    return Math.floor((macroValue / grams) * Number(quantityInput));
  });
  const currentCalories = Math.floor(
    ((food?.calories ?? 0) / (food?.grams ?? 0)) * Number(quantityInput),
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
        <View style={styles.flexRowView}>
          {/* MealType Picker */}
          <MenuPicker
            selectedOption={selectedMealType}
            setSelectedOption={setSelectedMealType}
            options={mealTypes}
          />
          {/* Quantity Input */}
          <View style={{ flex: 1 }}>
            <Text variant="labelLarge" style={{ color: colors.lightGrayText }}>
              Quantity (Grams)
            </Text>
            <TextInput
              ref={quantityInputRef}
              mode="outlined"
              keyboardType="number-pad"
              value={quantityInput}
              onChangeText={setQuantityInput}
              placeholder="Grams"
              style={styles.textInput}
              outlineColor="transparent"
              activeOutlineColor="transparent"
              cursorColor="white"
              placeholderTextColor={colors.lightGrayText}
              textColor={"white"}
            ></TextInput>
          </View>
        </View>

        {/* Macros Values Container */}
        <View style={[styles.flexRowView, styles.macrosContainer]}>
          {macrosKeys.map((macro, index) => {
            const IconElement = macrosInfo.macrosIcons[index];
            return (
              <View key={index}>
                <Divider
                  style={[
                    styles.divider,
                    { backgroundColor: "rgba(40, 154, 171, 0.09)" },
                  ]}
                />
                {/* Outer View for each macro */}
                <View
                  key={macro}
                  style={[
                    styles.macroTextContainer,
                    { borderColor: colors[macro] },
                  ]}
                >
                  <IconElement
                    size={22}
                    color={colors[macro]}
                    style={{
                      // backgroundColor: colors[macro],
                      borderRadius: 5,
                    }}
                  />
                  {/* ProgressBar and Label */}
                  <View
                    style={{
                      flexDirection: "column",
                      width: "70%",
                      gap: 10,
                    }}
                  >
                    <Text
                      variant="labelLarge"
                      style={{
                        fontSize: 15,
                        color: "rgba(225, 225, 225, 1)",
                        alignSelf: "flex-start",
                      }}
                    >
                      {macrosInfo.macrosLabels[index]}
                    </Text>

                    <ProgressBar
                      width={"100%"}
                      height={8}
                      unfilledColor={colors.lvPrimary10}
                      filledColor={colors[macro]}
                      currentValue={currentMacros[index]}
                      targetValue={user ? user?.nutritionGoals[macro] : 0}
                    ></ProgressBar>
                  </View>

                  {/* Percetange and value texts */}
                  <View style={{ flexDirection: "column", width: "30%" }}>
                    <Text
                      variant="labelLarge"
                      style={{
                        fontSize: 14,
                        color: "white",
                        textAlign: "center",
                        lineHeight: 25,
                      }}
                    >
                      {currentMacros[index]}g/{user?.nutritionGoals[macro]}g
                    </Text>
                    <Text
                      variant="labelLarge"
                      style={{
                        fontSize: 14,
                        color: "white",
                        textAlign: "center",
                        lineHeight: 25,
                      }}
                    >
                      {user
                        ? Math.floor(
                            (currentMacros[index] /
                              user.nutritionGoals[macro]) *
                              100,
                          ) + "%"
                        : null}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
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
