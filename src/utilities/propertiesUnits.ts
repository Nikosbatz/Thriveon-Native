export const userPropertiesUnits: Partial<Record<UserInterfaceKeys, string>> = {
  age: "years",
  height: "cm",
  weight: "kg",
  protein: "g",
  fats: "g",
  carbs: "g",
  calories: "kcal",
  water: "L",
  // Note: Since this is a Record, TS will require
  // all keys from UserInterfaceKeys to be present.
};
