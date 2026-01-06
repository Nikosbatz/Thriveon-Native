import { useAuth } from "@/src/context/authContext";
import { colors } from "@/src/theme/colors";
import { TrendingDown } from "lucide-react-native";
import { Dimensions, View } from "react-native";
import { Text } from "react-native-paper";
import ProgressBar from "../UI/ProgressBar";
import { profileStyles } from "./profile.styles";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function MainCardGoal() {
  const { user } = useAuth();

  let filledColor = colors.lvPrimary;
  if (user) {
    if (user?.weight > user?.healthGoals.weight) {
      filledColor = "rgba(255, 149, 0, 1)";
    } else if (user?.weight === user?.healthGoals.weight) {
      filledColor = "rgba(93, 236, 45, 1)";
    } else {
      filledColor = colors.lvPrimary;
    }
  }

  return (
    <View style={[profileStyles.card, { borderColor: colors.lvPrimary50 }]}>
      <Text variant="headlineSmall" style={profileStyles.cardTitle}>
        Main Goal
      </Text>
      <Text variant="headlineSmall" style={{ color: "white" }}>
        {goals[Number(user?.goal)]}
      </Text>
      {/* Texts above ProgressBar */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 8,
          marginTop: 8,
        }}
      >
        <Text variant="labelLarge" style={{ color: colors.lightGrayText }}>
          Weight:{" "}
          <Text style={{ color: colors.lvPrimary, fontSize: 20 }}>
            {user?.weight}
          </Text>
          kg
        </Text>
        <Text
          variant="labelLarge"
          style={{ color: colors.lightGrayText, lineHeight: 22 }}
        >
          Goal:
          <Text
            style={{
              color: colors.lvPrimary,
              fontSize: 20,
            }}
          >
            {" "}
            {user?.healthGoals.weight}
          </Text>
          Kg
        </Text>
      </View>
      <ProgressBar
        width={SCREEN_WIDTH - 50}
        height={5}
        unfilledColor={colors.primary20}
        filledColor={filledColor}
        currentValue={user?.weight ?? 0}
        targetValue={user ? user.healthGoals.weight : 0}
      />

      <View
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 40,
          height: 40,
          borderRadius: 25,
          borderWidth: 1,
          borderColor: colors.lvPrimary,
          backgroundColor: colors.lvPrimary20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TrendingDown size={30} color={colors.lvPrimary} />
      </View>
    </View>
  );
}

const goals = ["Lose Weight", "Gain Mass", "Maintain Weight"];
