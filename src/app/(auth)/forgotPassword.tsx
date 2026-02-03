import { postForgotPasswordEmail } from "@/src/api/requests";
import EmailForm from "@/src/components/auth/forgotPassword/EmailForm";
import ResetTokenForm from "@/src/components/auth/forgotPassword/ResetTokenForm";
import { colors } from "@/src/theme/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import Toast from "react-native-toast-message";

export default function ForgotPasswordScreen() {
  const [emailInput, setEmailInput] = useState<string>("");
  const [showTokenForm, setShowTokenForm] = useState<boolean>(false);

  async function handleEmailSubmit() {
    console.log("handleEmailSubmit");
    try {
      await postForgotPasswordEmail(emailInput, "mobile");
      Toast.show({
        type: "success",
        text1: "Code sent! Check your email.",
      });
      setShowTokenForm(true);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Could not send reset code to email!",
      });
    }
  }

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 40,
        justifyContent: showTokenForm ? "flex-start" : "flex-start",
        gap: 0,
        backgroundColor: colors.lvBackground,
      }}
    >
      <View
        style={{
          backgroundColor: colors.lvPrimary20,
          borderWidth: 2,
          borderColor: colors.lvPrimary,
          padding: 10,
          borderRadius: 20,
          alignSelf: "center",
        }}
      >
        <MaterialIcons
          name="password"
          size={40}
          color={colors.lvPrimary80}
          style={{}}
        />
      </View>
      <Text
        variant="headlineMedium"
        style={{ color: "white", textAlign: "center" }}
      >
        Reset Password
      </Text>

      {!showTokenForm ? (
        <EmailForm
          emailInput={emailInput}
          setEmailInput={setEmailInput}
          handleEmailSubmit={handleEmailSubmit}
        />
      ) : (
        <ResetTokenForm />
      )}

      <Button onPress={() => setShowTokenForm((prev) => !prev)}>
        show form
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
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
