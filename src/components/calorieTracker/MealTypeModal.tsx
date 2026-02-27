import { colors } from "@/src/theme/colors";
import { Dispatch, SetStateAction } from "react";
import { Modal, Pressable, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";

type Props = {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  selectedMealType: mealType;
  setSelectedMealType: Dispatch<SetStateAction<mealType>>;
};

export default function MealTypeModal({
  visible,
  setVisible,
  selectedMealType,
  setSelectedMealType,
}: Props) {
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
            {mealTypes.map((mealType, index) => (
              <TouchableRipple
                key={index}
                onPress={() => setSelectedMealType(mealType)}
                rippleColor={"rgba(6, 213, 231, 0.73)"}
                style={{ borderRadius: 20, overflow: "hidden" }}
                borderless
              >
                <Text
                  variant="labelLarge"
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: 21,
                    padding: 5,
                    backgroundColor:
                      selectedMealType === mealType
                        ? colors.lvPrimary50
                        : "transparent",
                    borderRadius: 7,
                  }}
                >
                  {mealType}
                </Text>
              </TouchableRipple>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const mealTypes: mealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];
