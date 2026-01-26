import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { Stack } from "expo-router";

export default function onBoardingLayout() {
  return (
    <Stack
      screenOptions={{
        freezeOnBlur: true,
        // headerStatusBarHeight: 35,
        headerShadowVisible: true,
        headerStyle: mainStyles.stackHeaderStyle,
        headerTitleStyle: mainStyles.headerTitleStyle,
        headerTitleAlign: "center",
        headerTintColor: colors.lvPrimaryLight,
      }}
    >
      <Stack.Screen
        name="welcomeScreen"
        options={{ headerShown: false, statusBarHidden: true }}
      />
      <Stack.Screen
        name="infoFormScreen"
        options={{ headerShown: false, statusBarHidden: true }}
      />
      <Stack.Screen
        name="activityFreqScreen"
        options={{ headerShown: false, statusBarHidden: true }}
      />
      <Stack.Screen
        name="planScreen"
        options={{ headerShown: false, statusBarHidden: true }}
      />
    </Stack>
  );
}
