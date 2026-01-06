import BottomBarPlus from "@/src/components/UI/BottomBarPlus";
import { useAuth } from "@/src/context/authContext";
import { colors } from "@/src/theme/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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
        tabBarStyle: { backgroundColor: colors.lvSecondary, marginBottom: 0 },
        freezeOnBlur: true,
        headerStatusBarHeight: 35,
        headerStyle: {
          backgroundColor: colors.lvBackground,
          elevation: 0,
        },
        lazy: true,
        headerTitleStyle: {
          color: colors.lvBackground,
          textAlign: "center",
          fontSize: 25,
          backgroundColor: colors.primary,
          padding: 5,
          borderRadius: 25,
        },
        headerTitleAlign: "center",
        // popToTopOnBlur: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}
