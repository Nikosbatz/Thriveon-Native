import { useAuth } from "@/src/context/authContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Redirect, Tabs } from "expo-router";

export default function TabsLayout() {
  const { isLoggedIn } = useAuth();
  console.log("isLoggedIn: ", isLoggedIn);

  if (!isLoggedIn) {
    return <Redirect href={"/(auth)/auth"} />;
  }
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "rgba(2, 57, 96, 1)" }}>
      <Tabs.Protected guard={isLoggedIn}>
        <Tabs.Screen
          name="index"
          options={{
            title: "dashboard",
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
