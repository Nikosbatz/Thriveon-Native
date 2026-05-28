type Parameters = {
  gender: "male" | "female" | "other";
  weight: number; // kg
  height: number; // cm
  age: number; // years
  activity: 0 | 1 | 2 | 3; // 0: none, 1: light, 2: moderate, 3: active
  goal: 0 | 1 | 2; // 0: lose, 1: maintain, 2: gain
};

export default function calculateNutrition({
  gender,
  weight,
  height,
  age,
  activity,
  goal,
}: Parameters) {
  // 1. Initial health goals setup
  const healthGoals = { weight: weight, water: 0 };
  const activityMultipliers = [1.2, 1.375, 1.55, 1.725];

  // 2. BMR Calculation (Mifflin-St Jeor Equation)
  // Fallback for "other" uses a neutral midpoint or female constant (-161)
  let BMR = 10 * weight + 6.25 * height - 5 * age;
  if (gender === "male") {
    BMR += 5;
  } else {
    BMR -= 161;
  }

  // 3. Activity adjustment (TDEE)
  const multiplier = activityMultipliers[activity] || 1.2;
  let TDEE = BMR * multiplier;

  // 4. Goal Adjustment
  // 0: Lose Weight (-15%)
  if (Number(goal) === 0) {
    TDEE *= 0.85;
    healthGoals.weight = Math.round(weight * 0.95); // Target 5% reduction
  }
  // 2: Gain Mass (+15%)
  else if (Number(goal) === 2) {
    TDEE *= 1.15;
    healthGoals.weight = Math.round(weight * 1.05); // Target 5% increase
  }
  // 1: Maintain (No change to TDEE or target weight)

  TDEE = Math.round(TDEE);

  // 5. Macronutrient calculation
  // Protein: 2g per kg | Fat: 0.9g per kg | Carbs: Remainder
  const proteinGrams = weight * 2;
  const fatGrams = weight * 0.9;

  const proteinCalories = proteinGrams * 4;
  const fatCalories = fatGrams * 9;

  const remainingCalories = TDEE - (proteinCalories + fatCalories);

  // Ensure carbs don't drop below 0 if calories are very low
  const carbGrams = Math.max(remainingCalories / 4, 0);

  // 6. Daily Water Intake (approx 0.033L to 0.06L per kg)
  healthGoals.water = Number((weight * 0.04).toFixed(1));

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
