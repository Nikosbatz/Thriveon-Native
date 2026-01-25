import { useOnBoardingFormStore } from "@/src/store/userFormStore";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  BicepsFlexed,
  CircleSmall,
  Mars,
  Scale,
  TrendingDown,
  Venus,
} from "lucide-react-native";
import { useState } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, Text, TouchableRipple } from "react-native-paper";
import Toast from "react-native-toast-message";
import CustomNumInput from "../UI/CustomNumInput";

const statusBarHeight = StatusBar.currentHeight;

export default function InfoForm() {
  const onBoardingFormData = useOnBoardingFormStore((state) => state.formData);
  const storeUpdateForm = useOnBoardingFormStore((state) => state.updateForm);
  const [formInputs, setFormInputs] = useState<FormInputs>({
    goal: -1,
    age: "",
    weight: "",
    height: "",
    gender: "",
  });
  const router = useRouter();

  console.log("onBoardingFormData: ", onBoardingFormData);

  function handleFormSubmit() {
    const formattedFormInputs = {
      ...formInputs,
      weight: Number(formInputs.weight),
      height: Number(formInputs.height),
      age: Number(formInputs.age),
      gender: formInputs.gender.toLowerCase(),
    };
    try {
      // schema.validateSync(formattedFormInputs, { abortEarly: false });
      storeUpdateForm(formInputs);
      router.push("/(onBoarding)/activityFreqScreen");
    } catch (error: any) {
      error.inner.forEach((err: any) =>
        Toast.show({
          type: "error",
          text1: err.message,
          // text2: err.message,
        }),
      );
    }
  }
  return (
    <View style={{ backgroundColor: colors.lvBackground, flex: 1 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.mainContainer}
        extraScrollHeight={100}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        enableResetScrollToCoords={false}
        style={{}}
      >
        <Text variant="headlineSmall" style={{ color: "white" }}>
          Personal Stats
        </Text>
        <Text
          variant="headlineSmall"
          style={{ color: colors.lightWhiteText, fontSize: 16, lineHeight: 20 }}
        >
          Please provide us with some basic information to help us tailor your
          experience.
        </Text>

        {/* Goals Cards Container */}
        <View>
          <Text variant="labelLarge" style={styles.inputLabel}>
            Primary Goal
          </Text>
          {goals.map((obj, index) => (
            // Goal Card
            <TouchableRipple
              key={index}
              onPress={() => setFormInputs({ ...formInputs, goal: index })}
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
                    formInputs.goal === index
                      ? colors.lvPrimary80
                      : "transparent",
                },
              ]}
              borderless
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
              >
                <View
                  style={{
                    backgroundColor: colors.lvPrimary20,
                    padding: 4,
                    alignSelf: "flex-start",
                    borderRadius: 7,
                  }}
                >
                  <obj.icon size={25} color={colors.lvPrimary}></obj.icon>
                </View>
                <Text
                  variant="labelLarge"
                  style={{ color: "white", fontSize: 20 }}
                >
                  {obj.goal}
                </Text>
              </View>
            </TouchableRipple>
          ))}
        </View>

        {/* Gender Input Container */}

        <Text variant="labelLarge" style={styles.inputLabel}>
          Gender
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignSelf: "center",
            // marginTop: 15,
            backgroundColor: "rgba(12, 101, 109, 1)",
            padding: 3,
            borderRadius: 10,
            width: "95%",
            justifyContent: "space-around",
          }}
        >
          {genders.map((obj, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.3}
              onPress={() =>
                setFormInputs({ ...formInputs, gender: obj.gender })
              }
              style={[
                formInputs.gender === obj.gender ? styles.selectedGender : null,
                { flexDirection: "row", gap: 2, borderRadius: 10 },
              ]}
            >
              <obj.icon
                size={23}
                color={
                  formInputs.gender === obj.gender
                    ? colors.lvBackground
                    : "white"
                }
                style={{ alignSelf: "center" }}
              />
              <Text
                variant="labelLarge"
                style={[
                  {
                    color:
                      formInputs.gender === obj.gender
                        ? colors.lvBackground
                        : "white",
                    fontSize: 20,
                    padding: 8,
                  },
                ]}
              >
                {obj.gender}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Age, Weight, Height Inputs Container */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 15,
            marginTop: 10,
          }}
        >
          {/* Custom Input Container */}
          {formNumInputsData.map((obj) => (
            <CustomNumInput
              key={obj.stateKey}
              label={obj.label}
              unit={obj.unit}
              onChangeText={(text) =>
                setFormInputs({ ...formInputs, [obj.stateKey]: text })
              }
              maxLength={3}
              value={formInputs[obj.stateKey]}
            />
          ))}
        </View>
        <Button
          mode="contained"
          onPress={handleFormSubmit}
          icon={() => <ArrowRight></ArrowRight>}
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
          Continue
        </Button>
      </KeyboardAwareScrollView>
    </View>
  );
}

type FormInputs = {
  goal: number;
  age: string;
  weight: string;
  height: string;
  gender: string;
};

const genders = [
  { gender: "Male", icon: Mars },
  { gender: "Female", icon: Venus },
  { gender: "Other", icon: CircleSmall },
];

const goals = [
  { goal: "Lose Weight", icon: TrendingDown },
  { goal: "Gain Mass", icon: BicepsFlexed },
  { goal: "Maintain Weight", icon: Scale },
];

const formNumInputsData: {
  label: "Age" | "Weight" | "Height";
  unit: string;
  stateKey: "age" | "weight" | "height";
}[] = [
  { label: "Age", unit: "Years", stateKey: "age" },
  { label: "Weight", unit: "Kg", stateKey: "weight" },
  { label: "Height", unit: "Cm", stateKey: "height" },
];
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.lvBackground,
    paddingHorizontal: 10,
    gap: 10,
    flexGrow: 1,
    paddingTop: Platform.OS === "android" ? statusBarHeight! + 20 : 10,
  },
  textContentContainer: {
    gap: 10,
    paddingHorizontal: 15,
  },
  inputLabel: {
    fontSize: 20,
    color: colors.lvPrimaryLight,
    lineHeight: 23,
  },
  selectedGender: {
    color: colors.lvBackground,
    backgroundColor: colors.lvPrimary,
  },
});
