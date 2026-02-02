import { colors } from "@/src/theme/colors";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";

export default function ForgotPasswordScreen() {
  const [emailInput, setEmailInput] = useState<string>("");

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 20,
        gap: 20,
        backgroundColor: colors.lvBackground,
      }}
    >
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
