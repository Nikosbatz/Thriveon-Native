import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { View } from "react-native";

export default function MenuModal() {
  const [selectedValue, setSelectedValue] = useState("java");
  // renders
  return (
    <View>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
        style={{ height: 50, width: 200 }}
        mode="dropdown" // Android only
      >
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
        <Picker.Item label="Python" value="python" />
      </Picker>
    </View>
  );
}
