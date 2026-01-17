import { colors } from "@/src/theme/colors";
import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

type SliderProps = {
  value: number;
  onChangeValue: (num: number) => void;
  maxValue?: number;
  minValue?: number;
  objectKey: keyof MacrosKeys;
};

export default function AppSlider({
  value,
  onChangeValue,
  maxValue = 300,
  minValue = 0,
  objectKey,
}: SliderProps) {
  const theme = useTheme();
  const [localValue, setLocalValue] = useState(value);

  function handleSlidingComplete(val: number) {
    setLocalValue(val);
    onChangeValue(Number(localValue.toFixed(0)));
  }

  return (
    <View style={{ padding: 0 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 15,
        }}
      >
        <Text variant="labelLarge" style={{ color: "white", fontSize: 16 }}>
          {objectKey}
        </Text>
        <Text
          variant="labelLarge"
          style={{ color: colors.lvPrimary, fontSize: 18 }}
        >
          {Math.round(localValue)}
        </Text>
      </View>
      <Slider
        style={{ width: "100%", height: 20 }}
        minimumValue={minValue}
        maximumValue={maxValue}
        value={localValue}
        onValueChange={(value) => handleSlidingComplete(value)}
        // onSlidingComplete={handleSlidingComplete}

        // Material Design Styling:
        minimumTrackTintColor={colors.lvPrimaryLight}
        maximumTrackTintColor={theme.colors.surfaceVariant}
        thumbTintColor={colors.lvPrimary}
      />
    </View>
  );
}
