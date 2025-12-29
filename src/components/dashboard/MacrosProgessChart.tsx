import { useAuth } from "@/src/context/authContext";
import { useUserLogsStore } from "@/src/store/userLogsStore";
import { StyleSheet, View } from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import { Text } from "react-native-paper";

export default function MacrosProgressChart() {
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

  const data = {
    labels: ["Protein", "Fats", "Carbs"],
    data: macroPercentages,
    colors: [
      "rgba(0, 194, 212, 1)",
      "rgba(0, 115, 255, 1)",
      "rgba(1, 208, 132, 1)",
    ],
  };

  return (
    <View style={styles.mainContainer}>
      <ProgressChart
        data={data}
        width={120}
        height={170}
        strokeWidth={14}
        radius={18}
        hideLegend={true}
        chartConfig={chartConfig}
        style={
          {
            //backgroundColor: "rgb(0,0,0)",
          }
        }
      />
      <View style={styles.labelsContainer}>
        {data.labels.map((label, index) => (
          <View key={index} style={styles.labelContainer}>
            <View
              style={[
                styles.labelShape,
                { backgroundColor: `${data.colors[index]}` },
              ]}
            ></View>
            <Text style={styles.labelTextContainer}>
              <Text
                variant="labelLarge"
                style={{
                  color: `${data.colors[index]}`,
                  lineHeight: 26,
                }}
              >
                {label}:{" "}
              </Text>
              <Text
                variant="labelLarge"
                style={{ fontSize: 20, color: "white" }}
              >
                {macros[index]}g
                <Text
                  style={{
                    color: "rgba(159, 159, 159, 0.56)",
                  }}
                >
                  /{targets[index]}g
                </Text>
              </Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    paddingEnd: 5,
    gap: 10,
    padding: 5,
  },
  labelsContainer: {
    justifyContent: "center",
    gap: 12,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  labelShape: {
    width: 12,
    height: 12,
    borderRadius: 50,
  },
  labelTextContainer: {},
});

const colorFunc = (opacity: number, index: number = 0) => {
  const baseColors = [
    [0, 194, 212], // protein
    [0, 115, 255], // fats
    [1, 208, 132], // carbs
  ];
  ("rgb(0,0,0)");

  // Safe fallback
  const [r, g, b] = baseColors[index] ?? baseColors[0];

  return opacity < 0.3
    ? `rgba(${r}, ${g}, ${b}, 0.15)` // background ring
    : `rgba(${r}, ${g}, ${b}, 1)`; // progress ring
};

const chartConfig = {
  backgroundGradientFrom: "rgba(30, 41, 35, 0)",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "rgba(30, 41, 35, 0)",
  backgroundGradientToOpacity: 0,

  color: colorFunc,
  labelColor: (opacity = 1) => {
    return `rgba(0,0,0,1)`;
  },
  barPercentage: 0.1,
};
