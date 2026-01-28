import { useAuth } from "@/src/context/authContext";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { useRouter } from "expo-router";
import { CheckCheck } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import MacroHealthGoalsCard from "../profile/MacroHealthGoalsCard";

export default function Plan() {
  const router = useRouter();
  const { user } = useAuth();

  console.log(user);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.lvBackground,
        paddingTop: 50,
        paddingHorizontal: 5,
        alignContent: "center",
        gap: 20,
      }}
    >
      {/* Headline Texts Container */}
      <View>
        <Text
          variant="headlineMedium"
          style={{ color: colors.lvPrimaryLight, textAlign: "center" }}
        >
          Your plan is ready
        </Text>
        <Text
          variant="labelLarge"
          style={{
            color: colors.lightWhiteText,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          We've tailored this plan specifically for your body and activity
          level.
        </Text>
      </View>

      {/* Calories goal card */}
      <View
        style={[
          mainStyles.card,
          {
            padding: 20,
            borderWidth: 1,
            borderColor: colors.lvPrimary50,
            backgroundColor: colors.lvPrimary20,
            elevation: 0,
          },
        ]}
      >
        <Text
          variant="labelLarge"
          style={{
            fontSize: 20,
            color: colors.lightWhiteText,
            textAlign: "center",
            lineHeight: 25,
          }}
        >
          Daily Calories Goal
        </Text>
        <Text
          variant="headlineMedium"
          style={{
            color: colors.lvPrimary,
            textAlign: "center",
            fontSize: 32,
            padding: 10,
          }}
        >
          {user?.nutritionGoals.calories}
        </Text>
        <Text
          variant="labelLarge"
          style={{ color: colors.lvPrimaryLight, textAlign: "center" }}
        >
          kcal / day
        </Text>
      </View>

      {/* Nutrition and health goals  */}
      <MacroHealthGoalsCard />

      <Button
        mode="contained"
        onPress={() => router.dismissTo("/(tabs)")}
        style={{
          backgroundColor: colors.lvPrimary,
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: [{ translateX: "-50%" }],
          width: "80%",
        }}
        textColor={colors.lvBackground}
        icon={() => <CheckCheck />}
      >
        Confirm Plan
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({});
