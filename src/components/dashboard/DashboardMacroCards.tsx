import { useAuth } from "@/src/context/authContext";
import { useUserLogsStore } from "@/src/store/userLogsStore";
import { mainStyles } from "@/src/theme/styles";
import { Beef, Droplets, Wheat } from "lucide-react-native";
import { View } from "react-native";
import { Divider, Text } from "react-native-paper";
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

  const data = {
    labels: ["Protein", "Fats", "Carbs"],
    data: macroPercentages,
    icons: [Beef, Droplets, Wheat],
    colors: ["rgb(0, 234, 255)", "rgba(0, 115, 255, 1)", "rgb(0, 255, 162)"],
  };

  return (
    <View
      style={[
        mainStyles.dashboardCard,
        {
          flexDirection: "row",
          justifyContent: "space-between",
        },
      ]}
    >
      {data.labels.map((label, index) => {
        const Icon = data.icons[index];
        return (
          <View style={{ width: "31%", flexDirection: "row" }} key={index}>
            <View
              key={index}
              style={[
                {
                  paddingHorizontal: 5,
                  paddingTop: 10,
                  paddingBottom: 5,
                  gap: 10,
                  backgroundColor: "transparent",
                  elevation: 0,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  variant="labelLarge"
                  style={{
                    // color: data.colors[index],
                    color: "rgb(210, 210, 210)",
                    textAlign: "center",
                    fontSize: 14,
                  }}
                >
                  {label.toUpperCase()}
                </Text>

                <Icon
                  size={20}
                  color={data.colors[index]}
                  style={{
                    // backgroundColor: colors.lvPrimary20,
                    borderRadius: 5,
                  }}
                />
              </View>
              <Text
                variant="labelLarge"
                style={{
                  color: "white",
                  fontSize: 20,
                  lineHeight: 23,
                  textAlign: "left",
                }}
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
            </View>
            {data.labels.length - 1 === index ? null : (
              <Divider
                style={{
                  backgroundColor: "rgb(67, 68, 78)",
                  width: 1,
                  height: "70%",
                  alignSelf: "center",
                }}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}
