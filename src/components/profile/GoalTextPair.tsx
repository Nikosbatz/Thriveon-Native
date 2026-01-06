import { colors } from "@/src/theme/colors";
import { View } from "react-native";
import { Divider, Text } from "react-native-paper";

type Props = {
  goalKey:
    | keyof UserInterface["healthGoals"]
    | keyof UserInterface["nutritionGoals"];
  value: string | number;
  unit: string;
};

export default function GoalTextPair(props: Props) {
  return (
    <View key={props.goalKey} style={{ gap: 3, margin: 5 }}>
      <Text
        variant="labelLarge"
        style={[
          { fontSize: 12, color: colors.lvPrimary80, textAlign: "center" },
        ]}
      >
        {props.goalKey.toUpperCase()}
      </Text>
      <Text
        variant="labelLarge"
        style={[
          { fontSize: 22, color: "white", lineHeight: 23, textAlign: "center" },
        ]}
      >
        {props.value}
      </Text>
      <Divider style={{ marginTop: 6, backgroundColor: "gray" }} />
      <Text style={{ color: colors.lightGrayText, textAlign: "center" }}>
        {props.unit}
      </Text>
    </View>
  );
}
