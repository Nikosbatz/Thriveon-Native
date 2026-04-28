import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}></View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "transparent",
  },
});
