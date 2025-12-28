import {
  getEmailVerificationToken,
  postEmailVerificationToken,
} from "@/src/api/requests";
import { useAuth } from "@/src/context/authContext";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  StyleSheet,
  TextInputKeyPressEventData,
  View,
} from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";

export default function VerifyUser() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [codeResent, setCodeResent] = useState<boolean>(false);
  const inputRefs = useRef<Array<RNTextInput | null>>([]);
  const { userEmail, setUser } = useAuth();
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit();
    }
  }, [code]);

  async function handleSubmit() {
    const verificationCode = code.join("");

    try {
      await postEmailVerificationToken(verificationCode);
      Toast.show({
        type: "success",
        text1: "Email sent!",
        text2: "Please check your inbox.",
      });
      router.replace("/(tabs)");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message,
        text2: "Please request a new password",
      });
    }
  }

  function handleKeyDown(
    index: number,
    e: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) {
    console.log(e.nativeEvent.key);
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleRequestVerificationCode() {
    setCodeResent(true);
    try {
      const res = await getEmailVerificationToken(userEmail);
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
  return (
    <View style={styles.outerContainer}>
      <Text
        style={{
          color: theme.colors.primary,
          fontSize: 30,
          padding: 0,
          lineHeight: 40,
        }}
        variant="bodyLarge"
      >
        Verify Your Email
      </Text>
      <View style={styles.mainContainer}>
        <Text variant="bodyLarge">Enter your One Time Password here:</Text>
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
          textColor={"rgba(6, 151, 151, 1)"}
          style={styles.button}
          mode="contained"
          disabled={codeResent}
          onPress={handleRequestVerificationCode}
        >
          Get new OTP
        </Button>
      </View>

      <Button icon="backburger" onPress={() => router.replace("/(auth)/auth")}>
        Login Screen
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: "",
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
    backgroundColor: "rgba(215, 215, 215, 1)",
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    margin: 20,
    paddingTop: 5,
    paddingBottom: 5,
  },
  button: {
    backgroundColor: "rgba(238, 238, 238, 1)",
    borderRadius: 10,
    height: 40,
    padding: 0,
  },
  textInput: {
    flex: 1,
    backgroundColor: "rgba(189, 189, 189, 1)",
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
