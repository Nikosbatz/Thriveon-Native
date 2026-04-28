import AuthContextProvider from "@/src/context/authContext";
import { colors } from "@/src/theme/colors";
import {
  DefaultTheme as NavDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Check, X } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  configureFonts,
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

// Change the background color of the app (Visible when a screen un-mounts)
const MyNavigationTheme = {
  ...NavDefaultTheme,
  colors: {
    ...NavDefaultTheme.colors,
    background: colors.lvBackground,
  },
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Quicksand: require("../../assets/fonts/Quicksand-VariableFont_wght.ttf"),
    QuicksandRegular: require("../../assets/fonts/Quicksand-Regular.ttf"),
    QuicksandBold: require("../../assets/fonts/Quicksand-SemiBold.ttf"),
  });

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <ThemeProvider value={MyNavigationTheme}>
          <AuthContextProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(onBoarding)" />
            </Stack>
          </AuthContextProvider>
        </ThemeProvider>
        <Toast visibilityTime={3000} config={toastConfig} />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const fontConfig = {
  fontFamily: "QuicksandRegular",
  bodyLarge: { fontFamily: "QuicksandRegular" },
  bodyMedium: { fontFamily: "QuicksandRegular" },
  bodySmall: { fontFamily: "QuicksandRegular" },

  headlineLarge: { fontFamily: "QuicksandBold" },
  headlineMedium: { fontFamily: "QuicksandBold" },
  headlineSmall: { fontFamily: "QuicksandBold" },
  labelLarge: { fontFamily: "QuicksandBold" },
  labelMedium: { fontFamily: "QuicksandBold" },
  labelSmall: { fontFamily: "QuicksandBold" },
};

const theme = {
  ...DefaultTheme,
  fonts: configureFonts({ config: fontConfig }),
};

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      renderLeadingIcon={() => (
        <View
          style={{
            padding: 7,
            alignSelf: "center",
            backgroundColor: "rgb(21, 154, 3)",
            borderRadius: 50,
            position: "absolute",
          }}
        >
          <Check size={30} color="white" />
        </View>
      )}
      contentContainerStyle={{
        paddingHorizontal: 0,
        alignItems: "center",
        justifyContent: "center",
      }}
      style={{
        padding: 0,
        borderLeftColor: "rgba(30, 215, 6, 0)",
        backgroundColor: "rgba(13, 93, 2, 0)",
        elevation: 0,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
      text1Style={{ fontSize: 17, color: "white", textAlign: "center" }}
      text2Style={{ fontSize: 13, color: "rgb(227, 227, 227)" }}
      text2NumberOfLines={5}
      text1NumberOfLines={3}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      renderLeadingIcon={() => (
        <View
          style={{
            justifyContent: "center",
            padding: 3,
            marginLeft: 5,
            alignSelf: "center",
            backgroundColor: "red",
            borderRadius: 50,
            marginRight: 5,
          }}
        >
          <X size={26} color="white" />
        </View>
      )}
      contentContainerStyle={{
        paddingHorizontal: 0,
      }}
      style={{
        borderLeftColor: theme.colors.error,
        backgroundColor: "rgb(136, 3, 3)",
        width: 300,
      }}
      text1Style={{ fontSize: 17, color: "white" }}
      text2Style={{ fontSize: 13, color: "rgb(230, 230, 230)" }}
      text2NumberOfLines={5}
      text1NumberOfLines={3}
    />
  ),
};
