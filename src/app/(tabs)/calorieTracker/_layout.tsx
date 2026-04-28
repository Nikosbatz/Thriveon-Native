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
      <Stack.Screen
        name="index"
        options={{ title: "Today foods", headerShown: false }}
      />
      <Stack.Screen
        name="cameraScreen"
        options={{
          title: "",
          headerTransparent: true, // This makes the header sit on top of your content
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: "transparent", // Ensures no solid color is blocking the blur
          },
        }}
      />
      <Stack.Screen name="barcodeFoodScreen" options={{ title: "" }} />
    </Stack>
  );
}
