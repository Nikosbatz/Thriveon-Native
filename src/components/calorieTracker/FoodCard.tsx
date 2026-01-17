import { colors } from "@/src/theme/colors";
import BottomSheet from "@gorhom/bottom-sheet";
import { Plus } from "lucide-react-native";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { Text } from "react-native-paper";

type FoodCardProps = {
  food: FoodType;
  index: number;
  setSelectedFood: React.Dispatch<React.SetStateAction<FoodType | null>>;
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
  return (
    <TouchableHighlight
      key={index}
      // activeOpacity={0.5}
      underlayColor={colors.primary20}
      onPress={handleOnPress}
      style={{ backgroundColor: colors.lvGradientCard, borderRadius: 10 }}
    >
      <View style={styles.foodCard}>
        {/* Food Name and Calories Text */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 0,
          }}
        >
          <Text
            variant="headlineMedium"
            style={{
              fontSize: 19,
              color: "white",
            }}
          >
            {food.name}
          </Text>
          {/* <Text
            variant="labelLarge"
            style={{ color: "rgba(255, 255, 255, 1)" }}
          >
            {" "}
            ({food.calories}cal/{food.grams}g)
          </Text> */}
        </View>
        {/* Food Macro Info Text*/}
        <View style={{ flexDirection: "row", gap: 7 }}>
          <Text style={styles.foodMacroText}>
            protein: <Text style={styles.foodMacroValue}>{food.protein}g</Text>
          </Text>
          <Text style={styles.foodMacroText}>
            carbs: <Text style={styles.foodMacroValue}>{food.carbs}g</Text>
          </Text>
          <Text style={styles.foodMacroText}>
            fats: <Text style={styles.foodMacroValue}>{food.fats}g</Text>
          </Text>
          <Text style={styles.foodMacroText}>
            cal:{" "}
            <Text style={styles.foodMacroValue}>{food.calories}, 100g</Text>
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
            top: "60%",
            transform: [{ translateX: "0%" }, { translateY: "-50%" }],
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
    padding: 5,
    paddingHorizontal: 10,
    borderWidth: 0,
    borderColor: "rgba(135, 191, 244, 0)",
  },
  foodMacroText: {
    color: colors.lightGrayText,
  },
  foodMacroValue: {
    color: "white",
  },
});
