import ProgressBar from "@/src/components/UI/ProgressBar";
import { useAuth } from "@/src/context/authContext";
import { useUserLogsStore } from "@/src/store/userLogsStore";
import { colors } from "@/src/theme/colors";
import { mainStyles } from "@/src/theme/styles";
import { Food, MacroKeys, Recipe } from "@/src/types";
import { router, useLocalSearchParams } from "expo-router";
import { Beef, Droplets, Save, Wheat } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { Button, Divider, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const macrosInfo = {
  macrosLabels: ["Protein", "Carbs", "Fats"],
  macrosIcons: [Beef, Wheat, Droplets],
};

export default function NewFoodPreview() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const handleUploadRecipe = useUserLogsStore((s) => s.handleUploadRecipe);
  const logsLoading = useUserLogsStore((s) => s.logsLoading);
  const { ingredientsList, foodName, servingsInput } = useLocalSearchParams<{
    ingredientsList: string;
    foodName: string;
    servingsInput: string;
  }>();
  const ingredients: Food[] = ingredientsList
    ? JSON.parse(ingredientsList)
    : [];

  const totalCalories = ingredients.reduce(
    (total, food) => total + food.calories,
    0,
  );

  const totalMacros = { protein: 0, fats: 0, carbs: 0 };
  for (const macro of macrosKeys) {
    totalMacros[macro] = ingredients.reduce(
      (sum, ingredient) => sum + ingredient[macro],
      0,
    );
  }

  let totalGrams = 0;
  for (const ingredient of ingredients) {
    const gramWeight =
      ingredient.portions[ingredient.selectedServingIndex ?? 0].gramWeight *
      (ingredient.loggedQuantity ?? 0);
    totalGrams += gramWeight;
  }

  async function handleFoodSave() {
    const recipe: Recipe = {
      name: foodName,
      calories: totalCalories,
      protein: totalMacros["protein"],
      fats: totalMacros["fats"],
      carbs: totalMacros["carbs"],
      loggedQuantity: Number(servingsInput),
      selectedServingIndex: 0,
      grams: 100,
      portions: [
        {
          modifier: "serving",
          amount: 1,
          gramWeight: Math.round(totalGrams / Number(servingsInput)),
          label: "1.0 serving",
        },
        {
          modifier: "Grams",
          amount: 1,
          gramWeight: 1,
          label: "1.0 gram",
        },
      ],
      starred: false,
      ingredients: ingredients,
    };
    try {
      await handleUploadRecipe(recipe);
      Toast.show({
        type: "success",
        text1: "",
        text2: "",
      });
      router.replace("/(tabs)/calorieTracker");
    } catch (error) {
      Toast.show({ type: "error", text1: "Could not upload food" });
    }
  }

  return (
    <View
      style={{
        paddingHorizontal: 15,
        paddingTop: 20,
        borderRadius: 20,
        marginTop: 10,
        // backgroundColor: colors.lvHeader,
        flex: 1,
      }}
    >
      {/* <Text
        variant="labelLarge"
        style={{ color: "white", textAlign: "center", fontSize: 19 }}
      >
        {" "}
        {foodName}
      </Text> */}
      <View style={styles.labelValueContainer}>
        <Text variant="labelLarge" style={styles.label}>
          Food name
        </Text>
        <Text variant="labelLarge" style={styles.value}>
          {foodName}
        </Text>
      </View>
      <Divider style={styles.divider} />
      <View style={styles.labelValueContainer}>
        <Text variant="labelLarge" style={styles.label}>
          Servings
        </Text>
        <Text variant="labelLarge" style={styles.value}>
          {servingsInput}
        </Text>
      </View>
      <Divider style={styles.divider} />
      <View style={styles.labelValueContainer}>
        <Text variant="labelLarge" style={styles.label}>
          Total calories
        </Text>
        <Text
          variant="labelLarge"
          style={[styles.value, { color: colors.lvPrimaryLight }]}
        >
          {totalCalories} Kcal
        </Text>
      </View>
      <Divider style={styles.divider} />
      <View style={styles.labelValueContainer}>
        <Text variant="labelLarge" style={styles.label}>
          Total weight
        </Text>
        <Text
          variant="labelLarge"
          style={[styles.value, { color: colors.lvPrimaryLight }]}
        >
          {totalGrams} g
        </Text>
      </View>
      <Divider style={styles.divider} />
      {/* Macros Info bars */}
      <View style={[styles.flexRowView, styles.macrosContainer]}>
        {macrosKeys.map((macro, index) => {
          const IconElement = macrosInfo.macrosIcons[index];
          return (
            <View key={index}>
              <Divider
                style={[
                  styles.divider,
                  { backgroundColor: "rgba(40, 154, 171, 0.09)" },
                ]}
              />
              {/* Outer View for each macro */}
              <View
                key={macro}
                style={[
                  styles.macroTextContainer,
                  { borderColor: colors[macro] },
                ]}
              >
                <IconElement
                  size={22}
                  color={colors[macro]}
                  style={{
                    paddingRight: 15,
                    top: 8,
                    alignSelf: "flex-start",
                  }}
                />
                {/* ProgressBar and Label */}
                <View
                  style={{
                    flexDirection: "column",
                    width: "70%",
                    gap: 10,
                  }}
                >
                  <Text
                    variant="labelLarge"
                    style={{
                      fontSize: 15,
                      color: "rgba(225, 225, 225, 1)",
                      alignSelf: "flex-start",
                    }}
                  >
                    {macrosInfo.macrosLabels[index]}
                  </Text>

                  <ProgressBar
                    width={"100%"}
                    height={8}
                    unfilledColor={colors.lvPrimary10}
                    filledColor={colors[macro]}
                    currentValue={totalMacros[macro]}
                    targetValue={user ? user?.nutritionGoals[macro] : 0}
                  ></ProgressBar>
                </View>

                {/* Percetange and value texts */}
                <View style={{ flexDirection: "column", width: "30%" }}>
                  <Text
                    variant="labelLarge"
                    style={{
                      fontSize: 14,
                      color: "white",
                      textAlign: "center",
                      lineHeight: 25,
                    }}
                  >
                    {totalMacros[macro]}g/{user?.nutritionGoals[macro]}g
                  </Text>
                  <Text
                    variant="labelLarge"
                    style={{
                      fontSize: 14,
                      color: "white",
                      textAlign: "center",
                      lineHeight: 25,
                    }}
                  >
                    {user
                      ? Math.floor(
                          (totalMacros[macro] / user.nutritionGoals[macro]) *
                            100,
                        ) + "%"
                      : null}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
      <Button
        icon={() => <Save size={20} color={colors.lvBackground} />}
        textColor={colors.lvBackground}
        style={{
          backgroundColor: colors.lvPrimary80,
          marginBottom: mainStyles.mainContainer.paddingBottom + insets.bottom,
        }}
        onPress={handleFoodSave}
        disabled={logsLoading}
        loading={logsLoading}
      >
        Save
      </Button>
    </View>
  );
}

const macrosKeys: MacroKeys[] = ["protein", "carbs", "fats"];

const styles = StyleSheet.create({
  labelValueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  value: {
    fontSize: 18,
    color: "rgb(255, 255, 255)",
  },
  label: { fontSize: 15, color: "rgb(173, 173, 173)" },
  divider: { marginBottom: 15 },
  flexRowView: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 10,
    backgroundColor: "",
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
  },
  macrosContainer: {
    // backgroundColor: "red",
    width: "100%",
    justifyContent: "flex-start",
    gap: 15,
  },
  macroTextContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    borderRadius: 20,
    // backgroundColor: colors.lvGradientCard,
    width: "97%",
    // borderWidth: 1.5,
  },
});
