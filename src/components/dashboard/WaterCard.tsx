import { mainStyles } from "@/src/theme/styles";
import { Droplet, Plus } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import ProgressBar from "../UI/ProgressBar";

//TODO: replace mock data with real from zustand
export default function WaterCard() {
  const [cardWidth, setCardWidth] = useState<number>(0);
  const waterGoal = 5;
  const waterIntake = 3.2;

  function handlePress() {
    console.log("Water View Pressed");
  }
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
      <View
        style={{
          backgroundColor: "rgba(0, 119, 254, 1)",
          borderRadius: mainStyles.card.borderRadius,
          padding: 7,
          gap: 20,
          flex: 0,
        }}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setCardWidth(width);
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          <Text
            variant="headlineSmall"
            style={[mainStyles.cardTitleSmall, { color: "white" }]}
          >
            Water
          </Text>
          <Plus
            size={26}
            color={"white"}
            style={{ backgroundColor: "rgba(0, 92, 231, 1)", borderRadius: 8 }}
          ></Plus>
        </View>
        {/* Icon and Water Info container */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {/* Icon container */}
          <View
            style={{
              backgroundColor: "rgba(4, 170, 216, 1)",
              alignSelf: "flex-start",
              borderRadius: 30,
              padding: 10,
            }}
          >
            <Droplet size={26} color={"white"} />
          </View>
          {/* water intake info container */}
          <Text style={{ color: "white", fontSize: 17, fontWeight: "bold" }}>
            {waterIntake} L
            <Text
              variant="headlineSmall"
              style={{
                color: "rgba(0, 77, 178, 1)",
                fontSize: 17,
              }}
            >
              /{waterGoal} L
            </Text>
          </Text>
        </View>
        {/* Custom progress bar container */}
        <View style={{ backgroundColor: "", alignSelf: "center" }}>
          <ProgressBar
            width={cardWidth - 30}
            height={10}
            filledColor="rgba(0, 182, 167, 1)"
            unfilledColor="rgba(199, 199, 199, 1)"
            targetValue={waterGoal}
            currentValue={waterIntake}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
