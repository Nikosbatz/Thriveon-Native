import { useBarcodeFoodStore } from "@/src/store/useBarcodeFoodStore";
import { colors } from "@/src/theme/colors";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import { View } from "react-native";
import FoodOptionsSheet from "./FoodOptionsSheet";

export default function BarcodeFoodScreen() {
  const [selectedMealType, setSelectedMealType] =
    useState<mealType>("Breakfast");
  const bottomSheetRef = useRef<BottomSheet>(null);
  const barcodeStoreFood = useBarcodeFoodStore((state) => state.food);

  return (
    <View style={{ flex: 1, backgroundColor: colors.lvBackground }}>
      <FoodOptionsSheet
        bottomSheetRef={bottomSheetRef}
        food={barcodeStoreFood}
        selectedMealType={selectedMealType}
        setSelectedMealType={setSelectedMealType}
        initialIndex={0}
        enablePanDownToClose={true}
      />
    </View>
  );
}
