import BottomBarPlus from "@/src/components/UI/BottomBarPlus";
import { useAuth } from "@/src/context/authContext";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Redirect, Tabs } from "expo-router";
import { Platform, Pressable, StyleProp, ViewStyle } from "react-native";

export default function TabsLayout() {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href={"/(auth)/auth"} />;
  } else if (!user?.isVerified) {
    return <Redirect href={"/(auth)/verifyUser"} />;
  } else if (!user?.onBoardingCompleted) {
    return <Redirect href={"/(onBoarding)/welcomeScreen"} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarButton: (props) => {
          // Destructure to separate the problematic 'style' and 'children'
          // from the rest of the navigation props.
          const { style, children, ...rest } = props;

          return (
            <Pressable
              {...rest} // Spread the navigation logic (onPress, etc.)
              android_ripple={{
                color: "rgba(125, 125, 125, 0.52)",
                borderless: false,
                foreground: true,
                radius: 60,
              }}
              // Map the style correctly to the Pressable state
              style={({ pressed }): StyleProp<ViewStyle> => [
                style as ViewStyle, // Cast the incoming style from the tab bar
                {
                  opacity: pressed && Platform.OS === "ios" ? 0.6 : 1,
                  // Ensure the button fills the space correctly
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              {children}
            </Pressable>
          );
        },
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
      <Tabs.Screen
        name="cameraScreen"
        options={{
          href: null,
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}
