import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name={"auth"}></Stack.Screen>
      <Stack.Screen name={"verifyUser"}></Stack.Screen>
    </Stack>
  );
}
