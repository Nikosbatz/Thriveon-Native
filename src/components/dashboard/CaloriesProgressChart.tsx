import { useUserLogsStore } from "@/src/store/userLogsStore";
import { useUserStore } from "@/src/store/userStore";
import { colors } from "@/src/theme/colors";
import { Apple, CircleEqual, Flame, Target } from "lucide-react-native";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import { Text } from "react-native-paper";

type chartInfoItem = {
  title: string;
  value: number;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
};
//TODO: Must subscribe to zustand store and take real data
export default function CaloriesProgressChart() {
  const userProfile = useUserStore((s) => s.userProfile);
  const mealCalories = useUserLogsStore((s) => s.mealCalories);

  const totalCalories = useMemo(() => {
    let sum = 0;
    for (const meal of mealCalories) {
      sum += meal.value;
    }
    return sum;
  }, [mealCalories]);

  const chartInfo: chartInfoItem[] = [
    {
      title: "Goal",
      Icon: Target,
      value: 2000,
      color: "rgba(222, 222, 222, 1)",
    },
    {
      title: "Calories",
      Icon: Apple,
      value: 1133,
      color: "green",
    },
    {
      title: "Burned",
      Icon: Flame,
      value: 400,
      color: "rgba(246, 193, 20, 1)",
    },
    {
      title: "Total Calories",
      Icon: CircleEqual,
      value: 1133 - 400,
      color: colors.primary,
    },
  ];

  const data = {
    data: [0.5],
  };

  return (
    <View style={styles.mainContainer}>
      <View>
        <ProgressChart
          data={data}
          width={160}
          height={160}
          strokeWidth={14}
          radius={70}
          hideLegend={true}
          chartConfig={chartConfig}
          style={
            {
              //backgroundColor: "rgb(0,0,0)",
            }
          }
        />
        <View
          style={{
            position: "absolute",
            top: "45%",
            left: "50%",
            transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
            //backgroundColor: "rgba(173, 173, 173, 1)",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white" }}>Remaining</Text>
          <Text
            variant="headlineMedium"
            style={{ fontSize: 27, color: colors.primary }}
          >
            253
          </Text>
          <Text style={{ color: "white" }}>kcal</Text>
        </View>
      </View>
      <View>
        <View
          style={{
            gap: 10,
            flex: 1,
          }}
        >
          {chartInfo.map((info, index) => (
            <View
              key={index}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <info.Icon size={24} color={info.color} />
              <View>
                <Text style={{ color: "white" }}>{info.title}</Text>
                <Text
                  variant="labelLarge"
                  style={{ fontSize: 15, color: colors.lvPrimary80 }}
                >
                  {info.value}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    padding: 5,
    justifyContent: "space-around",
  },
});

const chartConfig = {
  backgroundGradientFrom: "rgba(30, 41, 35, 0)",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "rgba(30, 41, 35, 0)",
  backgroundGradientToOpacity: 0,

  color: (opacity = 1) => `rgb(37, 228, 228,${opacity})`,
  labelColor: (opacity = 1) => {
    return `rgba(0,0,0,1)`;
  },
};
