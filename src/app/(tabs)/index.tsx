import CalendarView from "@/src/components/dashboard/Calendar/Calendar";
import CaloriesProgressChart from "@/src/components/dashboard/CaloriesProgressChart";
import CustomHeader from "@/src/components/dashboard/CustomHeader";
import DashboardMacroCards from "@/src/components/dashboard/DashboardMacroCards";
import ExerciseTrackerCard from "@/src/components/dashboard/ExerciseTracker/ExerciseTrackerCard";
import WaterCard from "@/src/components/dashboard/WaterCard";
import WeightHistoryChart from "@/src/components/dashboard/WeightHistory/WeightHistoryChart";
import { useUserActivitiesStore } from "@/src/store/userActivitiesStore";
import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";

export default function Dashboard() {
  const getTodayFoods = useUserLogsStore((s) => s.getTodayFoods);
  const fetchUserWeightLogs = useUserLogsStore((s) => s.fetchUserWeightLogs);
  const userLogsLoading = useUserLogsStore((s) => s.logsLoading);
  const selectedDate = useUserLogsStore((s) => s.selectedDate);
  const getWaterIntake = useUserLogsStore((s) => s.getWaterIntake);
  const fetchUserActivites = useUserActivitiesStore(
    (s) => s.fetchUserActivites,
  );
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // TODO: does not reflect the changes immediatly when adding foods (needs to change the date and go back again to show the changes)
  // Bootstrap app by fetching all required data
  useEffect(() => {
    const bootstrap = async () => {
      try {
        await Promise.all([
          getTodayFoods(),
          fetchUserActivites(selectedDate),
          fetchUserWeightLogs(),
          getWaterIntake(),
        ]);
      } catch (error: any) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message,
        });
      }
    };
    bootstrap();
  }, [selectedDate]);

  return (
    <LinearGradient
      colors={["#085062", "#073854", "#080722", "#020212", "#020212"]}
      locations={[0, 0.05, 0.4, 0.5, 1]}
      style={{ flex: 1 }}
    >
      <CustomHeader scrollY={scrollY} />
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={[styles.mainContainer]}
        contentContainerStyle={{
          paddingTop: 100,
          paddingBottom: mainStyles.mainContainer.paddingBottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar */}
        <CalendarView />

        {/* Calories Chart */}
        <View style={[, { width: "100%", alignSelf: "center", maxWidth: 600 }]}>
          <CaloriesProgressChart></CaloriesProgressChart>
        </View>

        {/* Cards container (Every card but those from Horizontal ScrollView) */}
        <View style={styles.cardsContainer}>
          {/* Macros Cards 3-columns container */}
          <View
            style={{
              marginTop: 15,
              maxWidth: 600,
              width: "100%",
              alignSelf: "center",
            }}
          >
            <DashboardMacroCards />
          </View>
          {/* Row 2-Cards Container */}
          <View style={styles.flexRowCardsContainer}>
            <View
              style={{
                flex: 1,
                maxWidth: "50%",
              }}
            >
              <ExerciseTrackerCard />
            </View>
            <View style={{ flex: 1, maxWidth: "50%" }}>
              <WaterCard />
            </View>
          </View>
          {/* Weight History Chart Container */}
          <WeightHistoryChart />
        </View>
      </Animated.ScrollView>
      {userLogsLoading ? (
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.66)",
          }}
        >
          <ActivityIndicator
            size={70}
            color={colors.lvPrimaryLight}
            style={{
              flex: 1,
              alignSelf: "center",
            }}
          />
        </View>
      ) : null}
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "transparent",
    paddingBottom: 100,
    paddingVertical: 0,
  },
  cardsContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    gap: 20,
  },
  flexRowCardsContainer: {
    flexDirection: "row",
    gap: 20,
    alignItems: "stretch",
    justifyContent: "center",
  },
  // scrollViewCard: {
  //   padding: 2,
  //   backgroundColor: colors.lvGradientCard,
  //   borderRadius: 30,
  //   marginTop: 10,
  //   marginLeft: 0,
  //   marginRight: 0,
  //   width: SCREEN_WIDTH - 50,
  //   // iOS shadow
  //   shadowColor: "#000",
  //   shadowOffset: { width: 5, height: 4 },
  //   shadowOpacity: 1,
  //   shadowRadius: 12,
  //   // Android shadow
  //   elevation: 20,
  //   overflow: "hidden",
  // },
});
