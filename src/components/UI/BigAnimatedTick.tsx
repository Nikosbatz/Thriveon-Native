import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

type Props = {
  visible: boolean;
  foodName: string;
};

// Create an animated version of the SVG Path
const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function BigAnimatedTick({ visible, foodName = "Food" }: Props) {
  // Shared values for animations
  const scale = useSharedValue(0);
  const progress = useSharedValue(1); // 1 means completely hidden, 0 means fully drawn

  useEffect(() => {
    if (visible) {
      // 1. Pop the green circle out with a spring effect
      scale.value = withSpring(1, { damping: 30, stiffness: 150 });

      // 2. Animate the path drawing after a short delay
      progress.value = withDelay(500, withTiming(0, { duration: 400 }));
    } else {
      // Reset state if visibility changes to false
      scale.value = 0;
      progress.value = 1;
    }
  }, [visible]);

  // Animated props to handle the SVG stroke-dashoffset trick
  const animatedProps = useAnimatedProps(() => {
    const LENGTH = 60; // Approximate length of the checkmark path
    return {
      strokeDashoffset: LENGTH * progress.value,
    };
  });

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        {/* Green Circle Container */}
        <View style={styles.circle}>
          <Svg width="50" height="50" viewBox="0 0 24 24">
            <AnimatedPath
              d="M20 6L9 17L4 12" // Standard checkmark path
              fill="none"
              stroke="white"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="60" // Matches our length constant
              animatedProps={animatedProps}
            />
          </Svg>
        </View>

        <Text style={styles.successText}>Logged!</Text>
        <Text style={styles.subText}>{foodName} added to your day.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)", // Dim the background slightly
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 24,
    alignItems: "center",
    width: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8, // Android shadow
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#34D399", // Beautiful emerald green
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});
