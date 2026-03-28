import { colors } from "@/src/theme/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
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
      rippleColor={"rgba(17, 63, 65, 0.74)"}
      style={styles.container}
      borderless
    >
      <AntDesign name="plus" size={28} color={colors.lvSecondary} />
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  wrapper: {},
  container: {
    padding: 7,
    position: "absolute",
    left: "50%",
    top: 2,
    transform: [{ translateX: "-50%" }],
    backgroundColor: colors.lvPrimary, // required for ripple
    borderRadius: 50,
    overflow: "hidden", // required for ripple
  },
});
