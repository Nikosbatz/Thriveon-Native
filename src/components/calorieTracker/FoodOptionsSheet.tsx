import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import BottomSheet, {
  BottomSheetView,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "@gorhom/bottom-sheet";
import { Beef, Check, Droplets, Wheat } from "lucide-react-native";
import React, { useCallback, useRef, useState } from "react";
import { TextInput as RNTextInput, StyleSheet, View } from "react-native";
import { Button, Divider, Text, TextInput } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";

// const SCREEN_WIDTH = Dimensions.get("window").width;

type FoodSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  food: FoodType | null;
  selectedMealType: string;
  setselectedMealType: React.Dispatch<React.SetStateAction<string>>;
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
  setselectedMealType,
}: FoodSheetProps) {
  // Hooks
  const [quantityInput, setQuantityInput] = useState("");
  const quantityInputRef = useRef<RNTextInput>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const handleAddFood = useUserLogsStore((s) => s.handleAddFood);
  const logsLoading = useUserLogsStore((s) => s.logsLoading);
  const backdropOpacity = useSharedValue(0);

  // trigger animation each time sheetOpen state changes
  const backdropStyle = useAnimatedStyle(() => ({
    backgroundColor: `{rgba(0, 0, 0,${backdropOpacity.value})}`,
  }));

  // Called when Sheet closes or opens
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setSheetOpen(false);
      backdropOpacity.value = withTiming(0, { duration: 250 });

      setQuantityInput("");
      if (quantityInputRef.current?.isFocused()) {
        quantityInputRef.current.blur();
      }
    } else {
      backdropOpacity.value = withTiming(0.5, { duration: 250 });
      setSheetOpen(true);
    }
  }, []);

  async function handleLogFood() {
    //setLoading = true
    try {
      await handleAddFood(food, quantityInput, selectedMealType);
      Toast.show({
        type: "success",
        text1: "Food Logged Successfully",
        text2: "",
      });
      bottomSheetRef.current?.close();
      // bottomSheetRef.current?.snapToIndex(-1);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Food Log Failed!",
        text2: "There was an error logging your food!",
      });
    }
  }

  // Calculate Macros and Calories based on food quantity
  const currentMacros = macrosKeys.map((macro) => {
    const macroValue = food?.[macro] ?? 0;
    const grams = food?.grams ?? 0;
    if (grams === 0) return 0;
    return Math.floor((macroValue / grams) * Number(quantityInput));
  });
  const currentCalories = Math.floor(
    ((food?.calories ?? 0) / (food?.grams ?? 0)) * Number(quantityInput)
  );

  return (
    <Animated.View
      pointerEvents={sheetOpen ? "auto" : "none"}
      style={[
        {
          position: "absolute",
          height: SCREEN_HEIGHT,
          bottom: 0,
          width: SCREEN_WIDTH,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        backdropStyle,
      ]}
    >
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        index={-1}
        backgroundStyle={{
          backgroundColor: colors.lvBackground,
          elevation: 10,
        }}
        enablePanDownToClose
      >
        <BottomSheetView style={styles.contentContainer}>
          {/* Food Name and Calories Container */}
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text variant="headlineSmall" style={{ color: "white" }}>
                {food?.name}
              </Text>
              <Text
                variant="headlineSmall"
                style={{ fontSize: 20, color: "rgba(162, 162, 162, 1)" }}
              >
                cal{" "}
                <Text variant="headlineSmall" style={{ color: colors.primary }}>
                  {currentCalories}
                </Text>
              </Text>
            </View>
            {/* <Divider style={styles.divider} /> */}
          </View>
          {/* Picker and TextInput Container */}
          <View style={styles.flexRowView}>
            <View>
              <Text
                variant="labelLarge"
                style={{ color: colors.lightGrayText }}
              >
                Meal Type
              </Text>
            </View>
            <View>
              <Text
                variant="labelLarge"
                style={{ color: colors.lightGrayText }}
              >
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
                placeholderTextColor={colors.lightGrayText}
                textColor={"white"}
              ></TextInput>
            </View>
          </View>
          <Divider style={styles.divider} />
          {/* Macros Values Container */}
          <View style={[styles.flexRowView, styles.macrosContainer]}>
            {macrosKeys.map((macro, index) => {
              const IconElement = macrosInfo.macrosIcons[index];
              return (
                <View
                  key={macro}
                  style={[
                    styles.macroTextContainer,
                    { borderColor: colors[macro] },
                  ]}
                >
                  <IconElement
                    size={22}
                    color={colors.primary}
                    style={{
                      // backgroundColor: colors[macro],
                      borderRadius: 5,
                    }}
                  />
                  <View
                    style={{ flexDirection: "column", alignContent: "center" }}
                  >
                    <Text
                      variant="labelLarge"
                      style={{
                        fontSize: 22,
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      {currentMacros[index]}
                    </Text>
                    <Text
                      variant="labelLarge"
                      style={{ fontSize: 15, color: "rgba(225, 225, 225, 1)" }}
                    >
                      {macrosInfo.macrosLabels[index]}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

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
              // bottomSheetRef.current?.;
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
    </Animated.View>
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
    width: SCREEN_WIDTH / 2 - 25,
    height: 53,
    backgroundColor: colors.lvSecondary,
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
    justifyContent: "space-around",
  },
  macroTextContainer: {
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    borderRadius: 20,
    backgroundColor: colors.lvGradientCard,
    borderWidth: 1.5,
  },
});
