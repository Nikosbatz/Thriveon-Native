import { colors } from "@/src/theme/colors";
import { ArrowDown } from "lucide-react-native";
import { Dispatch, SetStateAction, useState } from "react";
import { Modal, Pressable, TouchableHighlight, View } from "react-native";
import { Text } from "react-native-paper";

// TODO: fix picker width and height

type PickerProps = {
  selectedOption: any;
  setSelectedOption: Dispatch<SetStateAction<any>>;
  options: any[];
};

export default function MenuPicker(props: PickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={{ width: "45%", alignSelf: "stretch" }}>
      <View style={{ flex: 1 }}>
        <Text variant="labelLarge" style={{ color: colors.lightGrayText }}>
          Meal Type
        </Text>
        <Pressable
          onPress={() => setModalVisible(true)}
          style={{
            borderRadius: 4,
            backgroundColor: colors.lvPrimary20,
            flex: 1,
            flexDirection: "row",
            // justifyContent: "center",
            paddingHorizontal: 7,
            alignItems: "center",
            gap: 5,
          }}
        >
          <Text
            variant="labelLarge"
            style={{
              fontSize: 18,
              color: "white",
              display: "flex",
            }}
          >
            {props.selectedOption}
          </Text>
          <ArrowDown
            size={24}
            color={"white"}
            style={{ position: "absolute", right: 10 }}
          ></ArrowDown>
        </Pressable>
      </View>
      <MenuPickerModal
        visible={modalVisible}
        setVisible={setModalVisible}
        selectedOption={props.selectedOption}
        setSelectedOption={props.setSelectedOption}
        options={props.options}
      />
    </View>
  );
}

type ModalProps = {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  selectedOption: any;
  setSelectedOption: Dispatch<SetStateAction<any>>;
  options: any[];
};

function MenuPickerModal({
  visible,
  setVisible,
  selectedOption,
  setSelectedOption,
  options,
}: ModalProps) {
  function handleSelection(mealType: mealType) {
    setSelectedOption(mealType);
    setVisible(false);
  }
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={() => setVisible(false)}
    >
      {/* Modal Overlay */}
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          setVisible(false);
        }}
      >
        {/* Actual Modal Box */}
        <Pressable
          style={{
            width: "80%",
            backgroundColor: colors.lvGradientCard,
            borderRadius: 25,
            padding: 20,
            gap: 10,
          }}
        >
          <Text
            style={{ textAlign: "center", color: colors.lvPrimary80 }}
            variant="headlineSmall"
          >
            Select a meal type
          </Text>
          {/* Meal Types Texts */}
          <View style={{ gap: 0 }}>
            {options.map((option, index) => (
              <TouchableHighlight
                key={index}
                activeOpacity={1}
                underlayColor={colors.primary20}
                onPress={() => {
                  handleSelection(option);
                }}
                // rippleColor={"rgba(6, 213, 231, 0.73)"}
                style={{ borderRadius: 20, overflow: "hidden" }}
                // borderless
              >
                <Text
                  variant="labelLarge"
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: 21,
                    padding: 5,
                    backgroundColor:
                      selectedOption === option
                        ? colors.lvPrimary50
                        : "transparent",
                    borderRadius: 7,
                  }}
                >
                  {option}
                </Text>
              </TouchableHighlight>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
