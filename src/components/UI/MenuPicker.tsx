import { Picker } from "@react-native-picker/picker";
import React, { Dispatch, SetStateAction, useState } from "react";
import { DimensionValue, View } from "react-native";

type Props = {
  labels: string[];
  setSelectedValue: Dispatch<SetStateAction<string>>;
  selectedValue: string;
  height: DimensionValue;
  width: DimensionValue;
  backgroundColor: string;
  textColor: string;
};

export default function MenuPicker(props: Props) {
  const [selectedValue, setSelectedValue] = useState("");
  // renders
  return (
    <View>
      <Picker
        selectedValue={props.selectedValue}
        onValueChange={(itemValue, itemIndex) =>
          props.setSelectedValue(itemValue)
        }
        style={{
          height: props.height,
          width: props.width,
          backgroundColor: props.backgroundColor,
          color: props.textColor,
        }}
        mode="dropdown" // Android only
      >
        {props.labels.map((label) => (
          <Picker.Item label={label} value={label.toLowerCase()} />
        ))}
      </Picker>
    </View>
  );
}
