import React from "react";
import { Modal, View } from "react-native";
import { Button, Portal, Text } from "react-native-paper";
import MenuModal from "../UI/MenuModal";

type FoodModalProps = {
  selectedFood: FoodType | null;
  setSelectedFood: React.Dispatch<React.SetStateAction<FoodType | null>>;
  foodModalVisible: boolean;
  setFoodModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedMealType: string;
};

export default function FoodModal({
  selectedFood,
  setSelectedFood,
  setFoodModalVisible,
  foodModalVisible,
  selectedMealType,
}: FoodModalProps) {
  return (
    <Modal
      visible={foodModalVisible}
      onRequestClose={() => setFoodModalVisible(false)}
      animationType="slide"
      allowSwipeDismissal
      style={{}}
    >
      <Portal.Host>
        <View
          style={{
            justifyContent: "flex-start",
            flex: 1,
            //backgroundColor: "rgba(0, 0, 0, 0.28)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              elevation: 8,
              padding: 10,
            }}
          >
            <Text
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "rgba(153, 153, 153, 1)",
                padding: 5,
              }}
              variant="headlineSmall"
            >
              {" "}
              {selectedFood?.name}{" "}
            </Text>
            <MenuModal></MenuModal>

            <Button onPress={() => setFoodModalVisible(false)}>Close</Button>
          </View>
        </View>
      </Portal.Host>
    </Modal>
  );
}
