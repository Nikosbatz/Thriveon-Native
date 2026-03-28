import { useAuth } from "@/src/context/authContext";
import { colors } from "@/src/theme/colors";
import { Food } from "@/src/types";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { Beef, Droplets, Wheat } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { Divider, Text } from "react-native-paper";
import ProgressBar from "../../UI/ProgressBar";

const macrosInfo = {
  macrosLabels: ["Protein", "Carbs", "Fats"],
  macrosIcons: [Beef, Wheat, Droplets],
};

const macrosKeys = ["protein", "carbs", "fats"] as const;

type Props = {
  food: Food | null;
  quantityInput: string;
  selectedServingIndex: number;
};
export default function MacrosInfo(props: Props) {
  const { user } = useAuth();

  let loggedGramsWeight = undefined;
  if (props.food?.loggedQuantity) {
    loggedGramsWeight = props.food
      ? props.food.portions[Number(props.food.selectedServingIndex)]
          .gramWeight * Number(props.food.loggedQuantity)
      : 0;
  }

  const currentInputGramsWeight = props.food
    ? props.food.portions[props.selectedServingIndex].gramWeight *
      Number(props.quantityInput)
    : 0;

  // Calculate Macros and Calories based on food quantity
  const currentMacros = macrosKeys.map((macro) => {
    const macroValue = props.food?.[macro] ?? 0;
    const grams = props.food?.loggedQuantity ?? props.food?.grams ?? 0;
    if (loggedGramsWeight) {
      return Math.floor(
        (macroValue * currentInputGramsWeight) / loggedGramsWeight,
      );
    } else {
      return Math.floor(
        (macroValue * currentInputGramsWeight) / (props.food?.grams ?? 1),
      );
    }
  });

  return (
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
                        (currentMacros[index] / user.nutritionGoals[macro]) *
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
  );
}

const styles = StyleSheet.create({
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
    width: "97%",
  },
});
