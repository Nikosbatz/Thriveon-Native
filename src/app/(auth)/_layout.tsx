import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
    // screenOptions={{
    //   headerTitleStyle: mainStyles.headerTitleStyle,
    //   headerTitleAlign: "center",
    //   headerStyle: {
    //     backgroundColor: colors.lvBackground,
    //   },
    // }}
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name={"auth"}
      ></Stack.Screen>
      <Stack.Screen
        name={"register"}
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen name={"verifyUser"}></Stack.Screen>
    </Stack>
  );
}
