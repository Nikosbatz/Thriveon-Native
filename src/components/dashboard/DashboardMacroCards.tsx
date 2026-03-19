import { useAuth } from "@/src/context/authContext";
import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { Text } from "react-native-paper";
import ProgressBar from "../UI/ProgressBar";

export default function DashboardMacroCards() {
  const { user } = useAuth();
  const todaysMacros = useUserLogsStore((s) => s.todaysMacros);

  const macros = [todaysMacros.protein, todaysMacros.fats, todaysMacros.carbs];

  const targets = [
    user?.nutritionGoals.protein ?? 0,
    user?.nutritionGoals.fats ?? 0,
    user?.nutritionGoals.carbs ?? 0,
  ];

  const macroPercentages = [
    user?.nutritionGoals.protein
      ? todaysMacros.protein / user.nutritionGoals.protein > 1
        ? 1
        : todaysMacros.protein / user.nutritionGoals.protein
      : 0,
    user?.nutritionGoals.fats
      ? todaysMacros.fats / user.nutritionGoals.fats > 1
        ? 1
        : todaysMacros.fats / user.nutritionGoals.fats
      : 0,
    user?.nutritionGoals.carbs
      ? todaysMacros.carbs / user.nutritionGoals.carbs > 1
        ? 1
        : todaysMacros.carbs / user.nutritionGoals.carbs
      : 0,
  ];

  console.log(todaysMacros);

  const data = {
    labels: ["Protein", "Fats", "Carbs"],
    data: macroPercentages,
    colors: [
      "rgba(0, 194, 212, 1)",
      "rgba(0, 115, 255, 1)",
      "rgba(1, 208, 132, 1)",
    ],
  };

  console.log(macros[0]);
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      {data.labels.map((label, index) => (
        <LinearGradient
          colors={[colors.lvGradientCard, data.colors[index]]}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          locations={[1, 1]}
          key={index}
          style={[
            mainStyles.card,
            {
              width: "32%",
              paddingHorizontal: 15,
              paddingTop: 15,
              paddingBottom: 5,
              gap: 10,
              borderColor: data.colors[index],
              borderWidth: 1,
            },
          ]}
        >
          <Text variant="labelLarge" style={{ color: data.colors[index] }}>
            {label.toUpperCase()}
          </Text>
          <Text
            variant="labelLarge"
            style={{ color: "white", fontSize: 20, lineHeight: 23 }}
          >
            {todaysMacros[label.toLowerCase()]}g
          </Text>
          <View style={{ alignItems: "center" }}>
            <ProgressBar
              filledColor={data.colors[index]}
              unfilledColor="rgb(63, 63, 63)"
              width={"100%"}
              height={6}
              currentValue={macros[index]}
              targetValue={targets[index]}
            />
          </View>
          <Text variant="labelLarge" style={{ color: "gray" }}>
            Goal: {targets[index]}g
          </Text>
        </LinearGradient>
      ))}
    </View>
  );
}
