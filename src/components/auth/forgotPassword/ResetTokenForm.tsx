import { colors } from "@/src/theme/colors";
import { Eye, EyeOff } from "lucide-react-native";
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

export default function ResetTokenForm() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<RNTextInput | null>>([]);
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetCodeFull, setResetCodeFull] = useState(false);

  useEffect(() => {
    setResetCodeFull(false);
    if (code.every((digit) => digit !== "")) {
      setResetCodeFull(true);
    }
  }, [code]);

  async function handleSubmit() {
    if (password.length < 8) {
      Toast.show({
        type: "error",
        text1: "Password should be longer than 8 characters",
      });
    } else if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords should match",
      });
    }
    console.log("Submit");
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

  function handleKeyDown(
    index: number,
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  return (
    <View style={{ marginTop: 0 }}>
      <Text
        variant="labelLarge"
        style={{
          color: colors.lightWhiteText,
          textAlign: "center",
          fontSize: 16,
          marginTop: 5,
        }}
      >
        Enter below the code that was sent to your email and then choose your
        new password.
      </Text>
      {/* Code inputs container */}
      <View style={styles.inputsContainer}>
        {code.map((digit, index) => (
          <TextInput
            mode="outlined"
            outlineColor="gray"
            activeOutlineColor="rgba(77, 77, 77, 1)"
            textColor="white"
            cursorColor="white"
            style={styles.codeTextInput}
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
      {/* Password inputs container */}
      <View>
        <View>
          <Text variant="labelLarge" style={styles.textInputLabel}>
            New password
          </Text>
          <TextInput
            value={password}
            disabled={!resetCodeFull}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.textInput}
            activeOutlineColor={colors.lvPrimary50}
            secureTextEntry={!passwordVisible}
            outlineStyle={{ borderRadius: 25 }}
            outlineColor={colors.lvPrimary20}
            placeholder={"Enter Password"}
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
            Confirm password
          </Text>
          <TextInput
            disabled={!resetCodeFull}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            style={styles.textInput}
            activeOutlineColor={colors.lvPrimary50}
            secureTextEntry={!passwordVisible}
            outlineStyle={{ borderRadius: 25 }}
            outlineColor={colors.lvPrimary20}
            placeholder={"Confirm Password"}
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
      </View>
      <Button
        textColor={colors.lvBackground}
        style={{ backgroundColor: colors.lvPrimary, marginTop: 20 }}
        mode="contained"
        disabled={!resetCodeFull}
        onPress={handleSubmit}
      >
        Reset password
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  codeTextInput: {
    flex: 1,
    backgroundColor: colors.lvPrimary10,
    borderRadius: 20,
    textAlign: "center",
    fontSize: 20,
  },
  textInput: {
    backgroundColor: colors.lvPrimary10,
    height: 45,
    fontSize: 17,
    color: "white",
    borderRadius: 10,
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
  textInputLabel: {
    color: colors.lightWhiteText,
  },
});
