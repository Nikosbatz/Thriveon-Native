import { useUserActivitiesStore } from "@/src/store/userActivitiesStore";
import { colors } from "@/src/theme/colors";
import { BookmarkPlus } from "lucide-react-native";
import { Dispatch, SetStateAction, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import MenuPicker from "../../UI/MenuPicker";

type Props = {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
};

export default function ExerciseFormModal(props: Props) {
  const theme = useTheme();
  const [activityType, setActivityType] = useState("Strength");
  const [loading, setLoading] = useState(false);
  const [inputValues, setInputValues] = useState({
    duration: "",
    calories: "",
  });
  const [formError, setFormError] = useState(false);
  const activitiesLoading = useUserActivitiesStore((s) => s.activitiesLoading);
  const postUserActivity = useUserActivitiesStore((s) => s.postUserActivity);

  async function handleLogActivity() {
    setLoading(true);

    const activityValues = {
      ...inputValues,
      activityType: activityType,
    };

    if (
      activityTypes.includes(activityType) ||
      activityValues.calories === "" ||
      activityValues.duration === ""
    ) {
      setFormError(true);
      return;
    }

    try {
      postUserActivity();
    } catch (error) {}
    setLoading(false);
    // props.setVisible(false);
  }
  return (
    <Modal
      visible={props.visible}
      animationType="fade"
      transparent
      onRequestClose={() => props.setVisible(false)} // Android back button
    >
      <Pressable style={styles.overlay} onPress={() => props.setVisible(false)}>
        <Pressable style={styles.modalBox}>
          <Text
            variant="labelLarge"
            style={{
              color: "white",
              fontSize: 20,
              textAlign: "center",
              marginBottom: 10,
              lineHeight: 25,
            }}
          >
            Log Your Activity 🏋️
          </Text>

          <View style={{ gap: 10 }}>
            <View style={styles.formPair}>
              <Text variant="labelLarge" style={styles.label}>
                Exercise Type:
              </Text>
              <MenuPicker
                width={"100%"}
                height={55}
                labels={["Strength", "Balance", "Cardio"]}
                selectedValue={activityType}
                setSelectedValue={setActivityType}
                backgroundColor={inputBackground}
                textColor={"white"}
              ></MenuPicker>
            </View>

            <View style={styles.formPair}>
              <Text variant="labelLarge" style={styles.label}>
                Burned Calories:
              </Text>
              <TextInput
                value={inputValues.calories}
                onChangeText={(text) =>
                  setInputValues({ ...inputValues, calories: text })
                }
                mode="outlined"
                style={styles.input}
                outlineColor="transparent"
                activeOutlineColor={colors.lightGrayText}
                placeholder="Cal"
                textColor="white"
                cursorColor="white"
                keyboardType="number-pad"
                placeholderTextColor={colors.lightGrayText}
              ></TextInput>
            </View>

            <View style={styles.formPair}>
              <Text variant="labelLarge" style={styles.label}>
                Duration
              </Text>
              <TextInput
                value={inputValues.duration}
                onChangeText={(text) =>
                  setInputValues({ ...inputValues, duration: text })
                }
                mode="outlined"
                style={styles.input}
                outlineColor="transparent"
                activeOutlineColor={colors.lightGrayText}
                placeholder="Minutes"
                textColor="white"
                cursorColor="white"
                placeholderTextColor={colors.lightGrayText}
                keyboardType="number-pad"
              ></TextInput>
            </View>
          </View>

          {formError ? (
            <Text
              variant="labelLarge"
              style={{ color: theme.colors.error, marginTop: 5, fontSize: 16 }}
            >
              All fields must be filled!
            </Text>
          ) : null}

          <Button
            mode="contained"
            style={{
              marginTop: 20,
              backgroundColor: colors.lvPrimary50,
            }}
            onPress={() => handleLogActivity()}
            icon={() => <BookmarkPlus color={"white"} />}
            textColor={"white"}
            loading={activitiesLoading}
            disabled={activitiesLoading}
          >
            {loading ? "Logging..." : "Log Activity"}
          </Button>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const activityTypes = ["Cardiovascular", "Strength", "Flexibility", "Balance"];

const inputBackground = "rgba(59, 52, 80, 1)";

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.lvGradientCard,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    backgroundColor: colors.lvGradientCard,
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  formPair: {
    width: "100%",
    gap: 3,
  },
  label: {
    fontSize: 16,
    color: colors.lightGrayText,
  },
  input: {
    width: "100%",
    height: 50,
    fontSize: 20,
    backgroundColor: inputBackground,
    color: "white",
  },
});
