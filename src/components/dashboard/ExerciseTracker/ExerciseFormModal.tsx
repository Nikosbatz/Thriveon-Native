import { Dispatch, SetStateAction } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

type Props = {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
};

export default function ExerciseFormModal(props: Props) {
  return (
    <Modal
      visible={props.visible}
      animationType="fade"
      transparent
      onRequestClose={() => props.setVisible(false)} // Android back button
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text>Hello Modal 👋</Text>

          <Button onPress={() => props.setVisible(false)}>Close</Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
});
