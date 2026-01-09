import { useAuth } from "@/src/context/authContext";
import { colors } from "@/src/theme/colors";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import AppSlider from "../../UI/Slider";
import { profileStyles } from "../profile.styles";
import CustomNumInput from "./CustomNumInput";
import CustomTextInput from "./CustomTextInput";

export default function EditUserInfo() {
  const { user } = useAuth();
  const [selectedGoal, setSelectedGoal] = useState(user?.goal ?? 0);
  const [emailInput, setEmailInput] = useState(user?.email ?? "");
  const [macrosInputs, setMacrosInputs] = useState({
    protein: user?.nutritionGoals.protein ?? 0,
    fats: user?.nutritionGoals.fats ?? 0,
    carbs: user?.nutritionGoals.carbs ?? 0,
  });
  const [caloriesInput, setCaloriesInput] = useState(
    user?.nutritionGoals.calories ?? 0
  );
  const [waterInput, setWaterInput] = useState(user?.healthGoals.water ?? 0);
  const [weightInput, setWeightInput] = useState(user?.healthGoals.weight ?? 0);

  // Add Keyboard avoiding scrollview library to avoid keyboard overlaping with textinputs

  return (
    <ScrollView
      style={{ backgroundColor: colors.lvBackground, flex: 1 }}
      contentContainerStyle={styles.scrollViewContainer}
    >
      {/* Email Input */}
      <CustomTextInput
        value={emailInput}
        setValue={setEmailInput}
        label="EMAIL"
      ></CustomTextInput>

      {/* Main Goal Selection Card */}
      <View style={{ gap: 5 }}>
        <Text style={styles.cardTitle} variant="labelLarge">
          Main Goal
        </Text>
        <View style={profileStyles.card}>
          {goals.map((goal, index) => (
            <Pressable onPress={() => setSelectedGoal(index)}>
              <Text
                variant="labelLarge"
                style={{
                  fontSize: 19,
                  textAlign: "center",
                  padding: 5,
                  paddingVertical: 7,
                  borderRadius: 10,
                  color:
                    selectedGoal == index
                      ? colors.lvBackground
                      : colors.lightGrayText,
                  backgroundColor:
                    selectedGoal == index
                      ? colors.lvPrimary
                      : colors.lvGradientCard,
                }}
              >
                {goal}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      {/* Macros Inputs */}
      <View style={{ gap: 5 }}>
        <Text style={styles.cardTitle} variant="labelLarge">
          Macronutrients
        </Text>
        <View style={[profileStyles.card, { gap: 5 }]}>
          {/* Calories Text Input */}
          <CustomNumInput
            label={"Daily Calories"}
            value={caloriesInput}
            setValue={setCaloriesInput}
            unit={"kcal"}
          />

          {/* Render all the macros EXCEPT 'calories' */}
          {Object.entries(macrosInputs).map(([key, value]) => (
            <AppSlider
              key={key}
              value={macrosInputs[key as keyof MacrosKeys]}
              setValue={setMacrosInputs}
              objectKey={key as keyof MacrosKeys}
            />
          ))}
        </View>
      </View>
      <View style={{ gap: 5 }}>
        <Text style={styles.cardTitle} variant="labelLarge">
          Health Goals
        </Text>
        <View style={[profileStyles.card, { gap: 5 }]}>
          {/* Calories Text Input */}
          <CustomNumInput
            label={"Weight"}
            value={weightInput}
            setValue={setWeightInput}
            unit={"Kg"}
          />
          <CustomNumInput
            label={"Water Intake "}
            value={waterInput}
            setValue={setWaterInput}
            unit={"Liters"}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const goals = ["Lose Weight", "Gain Mass", "Maintain Weight"];

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    gap: 20,
  },
  cardTitle: {
    color: colors.lvPrimaryLight,
    marginStart: 15,
    fontSize: 21,
  },
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
