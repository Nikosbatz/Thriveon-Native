type parameters = {
  gender: string;
  weight: number;
  height: number;
  age: number;
  activity: number;
  goal: number;
};

export default function calculateNutrition({
  gender, // "male", "female" or "other"
  weight, // kg
  height, // cm
  age, // years
  activity, // "0 : none" | "1 : light" | "2 : moderate" | "3 : active"
  goal, // "0 : lose" | "1 : gain" | "2 : maintain"
}: parameters) {
  const healthGoals = { weight: weight, water: 5 };
  const activityMultipliers = [1.2, 1.375, 1.55, 1.725];

  // BMR Calculation
  const BMR =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  // console.log(BMR);
  // Activity adjustment
  let TDEE = BMR * activityMultipliers[activity];

  //if goal === "Lose Weight"
  if (goal === 0) {
    TDEE *= 0.85;

    healthGoals.weight =
      healthGoals.weight - Math.floor(healthGoals.weight * 0.05); // Decrease weight by 5%
  }
  //if goal === "Gain Mass"
  else if (goal === 2) {
    TDEE *= 1.15;
    healthGoals.weight =
      healthGoals.weight + Math.floor(healthGoals.weight * 0.05); // Increase weight by 5%
  }

  TDEE = Math.round(TDEE);

  // Macronutrient calculation
  const proteinGrams = weight * 2; // 2g per kg
  const fatGrams = weight * 0.9; // 0.9g per kg

  const proteinCalories = proteinGrams * 4;
  const fatCalories = fatGrams * 9;

  const remainingCalories = TDEE - (proteinCalories + fatCalories);
  const carbGrams = Math.max(remainingCalories / 4, 0);

  // Daily Water Intake calculation
  healthGoals.water = weight * 0.06;

  return {
    nutritionGoals: {
      calories: TDEE,
      protein: Math.round(proteinGrams),
      fats: Math.round(fatGrams),
      carbs: Math.round(carbGrams),
    },
    healthGoals,
  };
}
