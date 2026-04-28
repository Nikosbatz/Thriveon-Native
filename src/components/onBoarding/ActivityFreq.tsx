import { useAuth } from "@/src/context/authContext";
import { useOnBoardingFormStore } from "@/src/store/userFormStore";
import { colors } from "@/src/theme/colors";
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
import { Pressable, StyleSheet, View } from "react-native";
import { Button, Text, TouchableRipple } from "react-native-paper";
import Toast from "react-native-toast-message";
import MedicalDisclaimerModal from "../UI/MedicalDisclaimerModal";

export default function ActivityFreq() {
  const onBoardingFormData = useOnBoardingFormStore((state) => state.formData);
  const storeUpdateForm = useOnBoardingFormStore((state) => state.updateForm);
  const { updateUserInfo, user } = useAuth();
  const [selectedActivity, setSelectedActivity] = useState(-1);
  const [acceptedMedDisclaimer, setAcceptedMedDisclaimer] = useState(false);
  const [MedDisclaimerVisible, setMedDisclaimerVisible] = useState(false);
  const [buildingPlan, setBuildingPlan] = useState(false);
  const router = useRouter();

  async function handleFormSubmit() {
    if (selectedActivity === -1) {
      Toast.show({ type: "error", text1: "Activity level is missing" });
      return;
    }

    if (!acceptedMedDisclaimer) {
      Toast.show({
        type: "error",
        text1: "Medical disclaimer must me accepted before proceeding",
      });
      return;
    }

    setBuildingPlan(true);
    const goals = calculateNutrition(onBoardingFormData);
    const userPlan = user ? { ...user, ...onBoardingFormData, ...goals } : null;
    if (!userPlan) {
      return;
    }

    try {
      await updateUserInfo(userPlan);
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
            onPress={() => {
              setSelectedActivity(index);
              storeUpdateForm({ activity: index });
              console.log(index);
            }}
            rippleColor={"rgba(8, 147, 159, 0.52)"}
            style={[
              {
                backgroundColor: "rgba(18, 105, 143, 0.29)",
                elevation: 0,
                borderRadius: 10,
                marginTop: 5,
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
          {
            padding: 15,
            marginTop: 20,
            borderRadius: 10,
            margin: 10,
            gap: 5,
            borderWidth: 1,
            borderColor: colors.lvPrimary80,
            backgroundColor: colors.lvPrimary10,
            elevation: 0,
          },
        ]}
      >
        <Text
          variant="headlineSmall"
          style={{ color: colors.lvPrimaryLight, fontSize: 17, lineHeight: 19 }}
        >
          Why we need this
        </Text>
        <Text
          variant="labelLarge"
          style={{ color: colors.lightWhiteText, fontSize: 13 }}
        >
          These metrics help us calculate your BMR (Basal Metabolic Rate) to
          suggest accurate caloric intake.
        </Text>
        <Info
          style={{ position: "absolute", top: 10, right: 8 }}
          size={28}
          color={colors.lvPrimary80}
        ></Info>
      </View>
      <Pressable
        style={{
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          maxWidth: "90%",
        }}
        onPress={() => setAcceptedMedDisclaimer((prev) => !prev)}
      >
        {acceptedMedDisclaimer ? (
          <FontAwesome5
            name="dot-circle"
            size={20}
            color={colors.lvPrimary80}
          />
        ) : (
          <FontAwesome5 name="circle" size={20} color={"gray"} />
        )}
        <Text style={{ color: "white" }}>
          I have read and understand the{" "}
          <Text
            variant="labelLarge"
            onPress={(e) => {
              setMedDisclaimerVisible(true);
              e.defaultPrevented;
            }}
            style={{
              color: colors.lvPrimaryLight,
              textDecorationLine: "underline",
            }}
          >
            medical disclaimer
          </Text>{" "}
        </Text>
      </Pressable>
      <MedicalDisclaimerModal
        visible={MedDisclaimerVisible}
        setVisible={setMedDisclaimerVisible}
      />
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
