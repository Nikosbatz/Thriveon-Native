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
    console.log(food);
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
        {/* Food Name Text */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 0,
            maxWidth: "90%",
          }}
        >
          <Text
            variant="headlineMedium"
            style={{
              fontSize: 18,
              color: "white",
              lineHeight: 21,
            }}
          >
            {food.name}
          </Text>
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
          {/* <View style={{ flexDirection: "row", gap: 5 }}>
            <Text variant="labelLarge" style={[{ color: colors.protein }]}>
              p <Text style={{ color: "white" }}>{food.protein}g</Text>
            </Text>
            <Text variant="labelLarge" style={{ color: colors.carbs }}>
              c <Text style={{ color: "white" }}>{food.carbs}g</Text>
            </Text>
            <Text variant="labelLarge" style={{ color: colors.fats }}>
              f <Text style={{ color: "white" }}>{food.fats}g</Text>
            </Text>
          </View> */}

          <Text variant="labelLarge" style={styles.foodMacroValue}>
            {food.calories} kcal
            <Text style={styles.foodMacroText}> / 100g</Text>
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
    gap: 5,
  },
  foodMacroText: {
    color: colors.lightWhiteText,
  },
  foodMacroValue: {
    color: colors.lvPrimary,
    fontSize: 16,
  },
});
