import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Weight } from "lucide-react-native";
import { Dispatch, SetStateAction, useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";

type Props = {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
};

export default function WeightFormModal(props: Props) {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [show, setShow] = useState(false);
  const [formInputs, setFormInputs] = useState({
    weight: "",
    date: new Date(),
  });
  const weightLogsLoading = useUserLogsStore((s) => s.weightLogsLoading);
  const postUserWeight = useUserLogsStore((s) => s.postUserWeight);
  const theme = useTheme();

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(false);
    // if (selectedDate) {
    //   setDate(selectedDate);
    // }
  };

  async function handleLogWeight() {
    const weightNum = Number(formInputs.weight);

    if (weightNum < 30 || weightNum > 300) {
      setFormError("Weight number should be between 30 and 300");
      return;
    } else if (Number.isNaN(weightNum)) {
      setFormError("Weight must be a number between 30 and 300 !");
      return;
    }

    try {
      await postUserWeight(weightNum);
      setFormError("");
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Weight has been Logged Successfully",
      });
      props.setVisible(false);
    } catch (error: any) {
      setFormError(error.message);
    }
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
              color: colors.primary,
              fontSize: 20,
              textAlign: "center",
              marginBottom: 10,
              lineHeight: 25,
            }}
          >
            Log Your Weight ⏲️
          </Text>
          <Pressable onPress={() => console.log("date picker pressed")}>
            <TextInput
              mode="outlined"
              outlineColor={colors.lightGrayText}
              label="Date"
              value={formInputs.date.toLocaleDateString()}
              editable={false}
              right={<TextInput.Icon icon="calendar" />}
              style={styles.input}
              textColor="white"
            />
          </Pressable>

          {show && (
            <DateTimePicker
              design="material"
              value={formInputs.date}
              mode="date" // "time" | "datetime"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChange}
            />
          )}
          <View style={styles.formPair}>
            <Text variant="labelLarge" style={styles.label}>
              Weight
            </Text>
            <TextInput
              value={formInputs.weight}
              onChangeText={(text) =>
                setFormInputs({ ...formInputs, weight: text })
              }
              mode="outlined"
              style={styles.input}
              outlineColor="transparent"
              activeOutlineColor={colors.lightGrayText}
              placeholder="Kgs"
              textColor="white"
              cursorColor="white"
              placeholderTextColor={colors.lightGrayText}
              keyboardType="number-pad"
            ></TextInput>
          </View>

          {formError !== "" ? (
            <Text
              variant="labelLarge"
              style={{
                color: "red",
                marginTop: 0,
                fontSize: 16,
              }}
            >
              {formError}
            </Text>
          ) : null}

          <Button
            mode="contained"
            style={{
              marginTop: 0,
              backgroundColor: colors.lvPrimary80,
            }}
            onPress={handleLogWeight}
            icon={() => <Weight color={"white"} />}
            textColor={"white"}
            loading={weightLogsLoading}
            disabled={weightLogsLoading}
          >
            {loading ? "Logging..." : "Log Weight"}
          </Button>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const inputBackground = "rgba(34, 34, 42, 1)";

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
    borderRadius: 20,
    gap: 15,
    borderWidth: 1,
    borderColor: "rgba(61, 61, 61, 1)",
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
    borderRadius: 10,
  },
});
