import CaloriesProgressChart from "@/src/components/dashboard/CaloriesProgressChart";
import DashboardMacroCards from "@/src/components/dashboard/DashboardMacroCards";
import ExerciseTrackerCard from "@/src/components/dashboard/ExerciseTracker/ExerciseTrackerCard";
import WaterCard from "@/src/components/dashboard/WaterCard";
import WeightHistoryChart from "@/src/components/dashboard/WeightHistory/WeightHistoryChart";
import { useAuth } from "@/src/context/authContext";
import { useUserActivitiesStore } from "@/src/store/userActivitiesStore";
import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import Toast from "react-native-toast-message";

const ITEM_WIDTH = Dimensions.get("window").width - 50;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function Dashboard() {
  const foods = useUserLogsStore((s) => s.foods);
  const loadFoods = useUserLogsStore((s) => s.loadFoods);
  const todaysFoods = useUserLogsStore((s) => s.todaysFoods);
  const getTodayFoods = useUserLogsStore((s) => s.getTodayFoods);
  const fetchUserWeightLogs = useUserLogsStore((s) => s.fetchUserWeightLogs);
  const fetchUserActivites = useUserActivitiesStore(
    (s) => s.fetchUserActivites,
  );

  const router = useRouter();

  const { logOut } = useAuth();
  const scrollX = useRef(new Animated.Value(0)).current;

  // Bootstrap app by fetching all required data
  useEffect(() => {
    const bootstrap = async () => {
      try {
        await Promise.all([
          getTodayFoods(),
          foods.length === 0 ? loadFoods() : Promise.resolve(),
          fetchUserActivites(),
          fetchUserWeightLogs(),
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
  }, []);

  return (
    <ScrollView
      style={[styles.mainContainer]}
      contentContainerStyle={{}}
      showsVerticalScrollIndicator={false}
    >
      {/* Calories Chart */}
      <View
        style={[styles.scrollViewCard, { width: "95%", alignSelf: "center" }]}
      >
        <CaloriesProgressChart></CaloriesProgressChart>
      </View>

      {/* FOR TESTING */}
      {/* <Button onPress={() => logOut()}>log out</Button>
      <Button onPress={() => router.navigate("/(onBoarding)/welcomeScreen")}>
        to welcome screen
      </Button> */}
      {/* Cards container (Every card but those from Horizontal ScrollView) */}
      <View style={styles.cardsContainer}>
        {/* Macros Cards 3-columns container */}
        <DashboardMacroCards />
        {/* Row 2-Cards Container */}
        <View style={styles.flexRowCardsContainer}>
          <View style={[mainStyles.card, { flex: 1, maxWidth: "50%" }]}>
            <ExerciseTrackerCard />
          </View>
          <View style={[mainStyles.card, { flex: 1, maxWidth: "50%" }]}>
            <WaterCard />
          </View>
        </View>
        {/* Weight History Chart Container */}
        <View style={[mainStyles.card, {}]}>
          <WeightHistoryChart />
        </View>
      </View>
      <Text> </Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.lvBackground,
    paddingBottom: 100,
    paddingVertical: 0,
  },
  cardsContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    gap: 10,
  },
  flexRowCardsContainer: {
    flexDirection: "row",
    gap: 20,
    alignItems: "stretch",
  },
  scrollViewCard: {
    padding: 2,
    backgroundColor: colors.lvGradientCard,
    borderRadius: 30,
    marginTop: 10,
    marginLeft: 0,
    marginRight: 0,
    width: SCREEN_WIDTH - 50,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    // Android shadow
    elevation: 20,
    overflow: "hidden",
  },
});
