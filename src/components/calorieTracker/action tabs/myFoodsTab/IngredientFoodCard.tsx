import { colors } from "@/src/theme/colors";
import { Food } from "@/src/types";
import { Trash2 } from "lucide-react-native";
import { Dispatch, SetStateAction } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";

type Props = {
  food: Food;
  addedIngredients: Food[];
  setAddedIngredients: Dispatch<SetStateAction<Food[]>>;
};
export default function IngredientFoodCard({
  food,
  addedIngredients,
  setAddedIngredients,
}: Props) {
  function handleFoodRemoval() {
    // Find the index of the first matching ingredient
    const indexToDelete = addedIngredients.findIndex(
      (filteredFood) =>
        filteredFood.name === food.name &&
        filteredFood.loggedQuantity === food.loggedQuantity &&
        filteredFood.selectedServingIndex === food.selectedServingIndex,
    );

    // If a match was found (index is not -1), remove only that one item
    const updatedAddedIngredients =
      indexToDelete !== -1
        ? addedIngredients.toSpliced(indexToDelete, 1) // Creates a new shallow-copied array without mutating the original
        : addedIngredients; // If no match, keep array as is
    setAddedIngredients(updatedAddedIngredients);
  }

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
    // Food card container
    <TouchableRipple
      borderless
      rippleColor={"rgba(11, 150, 160, 0.43)"}
      style={{
        width: "100%",
        borderRadius: 17,
        paddingHorizontal: 10,
        padding: 8,
        marginTop: 5,
        backgroundColor: colors.lvDiaryCardBg,
      }}
    >
      <View style={{}}>
        {/* Food name and Macros text container */}
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            maxWidth: "72%",
            gap: 0,
          }}
        >
          <Text
            variant="headlineSmall"
            style={{
              fontSize: 15,
              color: "white",
              lineHeight: 23,
            }}
          >
            {food.name}
          </Text>
          {food.brands ? (
            <Text
              variant="headlineSmall"
              style={{
                fontSize: 15,
                color: "rgb(184, 184, 184)",
                lineHeight: 20,
              }}
            >
              {food.brands}
            </Text>
          ) : null}

          {/* Macros container */}
          <View
            style={{
              marginTop: 2,
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 4,
              width: "105%",
              flexWrap: "wrap",
            }}
          >
            <Text
              style={{
                color: colors.lightWhiteText,
                fontSize: 14,
                marginTop: 5,
              }}
              variant="labelLarge"
            >
              {quantityText}
            </Text>
            <View style={{ flexDirection: "row", gap: 5 }}>
              {macrosKeys.map((macro, index) => (
                <Text
                  variant="labelLarge"
                  key={index}
                  style={{
                    color: "rgb(222, 222, 222)",
                    fontSize: 11,
                    backgroundColor: colors.lvBackground,
                    padding: 3,
                    borderRadius: 5,
                  }}
                >
                  {macro}:{" "}
                  <Text
                    variant="labelLarge"
                    style={{ color: colors.lvPrimaryLight, fontSize: 14 }}
                  >
                    {food[macro]}g
                  </Text>
                </Text>
              ))}
            </View>
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            right: "12%",
            top: "50%",
            transform: [{ translateX: "0%" }, { translateY: "-50%" }],
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontSize: 18, color: colors.lvPrimaryLight }}
            variant="labelLarge"
          >
            {food.calories}
          </Text>
          <Text style={{ fontSize: 17, color: "rgb(130, 130, 130)" }}>
            kcal
          </Text>
        </View>

        <TouchableOpacity
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            borderRadius: 5,
            transform: [{ translateY: "-50%" }],
            padding: 4,
          }}
          onPress={() => handleFoodRemoval()}
        >
          <Trash2 size={26} color={"rgb(167, 42, 42)"} />
        </TouchableOpacity>
      </View>
    </TouchableRipple>
  );
}

type macroKey = "fats" | "protein" | "carbs";

const macrosKeys: macroKey[] = ["protein", "carbs", "fats"];
