import { useAuth } from "@/src/context/authContext";
import { useUserActivitiesStore } from "@/src/store/userActivitiesStore";
import { useUserLogsStore } from "@/src/store/userLogsStore";
import { useUserStore } from "@/src/store/userStore";
import { colors } from "@/src/theme/colors";
import { Apple, CircleEqual, Flame, Target } from "lucide-react-native";
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
  const { user } = useAuth();
  const userProfile = useUserStore((s) => s.userProfile);
  const mealCalories = useUserLogsStore((s) => s.mealCalories);
  const todaysMacros = useUserLogsStore((s) => s.todaysMacros);
  const userActivities: userActivity[] = useUserActivitiesStore(
    (s) => s.userActivities
  );
  const activitiesCaloriesSum = useUserActivitiesStore(
    (s) => s.activitiesCaloriesSum
  );

  // Calculate remaining Calories
  let remainingCalDecimal = 0;
  let remainingCal = 0;
  if (user?.nutritionGoals.calories) {
    // Calculate remaining calories decimal for chart
    remainingCalDecimal =
      todaysMacros.calories / user.nutritionGoals.calories <= 1
        ? todaysMacros.calories / user.nutritionGoals.calories
        : 1;
    // Calculate remaining calories for text in center of the chart
    remainingCal =
      user.nutritionGoals.calories -
        (todaysMacros.calories - activitiesCaloriesSum) >=
      0
        ? user.nutritionGoals.calories -
          (todaysMacros.calories - activitiesCaloriesSum)
        : 0;
  }

  const chartInfo: chartInfoItem[] = [
    {
      title: "Goal",
      Icon: Target,
      value: user?.nutritionGoals.calories ?? 0,
      color: "rgba(222, 222, 222, 1)",
    },
    {
      title: "Calories",
      Icon: Apple,
      value: todaysMacros.calories,
      color: "green",
    },
    {
      title: "Burned",
      Icon: Flame,
      value: activitiesCaloriesSum,
      color: "rgba(246, 193, 20, 1)",
    },
    {
      title: "Total Calories",
      Icon: CircleEqual,
      value: todaysMacros.calories - activitiesCaloriesSum,
      color: colors.primary,
    },
  ];

  return (
    <View style={styles.mainContainer}>
      <View>
        <ProgressChart
          data={[remainingCalDecimal]}
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
            {remainingCal}
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
