import { colors } from "@/src/theme/colors";
import { Image, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function SplashScreen() {
  return (
    <View
      style={{ flex: 1, backgroundColor: "#0c111a", justifyContent: "center" }}
    >
      <Image
        source={require("@/assets/images/logo_transparent.png")}
        style={{
          width: 170,
          height: 170,
          alignSelf: "center",
        }}
      ></Image>
      <ActivityIndicator
        style={{
          position: "absolute",
          left: "50%",
          bottom: 200,
          transform: [{ translateX: "-50%" }],
        }}
        size={40}
        color={colors.lvPrimaryLight}
      />
    </View>
  );
}
