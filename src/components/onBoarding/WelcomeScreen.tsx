import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.mainContainer}>
      <View
        style={{
          borderRadius: 20,
          borderBottomWidth: 2,
          borderColor: colors.lvPrimary50,
        }}
      >
        <Image
          source={require("../../../assets/images/man_working_out.png")}
          style={{
            width: screenWidth,
            height: 370,
            alignSelf: "center",
            borderRadius: 0,
          }}
        ></Image>
      </View>
      <View style={styles.textContentContainer}>
        {/* Headlines */}
        <View>
          <Text
            variant="headlineLarge"
            style={{ color: "white", fontSize: 28 }}
          >
            Welcome to
          </Text>
          <Text
            variant="headlineLarge"
            style={{ color: colors.lvPrimary, fontSize: 40 }}
          >
            Thrive on
          </Text>
        </View>

        {/* Card with text */}
        <View
          style={[
            mainStyles.dashboardCard,
            {
              padding: 20,
              gap: 15,
              borderWidth: 1,
              borderColor: colors.cardBorderColor,
              backgroundColor: colors.lvHeader,
            },
          ]}
        >
          <Text
            variant="headlineSmall"
            style={{ color: "white", fontSize: 20, lineHeight: 25 }}
          >
            Keep track of your health effortlessly
          </Text>
          <Text
            variant="labelLarge"
            style={{ color: "rgb(180, 180, 180)", fontSize: 17 }}
          >
            Thrive on is the ultimate tool for calorie tracking and nutrition
            insights. Precision meets simplicity.
          </Text>
        </View>
      </View>
      <Button
        mode="contained"
        onPress={() => router.push("/(onBoarding)/infoFormScreen")}
        icon={() => <ArrowRight></ArrowRight>}
        style={{
          backgroundColor: colors.lvPrimary,
          position: "absolute",
          bottom: 0,
          marginBottom: insets.bottom + 5,
          left: "50%",
          transform: [{ translateX: "-50%" }],
          width: "80%",
        }}
        textColor={colors.lvBackground}
      >
        Get Started
      </Button>
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
