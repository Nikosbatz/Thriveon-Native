import { colors } from "@/src/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import React, { useRef } from "react";
import { Animated, GestureResponderEvent, StyleSheet } from "react-native";
import { TouchableRipple } from "react-native-paper"; // Assuming React Native Paper based on TouchableRipple

export default function BottomBarPlus({
  onPress,
  accessibilityRole,
  accessibilityLabel,
  testID,
}: BottomTabBarButtonProps) {
  // 1. Initialize scale and color animation values
  const scaleValue = useRef(new Animated.Value(1)).current;
  const colorProgress = useRef(new Animated.Value(0)).current;

  function onButtonPress(e: GestureResponderEvent) {
    // Reset color progress back to 0 before running the sequence
    colorProgress.setValue(0);

    Animated.parallel([
      // --- SCALE ANIMATION (Native Driver) ---
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.3, // Grow to 130% size
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1, // Snap back to original size
          friction: 3,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Call the original onPress prop if it exists
    if (onPress) onPress(e);
  }

  // 2. Map the 0-1 colorProgress value to actual color values
  const backgroundColor = colorProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.lvPrimary, colors.lvPrimary20], // Replace '#1A5255' with your desired active color
  });

  return (
    /* 3. Change TouchableRipple to an Animated component so it can accept the animated background color */
    <Animated.View
      style={[styles.container, { backgroundColor: backgroundColor }]}
    >
      <TouchableRipple
        onPress={(e) => onButtonPress(e)}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
        rippleColor={"rgba(8, 34, 35, 0.74)"}
        style={styles.rippleFill}
        borderless
      >
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <AntDesign name="plus" size={22} color={colors.lvSecondary} />
        </Animated.View>
      </TouchableRipple>
    </Animated.View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     position: "absolute",
//     left: "50%",
//     top: -15,
//     transform: [{ translateX: -16.5 }], // Half of container width (padding 15 * 2 + icon 22) / 2
//     borderRadius: 50,
//     overflow: "hidden", // Ensures ripple/background stays rounded
//     elevation: 4, // Optional: gives the floating action button depth
//   },
//   rippleFill: {
//     padding: 15, // Keep padding inside the ripple container so the entire button is pressable
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });
const styles = StyleSheet.create({
  wrapper: {},
  container: {
    position: "absolute",
    left: "50%",
    top: -15,
    transform: [{ translateX: "-50%" }], // Half of container width (padding 15 * 2 + icon 22) / 2
    borderRadius: 50,
    overflow: "hidden", // Ensures ripple/background stays rounded
    elevation: 4, // Optional: gives the floating action button depth
  },
  rippleFill: {
    padding: 15, // Keep padding inside the ripple container so the entire button is pressable
    justifyContent: "center",
    alignItems: "center",
  },
});
