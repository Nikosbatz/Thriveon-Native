import { useAuth } from "@/src/context/authContext";
import { colors } from "@/src/theme/colors";
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
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const { signUp, signIn, isLoggedIn } = useAuth();
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

  // Redirect user if he is already Logged in
  if (isLoggedIn) {
    return <Redirect href={"/(tabs)"} />;
  }

  return (
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
            source={require("@/assets/images/logo_chat.png")}
            style={{ width: 150, height: 90, alignSelf: "center" }}
          ></Image>
          <Text
            variant="headlineLarge"
            style={{
              color: colors.lvPrimaryLight,
              alignSelf: "center",
              fontSize: 30,
            }}
          >
            Thriveon
          </Text>
          <Text
            variant="labelLarge"
            style={{
              color: colors.lightWhiteText,
              alignSelf: "center",
              fontSize: 16,
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
              alignSelf: "flex-end",
              textDecorationLine: "underline",
              fontSize: 13,
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
          icon={"login"}
          style={{
            backgroundColor: colors.lvPrimary,
            width: "80%",
            alignSelf: "center",
          }}
          textColor={colors.lvBackground}
        >
          <Text variant="labelLarge">Sign In</Text>
        </Button>

        <Button
          mode="text"
          style={
            {
              // position: "absolute",
              // bottom: 30,
              // left: "50%",
              // transform: [{ translateX: "-50%" }],
            }
          }
          textColor={colors.lvPrimary80}
          onPress={() => router.navigate("/(auth)/register")}
        >
          <Text variant="labelLarge" style={{ color: colors.lightWhiteText }}>
            {"Don't have an account?"}
            <Text
              variant="labelLarge"
              style={{ color: colors.lvPrimary80, fontSize: 15 }}
            >
              {" "}
              {"Sign Up"}
            </Text>
          </Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lvBackground,
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
