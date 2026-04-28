import BottomBarPlus from "@/src/components/UI/BottomBarPlus";
import CustomTabBar from "@/src/components/UI/CustomTabBar";
import { useAuth } from "@/src/context/authContext";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Redirect, Tabs, useSegments } from "expo-router";
import { Barcode } from "lucide-react-native";
import { Image, View } from "react-native";
import { Text } from "react-native-paper";

export default function TabsLayout() {
  const { isLoggedIn, user } = useAuth();
  const segments = useSegments();

  // Check if the current route contains a specific folder/file name
  // Example: app/(tabs)/home/[id].tsx -> segments would be ["(tabs)", "home", "[id]"]
  const hideOnScreens = ["cameraScreen"];
  const isHidden = segments.some((s) => hideOnScreens.includes(s));

  if (!isLoggedIn) {
    return <Redirect href={"/(auth)/auth"} />;
  } else if (!user?.isVerified) {
    return <Redirect href={"/(auth)/verifyUser"} />;
  } else if (!user?.onBoardingCompleted) {
    return <Redirect href={"/(onBoarding)/welcomeScreen"} />;
  }

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarBackground: () => colors.lvBackground,
        tabBarStyle: {
          display: isHidden ? "none" : "flex",
          backgroundColor: colors.lvSecondary,
          marginBottom: 0,
          borderTopColor: "rgba(91, 91, 91, 1)",
        },
        freezeOnBlur: false,
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
          title: "Home",
          headerShown: false,
          headerTitle: () => null,
          header: () => (
            <View
              style={{
                paddingTop: 35,
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
              }}
            >
              <Image
                source={require("@/assets/images/logo_transparent.png")}
                style={{
                  width: 70,
                  height: 42,
                }}
              ></Image>
              <View>
                <Text
                  variant="labelLarge"
                  style={{ color: "white", fontSize: 22 }}
                >
                  Thrive
                  <Text
                    variant="labelLarge"
                    style={{ color: colors.lvPrimary, fontSize: 22 }}
                  >
                    on
                  </Text>
                </Text>
                <Text style={{ color: "rgb(179, 179, 179)" }}>
                  Track. Grow. Thriveon.
                </Text>
              </View>
            </View>
          ),
          headerLeft: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 15,
                paddingVertical: 0,
                // backgroundColor: "blue",
                flex: 1,
                gap: 15,
              }}
            ></View>
          ),
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
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
        name="diaryScreen"
        options={{
          title: "Diary",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="book-search"
                size={size}
                color={color}
              />
            ) : (
              <MaterialCommunityIcons
                name="book-search-outline"
                size={size}
                color={color}
              />
            ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="calorieTracker"
        options={{
          title: "Log Food",
          tabBarButton: BottomBarPlus,
          headerShown: false,
          // tabBarIcon: ({ color, size, focused }) =>
          //   focused ? (
          //     <MaterialCommunityIcons
          //       name="book-search"
          //       size={size}
          //       color={color}
          //     />
          //   ) : (
          //     <MaterialCommunityIcons
          //       name="book-search-outline"
          //       size={size}
          //       color={color}
          //     />
          //   ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="cameraScreen"
        options={{
          title: "Scanner",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Barcode size={size} color={color} />
            ) : (
              <Barcode size={size} color={color} />
            ),
        }}
      ></Tabs.Screen>

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
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
