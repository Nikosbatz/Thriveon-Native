import useDebounce from "@/src/hooks/useDebounce";
import { colors } from "@/src/theme/colors";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";

type Props = {
  label: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
};

export default function CustomTextInput(props: Props) {
  const [localValue, setLocalValue] = useState(props.value);
  const debouncedEmail = useDebounce({
    value: localValue,
    delay: 500,
  });

  useEffect(() => {
    props.setValue(debouncedEmail);
  }, [debouncedEmail]);

  return (
    <View style={styles.textInfoPair}>
      <Text
        variant="labelLarge"
        style={{ color: colors.lightGrayText, marginStart: 15 }}
      >
        {props.label}
      </Text>
      <View style={styles.textInputContainer}>
        <TextInput
          value={localValue}
          onChangeText={setLocalValue}
          mode="outlined"
          style={styles.textInput}
          outlineColor="transparent"
          activeOutlineColor={"transparent"}
          placeholder={props.label}
          textColor="white"
          cursorColor="white"
          placeholderTextColor={colors.lightGrayText}
        ></TextInput>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textInfoPair: {
    gap: 5,
  },
  textInputContainer: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lightGrayText,
    overflow: "hidden",
  },
  textInput: {
    backgroundColor: colors.lvGradientCard,
    height: 45,
    fontSize: 17,
    color: "white",
    borderRadius: 10,
  },
});
