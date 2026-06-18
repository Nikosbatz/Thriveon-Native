import { Tooltip } from "@/src/components/UI/ToolTip";
import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { Food, MyFood } from "@/src/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import BottomSheet from "@gorhom/bottom-sheet";
import { Plus, Trash2 } from "lucide-react-native";
import { useState } from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import { ActivityIndicator, Menu, Text } from "react-native-paper";
import Toast from "react-native-toast-message";

type FoodCardProps = {
  food: MyFood;
  index: number;
  setSelectedFood: React.Dispatch<React.SetStateAction<Food | null>>;
  bottomSheetRef: React.RefObject<BottomSheet | null>;
};

export default function FoodCard({
  food,
  index,
  setSelectedFood,
  bottomSheetRef,
}: FoodCardProps) {
  const deleteRecipe = useUserLogsStore((s) => s.deleteRecipe);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 });
  const [pendingDelete, setPendingDelete] = useState(false);

  function handleOnPress() {
    setSelectedFood(food);
    bottomSheetRef.current?.expand();
  }

  const openMenu = (event: GestureResponderEvent) => {
    // Extract press coordinates relative to the screen/parent
    const { nativeEvent } = event;
    setMenuAnchor({ x: nativeEvent.pageX, y: nativeEvent.pageY });
    setMenuVisible(true);
  };
  const closeMenu = () => setMenuVisible(false);

  async function handleDeleteRecipe() {
    setPendingDelete(true);
    closeMenu();
    try {
      await deleteRecipe(food);
    } catch (error) {
      Toast.show({ type: "error", text1: "Could not upload food" });
    } finally {
      setPendingDelete(false);
    }
  }

  // Define quantityText as the food.grams as a fallback in case the food is not Logged
  // Calculate the quantityText based on the loggedQuantity in case the food is Logged
  let quantityText = food.grams + "g";
  if (
    food.loggedQuantity !== undefined &&
    food.selectedServingIndex !== undefined
  ) {
    const splitLabel =
      food.portions[food.selectedServingIndex].label.split(" ");
    quantityText =
      Number(splitLabel[0]) * food.loggedQuantity +
      " " +
      splitLabel.slice(1).join(" ");
  }
  return (
    <>
      <TouchableHighlight
        key={index}
        underlayColor={"rgba(43, 45, 60, 0.6)"}
        onPress={handleOnPress}
        onLongPress={pendingDelete ? undefined : openMenu}
        style={{
          backgroundColor: mainStyles.foodCard.backgroundColor,
          opacity: pendingDelete ? 0.5 : 1,
          borderRadius: 10,
          marginTop: 2,
        }}
      >
        <View style={styles.foodCard}>
          {/* Food Name Text */}
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 0,
              maxWidth: "90%",
            }}
          >
            <View style={{ flexDirection: "row", maxWidth: "90%" }}>
              <Text variant="labelLarge" style={mainStyles.foodCardName}>
                {food.name}
              </Text>
            </View>
            {food.brands ? (
              <Text variant="bodyLarge" style={mainStyles.foodCardBrand}>
                {food.brands}
              </Text>
            ) : null}
          </View>
          {/* Food Macro Info Text*/}
          <View
            style={{
              flexDirection: "row",
              gap: 7,
            }}
          >
            <Text variant="labelLarge" style={mainStyles.foodCardCal}>
              {food.calories} kcal
              <Text style={mainStyles.foodCardCal} variant="labelLarge">
                , {quantityText}
              </Text>
            </Text>
            {food.starred ? (
              <Tooltip text="This food's values are certified by ThriveOn">
                <Ionicons
                  name="shield-checkmark-sharp"
                  size={18}
                  color="rgb(4, 195, 151)"
                />
              </Tooltip>
            ) : null}
          </View>
          {/* Plus Icon */}
          <View
            style={{
              backgroundColor: colors.lvBackground,
              borderRadius: 30,
              padding: 5,
              position: "absolute",
              right: 10,
              top: "50%",
              transform: [{ translateX: "0%" }, { translateY: "-10%" }],
            }}
          >
            <Plus size={18} color={colors.primary} style={{}} />
          </View>
        </View>
      </TouchableHighlight>
      {/* onLongPress Menu */}
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={menuAnchor}
        contentStyle={{ backgroundColor: "rgb(227, 227, 227)" }}
      >
        <Menu.Item
          onPress={() => {
            handleDeleteRecipe();
          }}
          titleStyle={{ color: "red" }}
          title="Delete"
          leadingIcon={() => <Trash2 color={"red"} size={22} />}
        />
      </Menu>
      {pendingDelete ? (
        <ActivityIndicator
          style={{
            position: "absolute",
            alignSelf: "center",
            top: "50%",
            transform: [{ translateY: "-50%" }],
          }}
          size={27}
          color={"red"}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  foodCard: {
    backgroundColor: "transparent",
    borderRadius: 10,
    elevation: 0,
    padding: 12,
    paddingHorizontal: 10,
    borderWidth: 0,
    borderColor: "rgba(135, 191, 244, 0)",
    gap: 0,
  },
  foodMacroText: {
    color: "rgb(167, 167, 167)",
    fontSize: 13,
  },
  foodMacroValue: {
    // color: colors.lvPrimaryLight,
    color: "rgb(176, 176, 176)",
    fontSize: 13,
  },
});
