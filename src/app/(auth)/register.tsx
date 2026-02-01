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
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [verifyPasswdInput, setVerifyPasswdInput] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const { signUp, isLoggedIn } = useAuth();
  const router = useRouter();

  async function handleSignUp() {
    setIsLoading(true);
    if (!emailInput || !passwordInput || !verifyPasswdInput) {
      setErrorText("Please fill all the form fields");
      setIsLoading(false);
      return;
    } else if (passwordInput.length < 6) {
      setErrorText("Password must contain more than 6 characters");
      setIsLoading(false);
      return;
    } else if (passwordInput !== verifyPasswdInput) {
      setErrorText("Passwords must match");
      setIsLoading(false);
      return;
    }
    //TODO: send sign up data to backend and navigate to verifyUser
    setErrorText(null);
    try {
      await signUp(emailInput, passwordInput);
      router.navigate({
        params: { email: emailInput },
        pathname: "/(auth)/verifyUser",
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Sign Up Error",
        text2: error.message,
      });
      setIsLoading(false);
    }
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
        </View>

        <View>
          <Text
            variant="headlineMedium"
            style={{ color: colors.lvPrimaryLight, alignSelf: "center" }}
          >
            Create an account
          </Text>
          <Text
            variant="labelLarge"
            style={{
              color: colors.lightWhiteText,
              alignSelf: "center",
              fontSize: 15,
            }}
          >
            Begin your welness journey with{" "}
            <Text
              variant="labelLarge"
              style={{ color: colors.lvPrimary80, fontSize: 18 }}
            >
              Thriveon
            </Text>
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
        </View>
        <View>
          <Text variant="labelLarge" style={styles.textInputLabel}>
            Confirm Password
          </Text>
          <TextInput
            disabled={false}
            value={verifyPasswdInput}
            onChangeText={setVerifyPasswdInput}
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
        </View>

        {errorText ? (
          <Text style={{ color: theme.colors.error }}>{errorText}</Text>
        ) : null}

        <Button
          mode="contained"
          onPress={handleSignUp}
          loading={isLoading}
          disabled={isLoading}
          icon={"account-plus"}
          style={{
            backgroundColor: colors.lvPrimary,
            width: "80%",
            alignSelf: "center",
          }}
          textColor={colors.lvBackground}
        >
          {"Sign Up"}
        </Button>

        <Button
          mode="text"
          textColor={colors.lvPrimary80}
          onPress={() => router.navigate("/(auth)/auth")}
        >
          <Text variant="labelLarge" style={{ color: colors.lightWhiteText }}>
            {"Already have an account?"}
            <Text variant="labelLarge" style={{ color: colors.lvPrimary80 }}>
              {" "}
              {"Sign In"}
            </Text>
          </Text>
        </Button>

        <Button
          mode="text"
          textColor={colors.lvPrimary80}
          onPress={() =>
            router.navigate({
              params: { email: emailInput },
              pathname: "/(auth)/verifyUser",
            })
          }
        >
          /verifyuser
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lvBackground,
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
