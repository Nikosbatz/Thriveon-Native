import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { Stack } from "expo-router";

export default function Layout() {
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

        // popToTopOnBlur: true,
      }}
    >
      <Stack.Screen name="index" options={{ title: "My Profile" }} />
      <Stack.Screen name="editUserInfo" options={{ title: "Edit My Info" }} />
    </Stack>
  );
}
