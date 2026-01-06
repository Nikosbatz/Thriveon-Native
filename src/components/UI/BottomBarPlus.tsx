import { colors } from "@/src/theme/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import { TouchableRipple } from "react-native-paper";

export default function BottomBarPlus({
  onPress,
  onLongPress,
  accessibilityRole,
  accessibilityLabel,
  testID,
}: BottomTabBarButtonProps) {
  return (
    <TouchableRipple
      onPress={onPress}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      rippleColor={colors.lvPrimary50}
      style={styles.container}
      borderless
    >
      <Ionicons name="add-circle" size={65} color={colors.lvPrimary} />
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
  container: {
    position: "absolute",
    left: "50%",
    top: -15,
    transform: [{ translateX: "-50%" }],
    backgroundColor: colors.lvSecondary, // 🔴 required for ripple
    borderRadius: 40,
    overflow: "hidden", // 🔴 required for ripple
  },
});
