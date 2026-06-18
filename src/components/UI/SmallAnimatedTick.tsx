import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface AnimatedTickProps {
  size?: number;
}

export default function SmallAnimatedTick({ size = 64 }: AnimatedTickProps) {
  // Shared values for handling the animations
  const scale = useSharedValue(0.8);
  const shineX = useSharedValue(-size);

  useEffect(() => {
    // 1. Pop the checkmark container up with a smooth, bouncy spring
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });

    // 2. Glide the shine gradient across the button after it scales up
    shineX.value = withDelay(100, withTiming(size, { duration: 650 }));
  }, [size]);

  // Bouncy pop-in style for the parent container
  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Gliding shine layer style
  const animatedShineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shineX.value }],
  }));

  // Dynamic sizing calculations
  const iconSize = size * 0.8;
  const borderRadius = size / 2;

  return (
    <Animated.View
      style={[
        styles.container,
        animatedContainerStyle,
        { width: size, height: size, borderRadius: borderRadius },
      ]}
    >
      {/* Icon Layer */}
      <Ionicons name="checkmark" size={iconSize} color="#FFFFFF" />

      {/* Shine Overlay Layer */}
      <View style={[styles.shineWrapper, { borderRadius }]}>
        <Animated.View
          style={[StyleSheet.absoluteFillObject, animatedShineStyle]}
        >
          <LinearGradient
            colors={[
              "rgba(255, 255, 255, 0.0)",
              "rgba(255, 255, 255, 0.15)",
              "rgba(255, 255, 255, 0.6)",
              "rgba(255, 255, 255, 0.15)",
              "rgba(255, 255, 255, 0.0)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#00E676", // Electric Green
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00E676",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    position: "relative",
    overflow: "visible",
  },
  shineWrapper: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden", // Masks the shine layer strictly inside the button frame
  },
  gradient: {
    flex: 1,
    width: "40%", // Narrow ribbon width to achieve a clean specular flash line
    height: "100%",
  },
});
