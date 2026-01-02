import { useAuth } from "@/src/context/authContext";
import { colors } from "@/src/theme/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Redirect, Tabs } from "expo-router";
import { useState } from "react";

export default function TabsLayout() {
  const { isLoggedIn } = useAuth();
  const [loadingTabs, setLoadingTabs] = useState(false);

  if (!isLoggedIn) {
    return <Redirect href={"/(auth)/auth"} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.lvPrimary80,
        tabBarStyle: { backgroundColor: colors.lvSecondary, marginBottom: 0 },
        tabBarPosition: "bottom",
        animation: "shift",
        freezeOnBlur: true,
        headerShown: true,
        headerStatusBarHeight: 35,
        headerStyle: {
          backgroundColor: colors.lvBackground,
          elevation: 0, // 👈 this is the real header background
        },
        lazy: false,
        headerTitleStyle: {
          color: colors.lvBackground,
          textAlign: "center",
          fontSize: 25,
          backgroundColor: colors.primary,
          padding: 5,
          borderRadius: 25,
        },
        headerTitleAlign: "center",
      }}
    >
      <Tabs.Protected guard={isLoggedIn}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Thriveon",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="dashboard" size={size} color={color} />
            ),
          }}
        ></Tabs.Screen>
        <Tabs.Screen
          name="calorieTracker"
          options={{
            title: "Today's Calories",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle-sharp" size={size} color={color} />
            ),
          }}
        ></Tabs.Screen>
        <Tabs.Screen
          name="profile"
          options={{
            title: "My Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="person-circle-outline"
                size={size}
                color={color}
              />
            ),
          }}
        ></Tabs.Screen>
      </Tabs.Protected>
    </Tabs>
  );
}
