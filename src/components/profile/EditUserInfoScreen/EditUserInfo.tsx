import { useAuth } from "@/src/context/authContext";
import { colors } from "@/src/theme/colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Text } from "react-native-paper";
import Toast from "react-native-toast-message";
import AppSlider from "../../UI/Slider";
import { profileStyles } from "../profile.styles";
import { nestedSchema } from "./../../../utilities/formSchemaValidation";
import CustomNumInput from "./CustomNumInput";
import CustomTextInput from "./CustomTextInput";

export default function EditUserInfo() {
  const { user, loadingUserInfo, updateUserInfo } = useAuth();
  const [userInfoInputs, setUserInfoInputs] = useState<UserInterface | null>(
    user
  );
  const router = useRouter();

  async function handleFormSubmission() {
    if (userInfoInputs) {
      try {
        nestedSchema.validateSync(userInfoInputs, { abortEarly: false });
        await updateUserInfo(userInfoInputs);
        Toast.show({
          type: "success",
          text1: "Profile Updated",
          text2: "Your info has been changed succeSssfully",
        });
        router.back();
      } catch (error: any) {
        if (error.inner && error.inner.length > 0) {
          error.inner.forEach((err: any) =>
            Toast.show({
              type: "error",
              text1: "Update Failed",
              text2: err.message,
            })
          );
        } else {
          Toast.show({
            type: "error",
            text1: "Update Failed",
            text2: error.message,
          });
        }
      }
    }
  }

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={50}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      enableResetScrollToCoords={false}
      style={{ backgroundColor: colors.lvBackground, flex: 1 }}
      contentContainerStyle={styles.scrollViewContainer}
    >
      {/* Email Input */}
      <CustomTextInput
        disabled={true}
        value={userInfoInputs?.email ?? ""}
        onChangeText={(text) =>
          setUserInfoInputs((prev) => (prev ? { ...prev, email: text } : null))
        }
        label="EMAIL"
      ></CustomTextInput>

      {/* Main Goal Selection Card */}
      <View style={{ gap: 5 }}>
        <Text style={styles.cardTitle} variant="labelLarge">
          Main Goal
        </Text>
        <View style={profileStyles.card}>
          {goals.map((goal, index) => (
            <Pressable
              key={index}
              onPress={() =>
                setUserInfoInputs((prev) =>
                  prev ? { ...prev, goal: String(index) } : null
                )
              }
            >
              <Text
                variant="labelLarge"
                style={{
                  fontSize: 19,
                  textAlign: "center",
                  padding: 5,
                  paddingVertical: 7,
                  borderRadius: 10,
                  color:
                    Number(userInfoInputs?.goal) == index
                      ? colors.lvBackground
                      : colors.lightGrayText,
                  backgroundColor:
                    Number(userInfoInputs?.goal) == index
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
            value={userInfoInputs?.nutritionGoals.calories ?? 0}
            onChangeText={(text) =>
              setUserInfoInputs((prev) =>
                prev
                  ? {
                      ...prev,
                      nutritionGoals: {
                        ...prev.nutritionGoals,
                        calories: Number(text),
                      },
                    }
                  : null
              )
            }
            unit={"kcal"}
          />

          {/* Render all the macros EXCEPT 'calories' */}
          {macros.map((macro, index) => (
            <AppSlider
              key={index}
              value={
                userInfoInputs?.nutritionGoals[macro.key as keyof MacrosKeys] ??
                0
              }
              onChangeValue={(num) =>
                setUserInfoInputs((prev) =>
                  prev
                    ? {
                        ...prev,
                        nutritionGoals: {
                          ...prev.nutritionGoals,
                          [macro.key]: num,
                        },
                      }
                    : null
                )
              }
              objectKey={macro.key as keyof MacrosKeys}
            />
          ))}
        </View>
      </View>
      {/* Health Goals Inputs */}
      <View style={{ gap: 5 }}>
        <Text style={styles.cardTitle} variant="labelLarge">
          Health Goals
        </Text>
        <View style={[profileStyles.card, { gap: 5 }]}>
          {/* Calories Text Input */}
          <CustomNumInput
            label={"Weight"}
            value={userInfoInputs?.healthGoals.weight ?? 0}
            unit={"Kg"}
            onChangeText={(text) =>
              setUserInfoInputs((prev) =>
                prev
                  ? {
                      ...prev,
                      healthGoals: {
                        ...prev.healthGoals,
                        weight: Number(text),
                      },
                    }
                  : null
              )
            }
          />
          {/* Water Text Input */}
          <CustomNumInput
            label={"Water Intake "}
            value={userInfoInputs?.healthGoals.water ?? 0}
            unit={"Liters"}
            onChangeText={(text) =>
              setUserInfoInputs((prev) =>
                prev
                  ? {
                      ...prev,
                      healthGoals: {
                        ...prev.healthGoals,
                        water: Number(text),
                      },
                    }
                  : null
              )
            }
          />
        </View>
      </View>

      {/* Form Submission button */}
      <Button
        style={{ backgroundColor: colors.lvPrimary }}
        textColor={colors.lvBackground}
        mode="contained"
        loading={loadingUserInfo}
        onPress={handleFormSubmission}
        disabled={loadingUserInfo}
      >
        {loadingUserInfo ? "Saving" : "Save"}
      </Button>
    </KeyboardAwareScrollView>
  );
}

const goals = ["Lose Weight", "Gain Mass", "Maintain Weight"];

const macros = [
  { label: "Daily Protein", key: "protein", unit: "G" },
  { label: "Daily Carbs", key: "carbs", unit: "G" },
  { label: "Daily Fats", key: "fats", unit: "G" },
];

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
