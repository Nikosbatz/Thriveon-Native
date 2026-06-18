import { colors } from "@/src/theme/colors";
import React, { useState } from "react";
import {
  Pressable,
  TextInput as RNTextInput,
  StyleSheet,
  View,
} from "react-native";
import { Text, TextInput } from "react-native-paper";

type Props = {
  label: string;
  unit: string;
  value: string;
  maxLength?: number;
  onChangeText: (text: string) => void;
};
export default function CustomNumInput(props: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const textInputRef = React.useRef<RNTextInput>(null);
  return (
    <View style={{ gap: 5, flexGrow: 1 }}>
      {/* Label */}
      <Text variant="labelLarge" style={styles.inputLabel}>
        {props.label}
      </Text>
      {/* TextInput Container */}
      <Pressable
        onPress={(e) => textInputRef.current?.focus()}
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
          backgroundColor: colors.lvPrimary20,
          width: "100%",
          borderRadius: 13,
          paddingRight: 5,
        }}
      >
        <TextInput
          ref={textInputRef}
          keyboardType="numeric"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          mode="outlined"
          value={props.value}
          onChangeText={(text) => props.onChangeText(text)}
          maxLength={props.maxLength}
          style={{
            backgroundColor: "transparent",
            color: "white",
            fontSize: 20,
            minWidth: 80,
            height: 45,
            flexGrow: 1,
          }}
          outlineColor="transparent"
          activeOutlineColor="transparent"
          textColor="white"
          cursorColor={"white"}
        />
        <Text
          variant="labelLarge"
          style={{
            color: isFocused ? "white" : "rgb(132, 132, 132)",
            fontSize: 20,
            lineHeight: 23,
          }}
        >
          {props.unit}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  inputLabel: {
    fontSize: 18,
    color: colors.lvPrimaryLight,
    lineHeight: 23,
  },
});
