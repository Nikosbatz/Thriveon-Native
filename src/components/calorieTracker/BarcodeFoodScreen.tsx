import { useBarcodeFoodStore } from "@/src/store/useBarcodeFoodStore";
import { colors } from "@/src/theme/colors";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import FoodOptionsSheet from "./FoodOptionsSheet";

export default function BarcodeFoodScreen() {
  const [selectedMealType, setSelectedMealType] =
    useState<mealType>("Breakfast");
  const [foodLogged, setFoodLogged] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const barcodeStoreFood = useBarcodeFoodStore((state) => state.food);
  const router = useRouter();

  useEffect(() => {
    if (foodLogged) {
      router.replace("/(tabs)/calorieTracker");
    }
  }, [foodLogged]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.lvBackground }}>
      <FoodOptionsSheet
        bottomSheetRef={bottomSheetRef}
        food={barcodeStoreFood}
        selectedMealType={selectedMealType}
        setSelectedMealType={setSelectedMealType}
        initialIndex={0}
        enablePanDownToClose={false}
        setFoodLogged={setFoodLogged}
      />
    </View>
  );
}
