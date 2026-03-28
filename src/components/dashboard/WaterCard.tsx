import { getUserWaterIntake, postUserWaterIntake } from "@/src/api/requests";
import { useAuth } from "@/src/context/authContext";
import { mainStyles } from "@/src/theme/styles";
import { Droplet, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import Toast from "react-native-toast-message";
import ProgressBar from "../UI/ProgressBar";

export default function WaterCard() {
  const [cardWidth, setCardWidth] = useState<number>(0);
  const [waterIntake, setWaterIntake] = useState<number>(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWaterIntake = async () => {
      try {
        const data = await getUserWaterIntake();
        if (user) {
          setWaterIntake(data);
        }
      } catch (error: any) {
        Toast.show({ type: "error", text1: "Error", text2: error.message });
      }
    };
    fetchWaterIntake();
  }, [user]);

  async function handlePress() {
    const next = Number((waterIntake + 0.2).toFixed(1));
    setWaterIntake(next);
    const water = await postUserWaterIntake(next);
    //TODO: need to debounce the code in the if to avoid setting stale state
    if (water) {
      setWaterIntake(water);
    }
  }
  return (
    <TouchableRipple
      rippleColor={"rgba(6, 173, 198, 0.55)"}
      borderless
      onPress={handlePress}
      style={{ borderRadius: 20 }}
    >
      <View
        style={[
          mainStyles.card,
          {
            gap: 20,
            backgroundColor: "#016dc6",
          },
        ]}
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
            HYDRATION
          </Text>
          <Plus
            size={26}
            color={"rgb(250, 250, 250)"}
            style={{ borderRadius: 8 }}
          ></Plus>
        </View>
        {/* Icon and Water Info container */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {/* Icon container */}
          <View
            style={{
              backgroundColor: "rgb(4, 170, 216)",
              alignSelf: "flex-start",
              borderRadius: 40,
              padding: 6,
            }}
          >
            <Droplet size={22} color={"white"} />
          </View>
          {/* water intake info container */}
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            {waterIntake} L
            <Text
              variant="headlineSmall"
              style={{
                color: "rgb(137, 184, 245)",
                fontSize: 16,
              }}
            >
              /{user?.healthGoals.water.toFixed(1) ?? 3.5} L
            </Text>
          </Text>
        </View>
        {/* Custom progress bar container */}
        <View style={{ backgroundColor: "", alignSelf: "center" }}>
          <ProgressBar
            width={cardWidth - 30}
            height={10}
            filledColor="rgb(1, 180, 203)"
            unfilledColor="rgb(36, 43, 51)"
            targetValue={user?.healthGoals.water ?? 3.5}
            currentValue={waterIntake}
          />
        </View>
      </View>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({});
