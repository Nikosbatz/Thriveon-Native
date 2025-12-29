import CaloriesProgressChart from "@/src/components/dashboard/CaloriesProgressChart";
import ExerciseTrackerCard from "@/src/components/dashboard/ExerciseTracker/ExerciseTrackerCard";
import MacrosProgressChart from "@/src/components/dashboard/MacrosProgessChart";
import WaterCard from "@/src/components/dashboard/WaterCard";
import WeightHistoryChart from "@/src/components/dashboard/WeightHistoryChart";
import PagerDots from "@/src/components/UI/PagerDots";
import { useAuth } from "@/src/context/authContext";
import { useUserActivitiesStore } from "@/src/store/userActivitiesStore";
import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";

const ITEM_WIDTH = Dimensions.get("window").width - 50;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function Dashboard() {
  const foods = useUserLogsStore((s) => s.foods);
  const loadFoods = useUserLogsStore((s) => s.loadFoods);
  const todaysFoods = useUserLogsStore((s) => s.todaysFoods);
  const getTodayFoods = useUserLogsStore((s) => s.getTodayFoods);
  const fetchUserActivites = useUserActivitiesStore(
    (s) => s.fetchUserActivites
  );

  const { logOut } = useAuth();
  const theme = useTheme();
  const scrollX = useRef(new Animated.Value(0)).current;

  // Fetch todaysFoods
  useEffect(() => {
    const fetchTodaysFoods = async () => {
      try {
        await getTodayFoods();
      } catch (error: any) {
        Toast.show({
          type: "error",
          text1: error.message,
          text2: "Error Fetching Foods",
        });
      }
    };
    fetchTodaysFoods();
  }, []);

  // Fetch foods
  useEffect(() => {
    const fetchFoods = async () => {
      if (foods.length === 0) {
        try {
          await loadFoods();
        } catch (error: any) {
          Toast.show({
            type: "error",
            text1: error.message,
            text2: "Error Fetching Foods",
          });
        }
      }
    };
    fetchFoods();
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        await fetchUserActivites();
      } catch (error: any) {
        Toast.show({
          type: "error",
          text1: "Error!",
          text2: error.message,
        });
      }
    };
    fetchActivities();
  }, []);

  return (
    <ScrollView
      style={[styles.mainContainer]}
      contentContainerStyle={{}}
      showsVerticalScrollIndicator={false}
    >
      {/* Calories Chart */}
      <View>
        <Animated.ScrollView
          snapToInterval={ITEM_WIDTH}
          decelerationRate="fast"
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: "row",
            gap: 8, // optional, spacing between cards
            paddingHorizontal: 6,
            padding: 5,
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <View style={styles.scrollViewCard}>
            <Text variant="headlineMedium" style={mainStyles.cardTitle}>
              Calories
            </Text>
            <CaloriesProgressChart></CaloriesProgressChart>
          </View>

          {/* Macros Chart */}
          <View style={styles.scrollViewCard}>
            <Text variant="headlineMedium" style={mainStyles.cardTitle}>
              Macros
            </Text>
            <MacrosProgressChart />
          </View>
        </Animated.ScrollView>
        <PagerDots scrollX={scrollX} itemWidth={ITEM_WIDTH} itemCount={2} />
      </View>
      <Button onPress={() => logOut()}>log out</Button>

      {/* Cards container (Every card but those from Horizontal ScrollView) */}
      <View style={styles.cardsContainer}>
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
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.lvBackground,
    paddingBottom: 30,
  },
  cardsContainer: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  flexRowCardsContainer: {
    flexDirection: "row",
    gap: 20,
    alignItems: "stretch",
  },
  scrollViewCard: {
    padding: 2,
    backgroundColor: colors.lvGradientCard,
    borderRadius: 20,
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
    elevation: 4,
  },
});
