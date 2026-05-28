import { Dispatch, SetStateAction } from "react";
import {
  KeyboardTypeOptions,
  StyleProp,
  TextInput,
  TextStyle,
  View,
} from "react-native";
import { Text } from "react-native-paper";

type Props = {
  placeholder: string;
  label: string;
  style?: StyleProp<TextStyle>;
  keyboardType?: KeyboardTypeOptions;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
};

export default function TextInputWithLabel({
  placeholder,
  label,
  style,
  keyboardType,
  input,
  setInput,
}: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 7,
      }}
    >
      <Text
        variant="labelLarge"
        style={{ color: "rgb(197, 197, 197)", fontSize: 16 }}
      >
        {label}
      </Text>
      <TextInput
        value={input}
        onChangeText={setInput}
        style={[
          {
            color: "white",
            backgroundColor: "transparent",
            flex: 1,
            textAlign: "right",
            fontSize: 16,
          },
          style,
        ]}
        keyboardType={keyboardType ?? "default"}
        placeholder={placeholder}
        placeholderTextColor={"white"}
      ></TextInput>
    </View>
  );
}
