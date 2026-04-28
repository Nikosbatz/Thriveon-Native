import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import { Food } from "@/src/types";
import { Trash2 } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Text, TouchableRipple } from "react-native-paper";
import Toast from "react-native-toast-message";

type Props = {
  food: Food;
};
export default function DiaryFoodCard({ food }: Props) {
  const removeFood = useUserLogsStore((s) => s.removeFood);
  const [pendingRemoval, setPendingRemoval] = useState(false);

  async function handleFoodRemoval(food: Food) {
    setPendingRemoval(true);
    try {
      await removeFood(food);
      setPendingRemoval(false);
    } catch (error: any) {
      setPendingRemoval(false);
      Toast.show({
        type: "error",
        text1: error.message,
        text2: "Please try again later",
      });
    }
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

  //TODO: Make macros appear on press
  return (
    // Food card container
    <TouchableRipple
      borderless
      rippleColor={"rgba(11, 150, 160, 0.43)"}
      style={{
        width: "95%",
        borderRadius: 17,
        paddingHorizontal: 10,
        padding: 8,
        marginTop: 5,
        backgroundColor: colors.lvFoodCardBg,
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
              fontSize: 16,
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
          onPress={() => handleFoodRemoval(food)}
        >
          {pendingRemoval ? (
            <ActivityIndicator size={26} color="rgb(167, 42, 42)" />
          ) : (
            <Trash2 size={26} color={"rgb(167, 42, 42)"} />
          )}
        </TouchableOpacity>
      </View>
    </TouchableRipple>
  );
}

type macroKey = "fats" | "protein" | "carbs";

const macrosKeys: macroKey[] = ["protein", "carbs", "fats"];
