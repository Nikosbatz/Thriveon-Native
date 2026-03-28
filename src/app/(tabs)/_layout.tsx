import BottomBarPlus from "@/src/components/UI/BottomBarPlus";
import CustomTabBar from "@/src/components/UI/CustomTabBar";
import { useAuth } from "@/src/context/authContext";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Redirect, Tabs, useSegments } from "expo-router";
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
        // tabBarButton: (props) => {
        //   const { style, children, ...rest } = props;

        //   return (
        //     <Pressable
        //       {...rest} // Spread the navigation logic (onPress, etc.)
        //       android_ripple={{
        //         color: "rgba(125, 125, 125, 0.52)",
        //         borderless: false,
        //         foreground: true,
        //         radius: 60,
        //       }}
        //       // Map the style correctly to the Pressable state
        //       style={({ pressed }): StyleProp<ViewStyle> => [
        //         style, // Cast the incoming style from the tab bar
        //         {
        //           opacity: pressed && Platform.OS === "ios" ? 0.6 : 1,
        //         },
        //       ]}
        //     >
        //       {children}
        //     </Pressable>
        //   );
        // },
        tabBarActiveTintColor: "white",
        tabBarBackground: () => colors.lvBackground,
        tabBarStyle: {
          display: isHidden ? "none" : "flex",
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
                source={require("@/assets/images/logo_chat.png")}
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
        name="calorieTracker"
        options={{
          title: "Today's Calories",
          tabBarButton: BottomBarPlus,
          headerShown: false,
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
