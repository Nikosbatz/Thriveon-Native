import { useAuth } from "@/src/context/authContext";
import { colors } from "@/src/theme/colors";
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
} from "@react-native-google-signin/google-signin";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Button, Divider, Text, TextInput, useTheme } from "react-native-paper";

GoogleSignin.configure({
  // UPDATED to match your screenshot image_45d865.png
  webClientId:
    "580194576437-t4bmg92pbh6a3mni97n6fi4v3s6k5a70.apps.googleusercontent.com",
  offlineAccess: true,
});

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const { signUp, signIn, isLoggedIn, googleSignIn } = useAuth();
  const router = useRouter();

  async function handleAuth() {
    setIsLoading(true);
    if (!emailInput || !passwordInput) {
      setErrorText("Please fill all the form fields");
      setIsLoading(false);
      return;
    } else if (passwordInput.length < 6) {
      setErrorText("Password must contain more than 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      await signIn(emailInput, passwordInput);
    } catch (error: any) {
      setErrorText(error.message);
      setIsLoading(false);
      return;
    }

    setErrorText(null);
  }

  async function handleGoogleSignIn() {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;
      const email = response.data?.user.email;
      // console.log(response.data?.user);
      if (idToken && email) {
        await googleSignIn(response.data);
      } else {
        alert("Could not sign in with Google...");
      }
    } catch (error: any) {
      if (isErrorWithCode(error)) {
        console.log(error.stack);
      } else {
        alert(error.message);
      }
    }
  }

  // Redirect user if he is already Logged in
  if (isLoggedIn) {
    return <Redirect href={"/(tabs)"} />;
  }

  return (
    <LinearGradient
      // colors={["#130646", "#172e83", "#105b7e", "#131e32", "#0a0f17"]}
      // locations={[0, 0.1, 0.2, 0.5, 1]}
      colors={["#085062", "#073854", "#080722", "#020212", "#020212"]}
      locations={[0, 0.05, 0.4, 0.5, 1]}
      style={{
        flex: 1,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        style={styles.container}
        contentContainerStyle={{}}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: 10,
            paddingVertical: 20,
            gap: 20,
          }}
        >
          {/* Logo and Slogan container */}
          <View
            style={{
              width: "100%",
              padding: 20,
              gap: 10,
            }}
          >
            <Image
              source={require("@/assets/images/logo_transparent.png")}
              style={{
                width: 100,
                height: 100,
                alignSelf: "center",
                borderRadius: 50,
              }}
            ></Image>
            <Text
              variant="headlineLarge"
              style={{
                color: colors.lvPrimaryLight,
                fontSize: 31,
                width: "100%",
                textAlign: "center",
              }}
            >
              Thriveon
            </Text>
            <Text
              variant="labelLarge"
              style={{
                color: colors.lightWhiteText,
                alignSelf: "center",
                fontSize: 17,
                width: "100%",
                textAlign: "center",
              }}
            >
              Track Grow Thriveon
            </Text>
          </View>

          {/* Email Input */}
          <View>
            <Text variant="labelLarge" style={styles.textInputLabel}>
              Email Address
            </Text>
            <TextInput
              disabled={false}
              value={emailInput}
              onChangeText={setEmailInput}
              mode="outlined"
              style={styles.textInput}
              activeOutlineColor={colors.lvPrimary50}
              outlineStyle={{ borderRadius: 25 }}
              outlineColor={colors.lvPrimary20}
              placeholder={"name@example.com"}
              textColor="white"
              cursorColor="white"
              placeholderTextColor={colors.lightGrayText}
            ></TextInput>
          </View>

          {/* Password Input */}
          <View>
            <Text variant="labelLarge" style={styles.textInputLabel}>
              Password
            </Text>
            <TextInput
              disabled={false}
              value={passwordInput}
              onChangeText={setPasswordInput}
              mode="outlined"
              style={styles.textInput}
              secureTextEntry={!passwordVisible}
              activeOutlineColor={colors.lvPrimary50}
              outlineColor={colors.lvPrimary20}
              outlineStyle={{ borderRadius: 25 }}
              placeholder={"********"}
              textColor="white"
              cursorColor="white"
              placeholderTextColor={colors.lightGrayText}
              right={
                <TextInput.Icon
                  icon={() =>
                    passwordVisible ? (
                      <Eye color={colors.lvPrimary80} size={20} />
                    ) : (
                      <EyeOff color={colors.lvPrimary80} size={20} />
                    )
                  }
                  onPress={() => setPasswordVisible((prev) => !prev)}
                />
              }
            ></TextInput>
            {/* Forgot Password button */}
            <Text
              variant="labelLarge"
              onPress={() => router.navigate("/(auth)/forgotPassword")}
              style={{
                color: colors.lightGrayText,
                marginTop: 5,
                textDecorationLine: "underline",
                fontSize: 12,
                width: "100%",
                textAlign: "right",
              }}
            >
              Forgot Password?
            </Text>
          </View>

          {errorText ? (
            <Text style={{ color: theme.colors.error }}>{errorText}</Text>
          ) : null}

          <Button
            mode="contained"
            onPress={handleAuth}
            loading={isLoading}
            disabled={isLoading}
            icon="login"
            style={{
              backgroundColor: colors.lvPrimary,
              width: "80%",
              alignSelf: "center",
            }}
            labelStyle={{ fontSize: 16 }}
            textColor={colors.lvBackground}
          >
            Sign In
          </Button>

          <Button
            mode="text"
            onPress={() => router.navigate("/(auth)/register")}
            labelStyle={{
              color: colors.lightWhiteText,
              fontSize: 14,
            }}
          >
            Don't have an account?
            <Text variant="labelLarge" style={{ color: colors.lvPrimaryLight }}>
              {" "}
              Sign Up
            </Text>
          </Button>
          {/* Alternative ways to login container */}
          <View style={{ gap: 10 }}>
            <Divider
              style={{
                width: "100%",
                backgroundColor: "rgba(173, 173, 173, 0.39)",
              }}
            />
            <Text
              variant="labelLarge"
              style={{
                color: "rgba(219, 219, 219, 0.97)",
                textAlign: "center",
                fontSize: 14,
              }}
            >
              or
            </Text>
            <GoogleSigninButton
              style={{ alignSelf: "center" }}
              size={GoogleSigninButton.Size.Standard}
              color={GoogleSigninButton.Color.Dark}
              onPress={handleGoogleSignIn}
              disabled={false}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    // justifyContent: "center",
    // alignItems: "center",
  },

  textInfoPair: {
    gap: 5,
  },
  textInputContainer: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lightGrayText,
    overflow: "hidden",
  },
  textInput: {
    backgroundColor: colors.lvPrimary10,
    height: 45,
    fontSize: 17,
    color: "white",
    borderRadius: 10,
  },
  textInputFocused: {},
  textInputLabel: {
    color: colors.lightWhiteText,
  },
});
