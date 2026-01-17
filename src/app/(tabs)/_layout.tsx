import BottomBarPlus from "@/src/components/UI/BottomBarPlus";
import { useAuth } from "@/src/context/authContext";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Redirect, Tabs } from "expo-router";

export default function TabsLayout() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href={"/(auth)/auth"} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.lvPrimary,
        tabBarStyle: {
          backgroundColor: colors.lvSecondary,
          marginBottom: 0,
          borderTopColor: "rgba(91, 91, 91, 1)",
        },
        freezeOnBlur: true,
        headerStatusBarHeight: 20,
        headerStyle: {
          backgroundColor: colors.lvBackground,
          elevation: 0,
        },

        lazy: true,
        headerTitleStyle: mainStyles.headerTitleStyle,
        headerTitleAlign: "center",
        // popToTopOnBlur: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              // <MaterialIcons name="dashboard" size={size} color={color} />
              <MaterialCommunityIcons
                name="view-dashboard"
                size={size}
                color={color}
              />
            ) : (
              <MaterialCommunityIcons
                name="view-dashboard-outline"
                size={size}
                color={color}
              />
            ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="calorieTracker"
        options={{
          title: "Today's Calories",
          tabBarButton: BottomBarPlus,
          headerShown: true,
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="profile"
        options={{
          title: "My Profile",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Ionicons name="person-circle-sharp" size={size} color={color} />
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={size}
                color={color}
              />
            ),
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}
