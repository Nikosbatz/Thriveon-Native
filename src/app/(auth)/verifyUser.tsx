import { getEmailVerificationToken } from "@/src/api/requests";
import { useAuth } from "@/src/context/authContext";
import { colors } from "@/src/theme/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Mail } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  StyleSheet,
  TextInputKeyPressEventData,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";

export default function VerifyUser() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [codeResent, setCodeResent] = useState<boolean>(false);
  const inputRefs = useRef<Array<RNTextInput | null>>([]);
  const router = useRouter();
  const { email }: { email: string } = useLocalSearchParams();
  const { verifyUserEmail, userEmail, isLoggedIn, logOut } = useAuth();

  console.log(email);

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit();
    }
  }, [code]);

  async function handleSubmit() {
    const verificationCode = code.join("");

    try {
      await verifyUserEmail(verificationCode);
      Toast.show({
        type: "success",
        text1: "Successful verification!",
      });
      router.replace("/(tabs)");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message,
      });
    }
  }

  function handleKeyDown(
    index: number,
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleRequestVerificationCode() {
    setCodeResent(true);
    try {
      const res = await getEmailVerificationToken(email ?? userEmail);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message,
        text2: "Please Contact support if error persists",
      });
    }
  }

  function handleInputChange(index: number, value: string) {
    const newCode = [...code];
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  }

  async function handleBackToLogin() {
    if (isLoggedIn) {
      await logOut();
    }
    router.replace("/(auth)/auth");
  }
  return (
    <View style={styles.outerContainer}>
      <View
        style={{
          backgroundColor: colors.lvPrimary20,
          borderWidth: 2,
          borderColor: colors.lvPrimary,
          padding: 10,
          borderRadius: 20,
        }}
      >
        <Mail size={54} color={colors.lvPrimary80}></Mail>
      </View>
      <Text
        style={{
          color: "white",
          fontSize: 30,
          padding: 0,
          lineHeight: 40,
        }}
        variant="headlineLarge"
      >
        Verify Your Email
      </Text>
      <View style={styles.mainContainer}>
        <Text
          variant="bodyLarge"
          style={{ color: colors.lightWhiteText, textAlign: "center" }}
        >
          We have sent a one time password (OTP) to:{" "}
          <Text style={{ color: colors.lvPrimary }}>{email ?? userEmail}</Text>{" "}
          Please enter it below to verify your account
        </Text>
        <View style={styles.inputsContainer}>
          {code.map((digit, index) => (
            <TextInput
              mode="outlined"
              outlineColor="gray"
              activeOutlineColor="rgba(77, 77, 77, 1)"
              style={styles.textInput}
              key={index}
              ref={(el: RNTextInput | null) => {
                inputRefs.current[index] = el;
              }}
              value={digit}
              keyboardType="numeric"
              onChangeText={(text) => handleInputChange(index, text)}
              onKeyPress={(e) => handleKeyDown(index, e)}
            ></TextInput>
          ))}
        </View>
        <Button
          textColor={colors.lvBackground}
          style={{ backgroundColor: colors.lvPrimary }}
          mode="contained"
          disabled={codeResent}
          onPress={handleRequestVerificationCode}
        >
          Resend code
        </Button>
      </View>

      <Button
        icon="backburger"
        style={{}}
        textColor={colors.lvPrimary80}
        onPress={handleBackToLogin}
      >
        back to login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: colors.lvBackground,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  outerText: {
    fontSize: 22,
    marginBottom: 10,
    padding: 20,
  },
  mainContainer: {
    backgroundColor: "transparent",
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    margin: 20,
    paddingTop: 5,
    paddingBottom: 5,
  },

  textInput: {
    flex: 1,
    backgroundColor: colors.lvPrimary10,
    borderRadius: 20,
    textAlign: "center",
    fontSize: 20,
  },
  inputsContainer: {
    backgroundColor: "",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    width: "100%",
    padding: 20,
    margin: 0,
    gap: 5,
  },
});
