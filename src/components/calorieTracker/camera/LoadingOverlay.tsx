import { colors } from "@/src/theme/colors";
import { CheckCircle } from "lucide-react-native";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

export default function LoadingOverlay() {
  return (
    <View
      style={{
        position: "absolute",
        alignSelf: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: colors.lvBackground,
        gap: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Text
          variant="labelLarge"
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 25,
            lineHeight: 25,
          }}
        >
          Barcode scanned
        </Text>
        <CheckCircle size={35} color={"green"} />
      </View>
      <ActivityIndicator style={{}} size={50} color={colors.lvPrimaryLight} />
      <Text
        variant="labelLarge"
        style={{
          color: "rgba(250, 250, 250, 0.74)",
          alignSelf: "center",
          fontSize: 20,
          lineHeight: 22,
        }}
      >
        Loading your food...
      </Text>
    </View>
  );
}
