import { colors } from "@/src/theme/colors";
import { Dispatch, SetStateAction } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

type Props = {
  emailInput: string;
  setEmailInput: Dispatch<SetStateAction<string>>;
  handleEmailSubmit: () => void;
};

export default function EmailForm({
  emailInput,
  setEmailInput,
  handleEmailSubmit,
}: Props) {
  return (
    <View style={{ gap: 25 }}>
      <Text
        variant="labelLarge"
        style={{
          color: colors.lightWhiteText,
          fontSize: 16,
          textAlign: "center",
          marginTop: 5,
        }}
      >
        Enter your email address associeted with your account and we will send
        you a code to reset your password
      </Text>
      {/* Input Container */}
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
      {/* Submit Button */}
      <Button
        mode="contained"
        onPress={handleEmailSubmit}
        loading={false}
        disabled={false}
        // icon={ () => {<Reset></Reset>}}
        style={{
          backgroundColor: colors.lvPrimary,
          width: "80%",
          alignSelf: "center",
        }}
        textColor={colors.lvBackground}
      >
        <Text variant="labelLarge">Reset password</Text>
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
