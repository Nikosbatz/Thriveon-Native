import { colors } from "@/src/theme/colors";
import { Dispatch, SetStateAction } from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

type Props = {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
};

export default function MedicalDisclaimerModal(props: Props) {
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
              color: colors.lvPrimaryLight,
              fontSize: 18,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Medical Disclaimer
          </Text>
          <Text variant="labelLarge" style={{ color: "white" }}>
            The nutritional information and caloric suggestions provided by this
            app are for informational and educational purposes only and do not
            constitute professional medical advice, diagnosis, or treatment.
            This app is not a substitute for the expertise of a healthcare
            professional. Always seek the advice of your physician or another
            qualified health provider before starting any new diet, fitness
            program, or making significant changes to your nutritional intake.
            Never disregard professional medical advice or delay in seeking it
            because of something you have read or calculated within this
            application. Use of this app is at your own risk.
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.lvGradientCard,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.77)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    elevation: 10,
    backgroundColor: colors.lvBackground,
    padding: 20,
    borderRadius: 20,
  },
});
