import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { ArrowDown, ArrowUp, Plus } from "lucide-react-native";
import { useState } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Text } from "react-native-paper";
import WeightFormModal from "./WeightFormModal";

const screenWidth = Dimensions.get("window").width;

export default function WeightHistoryChart() {
  const [modalVisible, setModalVisible] = useState(false);
  const weightLogs = useUserLogsStore((s) => s.weightLogs);

  for (let log of weightLogs) {
    log.weight;
  }
  // Build arrays for chart data
  const labels = [];
  const weights = [];
  for (let log of weightLogs) {
    if (log.weight && log.date) {
      labels.push(log.date.slice(5));
      weights.push(log.weight);
    }
  }

  const safeWeights = weights.length > 0 ? weights : [0];
  const safeLabels = labels.length > 0 ? labels : [""];
  const data = {
    labels: safeLabels,
    datasets: [
      {
        data: safeWeights,
        color: (opacity = 1) => `rgba(37, 228, 228, ${opacity})`,
        strokeWidth: 4,
      },
    ],
  };

  // Calculate current weight and weight trend
  // const currentWeight = weightLogs?.at(-1)?.weight ?? 0;
  const currentWeight = weightLogs
    .filter((log: any) => log.weight !== null)
    .at(-1)?.weight;
  let weightTrend = 0;
  for (let log of weightLogs) {
    if (log.weight !== null) {
      weightTrend = currentWeight - log.weight;
      break;
    }
  }

  function handlePress() {
    setModalVisible(true);
  }

  return (
    <TouchableOpacity activeOpacity={0.4} onPress={handlePress}>
      <View
        style={{
          padding: 5,
          gap: 10,
          borderWidth: 0,
          backgroundColor: colors.lvDashboardCardBg,
          // borderLeftWidth: 1,
          // borderColor: colors.lvPrimary50,
          borderColor: "rgb(46, 47, 70)",
          borderRadius: 20,
          maxWidth: 600,
          alignSelf: "center",
        }}
      >
        {/* Header and Weight Trend texts at the top of the component */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            // backgroundColor: "#D946EF",
            // borderRadius: 10,
          }}
        >
          <Text variant="headlineSmall" style={mainStyles.cardTitleSmall}>
            WEIGHT HISTORY
          </Text>
          <View style={{ alignItems: "center" }}>
            <Plus
              size={26}
              color={"white"}
              style={{
                borderRadius: 8,
                position: "absolute",
                right: 5,
              }}
            ></Plus>
            {/* Weight Text */}
            <Text variant="headlineSmall" style={{ color: colors.lvPrimary }}>
              {currentWeight} Kg
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {weightTrend <= 0 ? (
                <ArrowDown color={"rgba(42, 213, 19, 1)"} />
              ) : (
                <ArrowUp color={"rgba(255, 37, 37, 1)"} />
              )}

              <Text
                style={{
                  color:
                    weightTrend <= 0
                      ? "rgba(42, 213, 19, 1)"
                      : "rgba(255, 37, 37, 1)",
                }}
              >
                {weightTrend.toFixed(1)} kg this week
              </Text>
            </View>
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
      <WeightFormModal visible={modalVisible} setVisible={setModalVisible} />
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
