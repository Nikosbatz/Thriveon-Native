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
        headerShown: false,
        // popToTopOnBlur: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Recipes", headerShown: false }}
      />

      {/* Recipe Details Screen */}
      <Stack.Screen
        name="recipeDetails"
        options={{
          title: "Recipe Details",
          presentation: "card", // Options: "card" (slide right) or "modal" (slide up)
          animation: "slide_from_right",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
