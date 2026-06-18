import { useAuth } from "@/src/context/authContext";
import { useUserActivitiesStore } from "@/src/store/userActivitiesStore";
import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import { Text, TouchableRipple } from "react-native-paper";

type chartInfoItem = {
  title: string;
  value: number;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
};

export default function CaloriesProgressChart() {
  const { user } = useAuth();
  const todaysMacros = useUserLogsStore((s) => s.todaysMacros);
  const activitiesCaloriesSum = useUserActivitiesStore(
    (s) => s.activitiesCaloriesSum,
  );

  // Calculate remaining Calories
  let remainingCalDecimal = 0;
  let remainingCal = 0;
  if (user?.nutritionGoals.calories) {
    // Calculate remaining calories decimal for chart
    remainingCalDecimal =
      todaysMacros.calories / user.nutritionGoals.calories >= 0
        ? todaysMacros.calories / user.nutritionGoals.calories
        : 0;
    // Calculate remaining calories for text in center of the chart
    remainingCal =
      user.nutritionGoals.calories - todaysMacros.calories >= 0
        ? user.nutritionGoals.calories - todaysMacros.calories
        : 0;
  }

  return (
    <TouchableRipple
      borderless
      rippleColor={"rgba(106, 106, 106, 0.28)"}
      onPress={() => router.navigate("/(tabs)/diaryScreen")}
      style={[
        mainStyles.dashboardCard,
        styles.mainContainer,
        {
          paddingHorizontal: 3,
          shadowColor: "rgb(70, 228, 246)",
          elevation: 8,
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Consumed Text */}
        <View style={{ width: 80 }}>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <MaterialCommunityIcons
              name="food-fork-drink"
              size={22}
              color={colors.Snack}
            />
            <Text
              style={{ color: "rgb(255, 255, 255)", fontSize: 13 }}
              variant="labelLarge"
            >
              Consumed
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 6, alignSelf: "center" }}>
            <Text
              variant="labelLarge"
              style={{
                textAlign: "center",
                color: colors.Snack,
                fontSize: 20,
              }}
            >
              {todaysMacros.calories}
            </Text>
            <Text variant="labelLarge" style={{ fontSize: 10, color: "gray" }}>
              kcal
            </Text>
          </View>
        </View>
        {/* Chart Container */}
        <View
          style={{
            alignSelf: "center",
          }}
        >
          <ProgressChart
            data={[remainingCalDecimal > 1 ? 1 : remainingCalDecimal]}
            width={150}
            height={150}
            strokeWidth={14}
            radius={65}
            hideLegend={true}
            chartConfig={chartConfig}
            style={
              {
                // backgroundColor: "rgb(0,0,0)",
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
            <Text
              variant="labelLarge"
              style={{ fontSize: 13, color: "rgb(208, 208, 208)" }}
            >
              Remaining
            </Text>
            <Text
              variant="labelLarge"
              style={{
                fontSize: 33,
                lineHeight: 35,
                color: "white",
              }}
            >
              {remainingCal}
            </Text>
            <Text style={{ color: "rgb(214, 214, 214)" }}>kcal</Text>
          </View>
        </View>
        {/* Burned Text */}
        <View style={{ width: 80 }}>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Ionicons name="flame" size={22} color={colors.calories} />
            <Text
              style={{ color: "rgb(255, 255, 255)", fontSize: 13 }}
              variant="labelLarge"
            >
              Burned
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 6, alignSelf: "center" }}>
            <Text
              variant="labelLarge"
              style={{
                textAlign: "center",
                color: colors.calories,
                fontSize: 20,
              }}
            >
              {activitiesCaloriesSum}
            </Text>
            <Text variant="labelLarge" style={{ fontSize: 10, color: "gray" }}>
              kcal
            </Text>
          </View>
        </View>
        {/* <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingHorizontal: 10,
          }}
        >
          {chartInfo.map((info, index) => (
            <View style={{ flexDirection: "row" }} key={index}>
              <View>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{ color: "rgb(208, 208, 208)", fontSize: 14 }}
                    variant="labelLarge"
                  >
                    {info.title}
                  </Text>
                </View>

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
            </View>
          ))}
        </View> */}
      </View>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: "space-around",
    borderRadius: 20,
  },
});

const chartConfig = {
  backgroundGradientFrom: "rgba(30, 41, 35, 0)",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "rgba(20, 29, 24, 0.97)",
  backgroundGradientToOpacity: 0,

  // color: (opacity = 1) => `rgb(37, 228, 228,${opacity})`,
  // This function is called for both the fill and the track
  color: (opacity = 1) => {
    // If opacity is low, it's usually the 'track' (unfilled space)
    // We can return a fixed Gray for the track
    if (opacity < 0.3) {
      return `rgba(0, 0, 0, 0.3)`; // Dark gray track
    }
    // Return a bright, solid color for the filled part
    return `rgb(0, 250, 250)`;
  },

  // Optional: makes the ring transition smoother
  strokeWidth: 3,
  barRadius: 3,
};
