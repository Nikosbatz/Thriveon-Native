import { useAuth } from "@/src/context/authContext";
import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [errorText, setErrorText] = useState<string | null>("");
  const theme = useTheme();
  const { signUp, signIn, user, isLoggedIn, setIsLoggedIn } = useAuth();
  const router = useRouter();

  function handleSwitchMode() {
    setIsSignUp((prev) => !prev);
  }

  async function handleAuth() {
    if (!emailInput || !passwordInput) {
      setErrorText("Please fill all the form fields");
      return;
    } else if (passwordInput.length < 6) {
      setErrorText("Password must contain more than 6 characters");
      return;
    }
    if (isSignUp) {
      try {
        await signUp(emailInput, passwordInput);
        //setIsLoggedIn(true);
      } catch (error: any) {
        setErrorText(error.message);
        return;
      }
    } else {
      try {
        await signIn(emailInput, passwordInput);
      } catch (error: any) {
        setErrorText(error.message);
        return;
      }
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
    >
      <View style={styles.content}>
        <Text>Create Account</Text>
        <TextInput
          label="email"
          keyboardType="email-address"
          placeholder="example@email.com"
          mode="outlined"
          style={styles.input}
          onChangeText={setEmailInput}
        ></TextInput>
        <TextInput
          label="password"
          keyboardType="default"
          secureTextEntry
          placeholder="enter password"
          mode="outlined"
          style={styles.input}
          onChangeText={setPasswordInput}
        ></TextInput>
        {errorText ? (
          <Text style={{ color: theme.colors.error }}>{errorText}</Text>
        ) : null}
        <Button
          mode="contained"
          icon={isSignUp ? "account-plus" : "login"}
          style={styles.button}
          onPress={handleAuth}
        >
          {" "}
          {isSignUp ? "Sign Up" : "Sign In"}{" "}
        </Button>
        <Button mode="text" onPress={handleSwitchMode}>
          {" "}
          {isSignUp
            ? "Already have an account? Sign In"
            : "Dont have an account? Sign Up"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  input: {
    marginBottom: 10,
  },
  button: {
    backgroundColor: "rgba(13, 96, 92, 1)",
  },
});
