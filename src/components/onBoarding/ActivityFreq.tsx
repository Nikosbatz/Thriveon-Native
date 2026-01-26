import { useOnBoardingFormStore } from "@/src/store/userFormStore";
import { useUserStore } from "@/src/store/userStore";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import calculateNutrition from "@/src/utilities/calculateGoals";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import {
  Activity,
  Apple,
  Armchair,
  Dumbbell,
  Footprints,
  Info,
} from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TouchableRipple } from "react-native-paper";
import Toast from "react-native-toast-message";

export default function ActivityFreq() {
  const onBoardingFormData = useOnBoardingFormStore((state) => state.formData);
  const storeUpdateForm = useOnBoardingFormStore((state) => state.updateForm);
  const updateInfo = useUserStore((state) => state.updateInfo);
  const [selectedActivity, setSelectedActivity] = useState(-1);
  const [buildingPlan, setBuildingPlan] = useState(false);
  const router = useRouter();

  async function handleFormSubmit() {
    setBuildingPlan(true);
    storeUpdateForm({ activity: selectedActivity });
    const goals = calculateNutrition(onBoardingFormData);
    const userPlan = {
      ...onBoardingFormData,
      ...goals,
    };
    // console.log("userPlan", userPlan);
    try {
      await updateInfo(userPlan);
      setTimeout(() => {
        setBuildingPlan(false);
        router.navigate("/(onBoarding)/planScreen");
      }, 1500);
    } catch (error: any) {
      setBuildingPlan(false);
      Toast.show({
        type: "error",
        text1: "An Error Occured",
        text2: error.message,
      });
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.lvBackground,
        paddingTop: 50,
        paddingHorizontal: 5,
        alignContent: "center",
      }}
    >
      <Text style={{ color: "white" }} variant="headlineMedium">
        What's your activity level?
      </Text>
      <Text variant="labelLarge" style={{ color: colors.lightWhiteText }}>
        This helps us calculate your daily calorie need accurately for so we can
        help you achieve your goal
      </Text>
      {/* Activity Freqs Container */}
      <View>
        <Text variant="labelLarge">Primary Goal</Text>
        {activitiesFreq.map((obj, index) => (
          // Goal Card
          <TouchableRipple
            key={index}
            onPress={() => setSelectedActivity(index)}
            rippleColor={"rgba(8, 147, 159, 0.52)"}
            style={[
              mainStyles.card,
              {
                backgroundColor: "rgba(18, 105, 143, 0.29)",
                elevation: 0,
                borderRadius: 10,
                padding: 10,
                borderWidth: 1,
                borderColor:
                  selectedActivity === index
                    ? colors.lvPrimary80
                    : "transparent",
              },
            ]}
            borderless
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                // justifyContent: "space-between",
                gap: 20,
              }}
            >
              {/* Activity icon container */}
              <View
                style={{
                  backgroundColor: colors.lvPrimary20,
                  padding: 4,
                  alignSelf: "center",
                  borderRadius: 7,
                }}
              >
                <obj.icon size={25} color={colors.lvPrimary}></obj.icon>
              </View>
              {/* Texts container */}
              <View>
                <Text
                  variant="labelLarge"
                  style={{ color: "white", fontSize: 20, lineHeight: 25 }}
                >
                  {obj.label}
                </Text>
                <Text style={{ color: colors.lightWhiteText }}>
                  {obj.descr}
                </Text>
              </View>
              <View style={{ position: "absolute", right: 0 }}>
                {selectedActivity === index ? (
                  <FontAwesome5
                    name="dot-circle"
                    size={24}
                    color={colors.lvPrimaryLight}
                  />
                ) : (
                  <FontAwesome5
                    name="circle"
                    size={24}
                    color={colors.lvPrimary}
                  />
                )}
              </View>
            </View>
          </TouchableRipple>
        ))}
      </View>
      {/* Ending Card */}
      <View
        style={[
          mainStyles.card,
          {
            padding: 20,
            marginTop: 20,
            gap: 15,
            borderWidth: 1,
            borderColor: colors.lvPrimary80,
            backgroundColor: colors.lvPrimary10,
            elevation: 0,
          },
        ]}
      >
        <Text
          variant="headlineSmall"
          style={{ color: colors.lvPrimaryLight, fontSize: 20, lineHeight: 25 }}
        >
          Why we need this
        </Text>
        <Text
          variant="labelLarge"
          style={{ color: colors.lightWhiteText, fontSize: 17 }}
        >
          These metrics help us calculate your BMR (Basal Metabolic Rate) to
          suggest accurate caloric intake.
        </Text>
        <Info
          style={{ position: "absolute", top: 18, right: 8 }}
          size={28}
          color={colors.lvPrimary80}
        ></Info>
      </View>
      <Button
        mode="contained"
        onPress={handleFormSubmit}
        loading={buildingPlan}
        disabled={buildingPlan}
        icon={() => <Apple />}
        style={{
          backgroundColor: colors.lvPrimary,
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: [{ translateX: "-50%" }],
          width: "80%",
        }}
        textColor={colors.lvBackground}
      >
        Build my plan
      </Button>
    </View>
  );
}

const activitiesFreq = [
  {
    frequency: 0,
    label: "Sedentary",
    descr: "Little or no exercise",
    icon: Armchair,
  },
  {
    frequency: 1,
    label: "Lightly Active",
    descr: "Exercise 1-2 days a week",
    icon: Footprints,
  },
  {
    frequency: 2,
    label: "Moderately Active",
    descr: "Exercise often 3-4 times a week",
    icon: Dumbbell,
  },
  {
    frequency: 3,
    label: "Very  Active",
    descr: "Highly frequent exercises 5-7 a week",
    icon: Activity,
  },
];

const styles = StyleSheet.create({
  selectedFreq: {
    borderColor: colors.lvPrimary,
  },
});
