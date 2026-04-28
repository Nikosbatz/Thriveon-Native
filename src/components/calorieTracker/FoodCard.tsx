import { colors } from "@/src/theme/colors";
import { Food } from "@/src/types";
import BottomSheet from "@gorhom/bottom-sheet";
import { Plus } from "lucide-react-native";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { Text } from "react-native-paper";

type FoodCardProps = {
  food: Food;
  index: number;
  setSelectedFood: React.Dispatch<React.SetStateAction<Food | null>>;
  bottomSheetRef: React.RefObject<BottomSheet | null>;
};

export default function FoodCard({
  food,
  index,
  setSelectedFood,
  bottomSheetRef,
}: FoodCardProps) {
  function handleOnPress() {
    setSelectedFood(food);
    bottomSheetRef.current?.expand();
  }

  // Define quantityText as the food.grams as a fallback in case the food is not Logged
  // Calculate the quantityText based on the loggedQuantity in case the food is Logged
  let quantityText = food.grams + "g";
  if (
    food.loggedQuantity !== undefined &&
    food.selectedServingIndex !== undefined
  ) {
    const splitLabel =
      food.portions[food.selectedServingIndex].label.split(" ");
    quantityText =
      Number(splitLabel[0]) * food.loggedQuantity +
      " " +
      splitLabel.slice(1).join(" ");
  }
  return (
    <TouchableHighlight
      key={index}
      // activeOpacity={0.5}
      underlayColor={"rgba(68, 73, 107, 0.6)"}
      onPress={handleOnPress}
      style={{
        backgroundColor: colors.lvFoodCardBg,
        borderRadius: 10,
        marginTop: 2,
      }}
    >
      <View style={styles.foodCard}>
        {/* Food Name Text */}
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 0,
            maxWidth: "90%",
          }}
        >
          <Text
            variant="labelLarge"
            style={{
              fontSize: 15,
              color: "white",
              lineHeight: 19,
            }}
          >
            {food.name}
          </Text>
          {food.brands ? (
            <Text
              variant="bodyLarge"
              style={{
                fontSize: 14,
                color: "rgb(184, 184, 184)",
                lineHeight: 20,
              }}
            >
              {food.brands}
            </Text>
          ) : null}
        </View>
        {/* Food Macro Info Text*/}
        <View
          style={{
            flexDirection: "column",
            gap: 7,
            // alignSelf: "flex-end",
            // marginRight: 40,
          }}
        >
          <Text variant="labelLarge" style={styles.foodMacroValue}>
            {food.calories} kcal
            <Text style={styles.foodMacroText} variant="labelLarge">
              , {quantityText}
            </Text>
          </Text>
        </View>
        {/* Plus Icon */}
        <View
          style={{
            backgroundColor: colors.lvBackground,
            borderRadius: 30,
            padding: 5,
            position: "absolute",
            right: 10,
            top: "50%",
            transform: [{ translateX: "0%" }, { translateY: "-10%" }],
          }}
        >
          <Plus size={18} color={colors.primary} style={{}} />
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  foodCard: {
    backgroundColor: "transparent",
    borderRadius: 10,
    elevation: 0,
    padding: 12,
    paddingHorizontal: 10,
    borderWidth: 0,
    borderColor: "rgba(135, 191, 244, 0)",
    gap: 0,
  },
  foodMacroText: {
    color: "rgb(167, 167, 167)",
    fontSize: 13,
  },
  foodMacroValue: {
    // color: colors.lvPrimaryLight,
    color: "rgb(176, 176, 176)",
    fontSize: 13,
  },
});
