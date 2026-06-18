import { colors } from "@/src/theme/colors";
import { Dispatch, SetStateAction } from "react";
import {
  KeyboardTypeOptions,
  StyleProp,
  TextInput,
  TextStyle,
  View,
} from "react-native";
import { Divider, Text } from "react-native-paper";

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
        backgroundColor: colors.lvFoodCardBg,
        borderRadius: 10,
        padding: 10,
      }}
    >
      <Text
        variant="labelLarge"
        style={{ color: "rgb(255, 255, 255)", fontSize: 16, width: "55%" }}
      >
        {label}
      </Text>
      <Divider
        style={{
          height: "100%",
          width: 1,
          backgroundColor: "gray",
          marginLeft: 10,
        }}
      />
      <TextInput
        value={input}
        onChangeText={setInput}
        style={[
          {
            color: "white",
            backgroundColor: "transparent",
            flex: 1,
            textAlign: "right",
            fontSize: 20,
          },
          style,
        ]}
        keyboardType={keyboardType ?? "default"}
        placeholder={placeholder}
        placeholderTextColor={"rgb(157, 157, 157)"}
      ></TextInput>
    </View>
  );
}
