import { colors } from "@/src/theme/colors";
import { Dispatch, SetStateAction } from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";

type CustomNumInput = {
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  label: string;
  unit: string;
};

export default function CustomNumInput(props: CustomNumInput) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text variant="labelLarge" style={{ color: "white", fontSize: 18 }}>
        {props.label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 10,
          width: "40%",
          gap: 5,
        }}
      >
        <TextInput
          style={[styles.textInput, { width: "80%" }]}
          mode="outlined"
          outlineColor="rgba(74, 74, 74, 1)"
          activeOutlineColor={colors.lightGrayText}
          placeholder={props.unit}
          textColor="white"
          cursorColor="white"
          keyboardType="number-pad"
          placeholderTextColor={colors.lightGrayText}
        ></TextInput>
        <Text variant="labelLarge" style={{ color: "white", fontSize: 17 }}>
          {props.unit}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: colors.lvGradientCard,
    height: 45,
    fontSize: 17,
    color: "white",
    borderRadius: 10,
  },
});
