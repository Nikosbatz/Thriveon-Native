import { DimensionValue, StyleSheet, View } from "react-native";

type ProgressBarProps = {
  width: DimensionValue;
  height: DimensionValue;
  unfilledColor: string;
  filledColor: string;
  currentValue: number;
  targetValue: number;
};

export default function ProgressBar(props: ProgressBarProps) {
  const currentValuePercentage =
    Math.floor((props.currentValue / props.targetValue) * 100) > 100
      ? 100
      : Math.floor((props.currentValue / props.targetValue) * 100);

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          width: props.width,
          height: props.height,
          minHeight: 15,
          backgroundColor: props.unfilledColor,
          borderRadius: 8,
        }}
      >
        {/* Filled Bar */}
        <View
          style={{
            borderRadius: 8,
            height: "100%",
            backgroundColor: props.filledColor,
            width: `${currentValuePercentage}%`,
          }}
        ></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
