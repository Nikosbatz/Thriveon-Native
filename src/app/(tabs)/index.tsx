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
import mobileAds, {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { ActivityIndicator } from "react-native-paper";
import Animated, {
  FadeInDown, // 1. Import the Layout Animation preset
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  useEffect(() => {
    // Initialize the Google Mobile Ads SDK once at app startup
    mobileAds()
      .initialize()
      .then((adapterStatuses) => {
        console.log("AdMob SDK Initialized!");
      });
  }, []);

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

  const adUnitId = __DEV__
    ? TestIds.BANNER
    : "ca-app-pub-1585134683654035/3880709294";

  return (
    <LinearGradient
      // colors={["#085062", "#073854", "#081728", "#040c1d", "#020212"]}
      colors={["#090F1D", "#090F1D", "#090F1D", "#090F1D", "#090F1D"]}
      locations={[0, 0.05, 0.4, 0.5, 1]}
      style={{ flex: 1 }}
    >
      <CustomHeader scrollY={scrollY} />

      {/* 2. Wrap the ScrollView inside an Animated.View with entering prop */}
      <Animated.View
        entering={FadeInDown.duration(800)
          .delay(200)
          .withInitialValues({
            transform: [{ translateY: 200 }], // Increase this number to make the slide distance bigger
            opacity: 1, // Keep opacity starting at 1
          })}
        style={{ flex: 1 }}
      >
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          style={[styles.mainContainer]}
          contentContainerStyle={{
            paddingTop: 100,
            paddingBottom:
              mainStyles.mainContainer.paddingBottom + insets.bottom,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Calendar */}
          <CalendarView />

          {/* Calories Chart */}
          <View
            style={[
              {
                marginTop: 15,
                width: "96%",
                alignSelf: "center",
                maxWidth: 600,
              },
            ]}
          >
            <CaloriesProgressChart />
          </View>

          {/* Cards container */}
          <View style={styles.cardsContainer}>
            {/* Macros Cards */}
            <View
              style={{
                maxWidth: 600,
                width: "100%",
              }}
            >
              <DashboardMacroCards />
            </View>

            <BannerAd
              unitId={adUnitId}
              size={BannerAdSize.BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />

            {/* Row 2-Cards Container */}
            <View style={styles.flexRowCardsContainer}>
              <View style={{ flex: 1, maxWidth: "50%" }}>
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
      </Animated.View>

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
            size={45}
            color={colors.lvPrimaryLight}
            style={{ flex: 1, alignSelf: "center" }}
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
    alignItems: "center",
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    gap: 10,
  },
  flexRowCardsContainer: {
    flexDirection: "row",
    gap: 20,
    alignItems: "stretch",
    justifyContent: "center",
  },
});
