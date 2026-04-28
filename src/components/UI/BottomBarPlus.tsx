import { colors } from "@/src/theme/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { useRef } from "react";
import { Animated, GestureResponderEvent, StyleSheet } from "react-native";
import { TouchableRipple } from "react-native-paper";

export default function BottomBarPlus({
  onPress,
  onLongPress,
  accessibilityRole,
  accessibilityLabel,
  testID,
}: BottomTabBarButtonProps) {
  // 1. Initialize scale at 1 (normal size)
  const scaleValue = useRef(new Animated.Value(1)).current;

  function onButtonPress(e: GestureResponderEvent) {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.3, // Grow to 150% size
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1, // Snap back to original size
        friction: 3, // Adds a little "bounce" at the end
        useNativeDriver: true,
      }),
    ]).start();
    // Call the original onPress prop if it exists
    if (onPress) onPress(e);
  }

  return (
    <TouchableRipple
      onPress={(e) => onButtonPress(e)}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      rippleColor={"rgba(29, 100, 103, 0.74)"}
      style={[styles.container, { backgroundColor: colors.lvPrimary }]}
      borderless
    >
      {/* 4. Wrap the icon in an Animated.View */}
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <AntDesign name="plus" size={27} color={colors.lvSecondary} />
      </Animated.View>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
  container: {
    padding: 7,
    position: "absolute",
    left: "50%",
    top: 0,
    transform: [{ translateX: "-50%" }],
    backgroundColor: colors.lvPrimary, // required for ripple
    borderRadius: 50,
    overflow: "hidden", // required for ripple
  },
});
