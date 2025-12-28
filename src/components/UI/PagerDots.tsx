import { colors } from "@/src/theme/colors";
import React from "react";
import { Animated, View } from "react-native";

type PagerDotsProps = {
  scrollX: Animated.Value;
  itemCount: number;
  itemWidth: number;
  activeColor?: string;
  inactiveColor?: string;
  size?: number;
};

export default function PagerDots({
  scrollX,
  itemCount,
  itemWidth,
  activeColor = colors.lvPrimary,
  inactiveColor = "rgba(42, 62, 42, 1)",
  size = 8,
}: PagerDotsProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
      }}
    >
      {Array.from({ length: itemCount }).map((_, i) => {
        const inputRange = [
          (i - 1) * itemWidth,
          i * itemWidth,
          (i + 1) * itemWidth,
        ];

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.5, 1, 0.5],
          extrapolate: "clamp",
        });

        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [1, 1.5, 1],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={i}
            style={{
              width: size,
              height: size,
              borderRadius: 3,
              marginHorizontal: 4,
              backgroundColor: activeColor,
              opacity,
              transform: [{ scale }],
            }}
          />
        );
      })}
    </View>
  );
}
