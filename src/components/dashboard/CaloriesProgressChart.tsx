import { useAuth } from "@/src/context/authContext";
import { useUserActivitiesStore } from "@/src/store/userActivitiesStore";
import { useUserLogsStore } from "@/src/store/userLogsStore";
import { useUserStore } from "@/src/store/userStore";
import { colors } from "@/src/theme/colors";
import { Apple, CircleEqual, Flame } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import { Divider, Text, TouchableRipple } from "react-native-paper";

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
    (s) => s.userActivities,
  );
  const activitiesCaloriesSum = useUserActivitiesStore(
    (s) => s.activitiesCaloriesSum,
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
    // {
    //   title: "Goal",
    //   Icon: Target,
    //   value: user?.nutritionGoals.calories ?? 0,
    //   color: "rgba(222, 222, 222, 1)",
    // },
    {
      title: "Consumed",
      Icon: Apple,
      value: todaysMacros.calories,
      color: "white",
    },
    {
      title: "Burned",
      Icon: Flame,
      value: activitiesCaloriesSum,
      color: "rgb(246, 114, 20)",
    },
    {
      title: "Total",
      Icon: CircleEqual,
      value: todaysMacros.calories - activitiesCaloriesSum,
      color: colors.primary,
    },
  ];
  ("#1c2229b3");
  return (
    <TouchableRipple
      borderless
      rippleColor={colors.lvPrimary50}
      style={styles.mainContainer}
      onPress={() => console.log("object")}
    >
      <View>
        {/* Chart Container */}
        <View
          style={{
            alignSelf: "center",
          }}
        >
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
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
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
        {/* Calories Info texts */}
        <Divider
          style={{
            width: "80%",
            height: 1,
            backgroundColor: "rgb(68, 68, 68)",
            alignSelf: "center",
          }}
        ></Divider>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingHorizontal: 10,
          }}
        >
          {chartInfo.map((info, index) => (
            <View style={{ flexDirection: "row" }} key={index}>
              <View>
                <Text
                  style={{ color: "rgb(208, 208, 208)", fontSize: 14 }}
                  variant="labelLarge"
                >
                  {info.title}
                </Text>
                <View
                  style={{ flexDirection: "row", gap: 6, alignSelf: "center" }}
                >
                  <Text
                    variant="labelLarge"
                    style={{
                      textAlign: "center",
                      color: chartInfo[index].color,
                      fontSize: 20,
                    }}
                  >
                    {info.value}
                  </Text>
                  <Text
                    variant="labelLarge"
                    style={{ fontSize: 10, color: "gray" }}
                  >
                    kcal
                  </Text>
                </View>
              </View>
              {chartInfo.length - 1 > index ? (
                <Divider
                  style={{
                    backgroundColor: "gray",
                    width: 1,
                    height: "100%",
                    marginHorizontal: 20,
                  }}
                ></Divider>
              ) : null}
            </View>
          ))}
        </View>
        {/* <View
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
        </View> */}
      </View>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 5,
    justifyContent: "space-around",
    gap: 10,
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
