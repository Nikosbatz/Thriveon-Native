import { Picker } from "@react-native-picker/picker";
import React, { Dispatch, SetStateAction, useState } from "react";
import { View } from "react-native";

type Props = {
  labels: string[];
  setActivityType: Dispatch<SetStateAction<string>>;
  activityType: string;
  height: number;
  width: number;
};

export default function MenuModal(props: Props) {
  const [selectedValue, setSelectedValue] = useState("");
  // renders
  return (
    <View>
      <Picker
        selectedValue={props.activityType}
        onValueChange={(itemValue, itemIndex) =>
          props.setActivityType(itemValue)
        }
        style={{ height: props.height, width: props.width }}
        mode="dropdown" // Android only
      >
        {props.labels.map((label) => (
          <Picker.Item label={label} value={label.toLowerCase()} />
        ))}
      </Picker>
    </View>
  );
}
