import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import PagerDots from "../UI/PagerDots";
import CaloriesProgressChart from "./CaloriesProgressChart";
import MacrosProgressChart from "./MacrosProgessChart";

const ITEM_WIDTH = Dimensions.get("window").width - 50;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function DashboardHorizontalScrollView() {
  const scrollX = useRef(new Animated.Value(0)).current;
  return (
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
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.scrollViewCard}>
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
  );
}

const styles = StyleSheet.create({
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
