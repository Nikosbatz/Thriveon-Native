import { useAuth } from "@/src/context/authContext";
import { colors } from "@/src/theme/colors";
import { Link } from "expo-router";
import { Edit2 } from "lucide-react-native";
import { View } from "react-native";
import { Divider, Text } from "react-native-paper";
import GoalTextPair from "./GoalTextPair";
import { profileStyles } from "./profile.styles";

export default function MacroHealthGoalsCard() {
  const { user } = useAuth();

  return (
    <View style={[profileStyles.card, { gap: 10 }]}>
      {/* Macros Goals */}
      <View>
        <Text variant="headlineSmall" style={[profileStyles.cardTitle]}>
          Macros Goals
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          {Object.entries(user?.nutritionGoals ?? {}).map(([key, value]) => (
            <GoalTextPair
              goalKey={key as keyof UserInterface["nutritionGoals"]}
              value={value}
              unit={units[key as keyof typeof units]}
            />
          ))}
        </View>
      </View>
      <Divider style={{ backgroundColor: colors.primary20 }} />
      {/* Health Goals */}
      <View>
        <Text variant="headlineSmall" style={profileStyles.cardTitle}>
          Health Goals
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          {Object.entries(user?.healthGoals ?? {}).map(([key, value]) => (
            <GoalTextPair
              goalKey={key as keyof UserInterface["healthGoals"]}
              value={value}
              unit={units[key as keyof typeof units]}
            />
          ))}
        </View>
      </View>
      <Link
        href={"/(tabs)/profile/editUserInfo"}
        style={{
          position: "absolute",
          right: 12,
          top: 10,
          borderWidth: 1,
          borderColor: colors.lvPrimary50,
          borderRadius: 50,
          backgroundColor: colors.lvPrimary20,
          padding: 4,
        }}
      >
        <Edit2 size={22} color={colors.lvPrimary}></Edit2>
      </Link>
    </View>
  );
}

const units: Record<
  keyof UserInterface["healthGoals"] | keyof UserInterface["nutritionGoals"],
  string
> = {
  calories: "kcal",
  protein: "grams",
  fats: "grams",
  carbs: "grams",
  weight: "Kilograms",
  water: "Liters",
} as const;
