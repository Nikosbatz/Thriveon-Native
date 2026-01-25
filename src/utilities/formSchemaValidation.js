import * as yup from "yup";
import { setLocale } from "yup";

// Form schema for validation

setLocale({
  mixed: {
    required: "${path} is required",
  },
  string: {
    email: "Please enter a valid email address",
    min: "Must be at least ${min} characters",
  },
  number: {
    min: "${path} must be at least ${min}",
    max: "${path} must be at most ${max}",
  },
});

export const schemaRequired = yup.object().shape({
  goal: yup.number().label("Goal").oneOf([0, 1, 2]).required(),
  gender: yup
    .string()
    .label("Gender")
    .oneOf(["male", "female", "other"])
    .required(),
  height: yup.number().label("Height").min(100).max(250).required(),
  weight: yup.number().label("Weight").min(30).max(180).required(),
  age: yup.number().label("Age").min(13).max(120).required(),
  activity: yup.number().oneOf([0, 1, 2, 3]).required(),
});

export const schema = yup.object().shape({
  goal: yup.number().label("Goal").oneOf([0, 1, 2]),
  gender: yup.string().label("Gender").oneOf(["male", "female"]),
  height: yup.number().label("Height").min(100).max(250),
  weight: yup.number().label("Weight").min(30).max(180),
  age: yup.number().label("Age").min(13).max(120),
  activity: yup.number().oneOf([0, 1, 2, 3]),
});

export const nestedSchema = yup.object({
  goal: yup.number().oneOf([0, 1, 2]),
  gender: yup.string().oneOf(["male", "female"]),
  height: yup.number().min(100).max(250),
  weight: yup.number().min(30).max(180),
  age: yup.number().min(13).max(120),
  activity: yup.number().oneOf([0, 1, 2, 3]),
  nutritionGoals: yup.object({
    calories: yup.number().label("Calories").min(1000).max(15000).required(),
    protein: yup.number().label("Protein").min(50).max(500).required(),
    fats: yup.number().label("Fats").min(50).max(1000).required(),
    carbs: yup.number().label("Carbs").min(0).max(1000).required(),
  }),
  healthGoals: yup.object({
    water: yup.number().label("Water").min(2).max(30).required(),
    weight: yup.number().label("Weight").min(25).max(400).required(),
  }),
});
