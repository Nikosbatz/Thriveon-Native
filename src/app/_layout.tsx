import AuthContextProvider from "@/src/context/authContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  configureFonts,
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

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
        <AuthContextProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
          </Stack>
        </AuthContextProvider>
        <Toast visibilityTime={2500} config={toastConfig} />
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
      style={{
        borderLeftColor: "rgba(30, 215, 6, 1)",
        borderLeftWidth: 15,
        backgroundColor: "rgba(51, 51, 51, 1)",
      }}
      text1Style={{ fontSize: 17, color: "white" }}
      text2Style={{ fontSize: 13, color: "rgba(192, 192, 192, 1)" }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: theme.colors.error,
        borderLeftWidth: 15,
        backgroundColor: "rgba(51, 51, 51, 1)",
      }}
      text1Style={{ fontSize: 17, color: "white" }}
      text2Style={{ fontSize: 13, color: "rgba(192, 192, 192, 1)" }}
    />
  ),
};
