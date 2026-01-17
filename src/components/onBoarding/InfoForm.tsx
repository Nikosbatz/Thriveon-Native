import { colors } from "@/src/theme/colors";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function InfoForm() {
  return (
    <View style={styles.mainContainer}>
      <Text variant="headlineSmall" style={{ color: "white" }}>
        plan builder
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.lvBackground,
    paddingTop: 0,
    paddingHorizontal: 0,
    gap: 10,
  },
  textContentContainer: {
    gap: 10,
    paddingHorizontal: 15,
  },
});
