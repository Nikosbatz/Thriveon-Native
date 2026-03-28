import { colors } from "@/src/theme/colors";
import { ArrowDown } from "lucide-react-native";
import { Dispatch, SetStateAction, useState } from "react";
import { Modal, Pressable, TouchableHighlight, View } from "react-native";
import { Divider, Text } from "react-native-paper";

type PickerProps = {
  selectedOptionIndex: any;
  setSelectedOptionIndex: Dispatch<SetStateAction<any>>;
  options: any[];
};

export default function MenuPicker(props: PickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={{ width: "100%", alignSelf: "center", flex: 1 }}>
      <View style={{ flex: 1 }}>
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
              fontSize: 17,
              color: "white",
              display: "flex",
              maxWidth: "85%",
            }}
          >
            {props.selectedOptionIndex}
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
        selectedOptionIndex={props.setSelectedOptionIndex}
        setSelectedOptionIndex={props.setSelectedOptionIndex}
        options={props.options}
      />
    </View>
  );
}

type ModalProps = {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  selectedOptionIndex: any;
  setSelectedOptionIndex: Dispatch<SetStateAction<any>>;
  options: any[];
};

function MenuPickerModal({
  visible,
  setVisible,
  selectedOptionIndex,
  setSelectedOptionIndex,
  options,
}: ModalProps) {
  function handleSelection(index: number) {
    setSelectedOptionIndex(index);
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
            backgroundColor: colors.lvBackground,
            borderRadius: 25,
            padding: 20,
            gap: 10,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: colors.lvPrimary80,
              fontSize: 20,
            }}
            variant="headlineSmall"
          >
            Select option
          </Text>
          <Divider
            style={{
              backgroundColor: "rgb(155, 155, 155)",
              width: "100%",
              marginTop: 0,
            }}
          />
          {/* Meal Types Texts */}
          <View style={{ gap: 0 }}>
            {options.map((option, index) => (
              <TouchableHighlight
                key={index}
                activeOpacity={1}
                underlayColor={colors.lvPrimary10}
                onPress={() => {
                  handleSelection(index);
                }}
                style={{ borderRadius: 10, overflow: "hidden" }}
              >
                <View>
                  <Text
                    variant="labelLarge"
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontSize: 18,
                      padding: 3,
                      backgroundColor:
                        selectedOptionIndex === index
                          ? colors.lvPrimary50
                          : "transparent",
                      borderRadius: 7,
                    }}
                  >
                    {option}
                  </Text>
                  {options.length - 1 > index ? (
                    <Divider
                      style={{
                        backgroundColor: "rgb(51, 51, 51)",
                        width: "70%",
                        marginTop: 5,
                        alignSelf: "center",
                      }}
                    />
                  ) : null}
                </View>
              </TouchableHighlight>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
