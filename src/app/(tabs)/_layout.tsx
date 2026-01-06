import BottomBarPlus from "@/src/components/UI/BottomBarPlus";
import { useAuth } from "@/src/context/authContext";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
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
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}
