import { colors } from "@/src/theme/colors";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function Plan() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.lvBackground,
        paddingTop: 50,
        paddingHorizontal: 5,
        alignContent: "center",
      }}
    >
      <Text
        variant="headlineMedium"
        style={{ color: colors.lvPrimaryLight, textAlign: "center" }}
      >
        Your plan is ready
      </Text>
    </View>
  );
}
