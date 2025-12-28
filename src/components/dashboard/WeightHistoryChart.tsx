import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { ArrowDown, ArrowUp, Plus } from "lucide-react-native";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Text } from "react-native-paper";

const screenWidth = Dimensions.get("window").width;

export default function WeightHistoryChart() {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(37, 228, 228, ${opacity})`, // optional
        strokeWidth: 4, // optional
      },
    ],
    //legend: ["Weight"], // optional
  };

  const currentWeight = 58;
  const weightTrend = 7;

  function handlePress() {
    console.log("Weight History View Pressed");
  }

  return (
    <TouchableOpacity activeOpacity={0.4} onPress={handlePress}>
      <View style={{ padding: 5, gap: 10 }}>
        {/* Header and Weight Trend texts at the top of the component */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text variant="headlineSmall" style={mainStyles.cardTitleSmall}>
            Weight history chart
          </Text>
          <View style={{ alignItems: "center" }}>
            <Plus
              size={26}
              color={"white"}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 8,
                alignSelf: "flex-end",
              }}
            ></Plus>
            {/* Weight Text */}
            <Text variant="headlineSmall" style={{ color: colors.lvPrimary }}>
              {currentWeight} Kg
            </Text>
            {weightTrend >= 0 ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ArrowDown color={"rgba(42, 213, 19, 1)"} />
                <Text
                  style={{
                    color: "rgba(42, 213, 19, 1)",
                  }}
                >
                  {weightTrend} kg this week
                </Text>
              </View>
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ArrowUp color={"rgba(255, 37, 37, 1)"} />
                <Text
                  style={{
                    color: "rgba(255, 37, 37, 1)",
                  }}
                >
                  {weightTrend} kg this week
                </Text>
              </View>
            )}
          </View>
        </View>
        <View
          style={{
            borderRadius: 25,
            backgroundColor: "",
            alignItems: "flex-start",
          }}
        >
          <LineChart
            data={data}
            width={screenWidth - 50}
            height={180}
            chartConfig={chartConfig}
            bezier
            withVerticalLines={false}
            formatYLabel={(label) => Number(label).toFixed(1)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

("rgba(59, 59, 59, 1)");

const chartConfig = {
  backgroundGradientFrom: "rgba(30, 41, 35, 0)",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "rgba(30, 41, 35, 0)",
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(230,230,230, ${opacity})`,
  useShadowColorFromDataset: true, // optional
};
