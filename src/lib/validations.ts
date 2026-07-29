import { z } from "zod";
import {
  ALLOWED_IMAGE_HOSTS_HINT,
  isAllowedImageUrl,
} from "@/lib/imageHosts";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const imageUrlSchema = z
  .string()
  .trim()
  .url("Enter a valid image URL")
  .refine(isAllowedImageUrl, ALLOWED_IMAGE_HOSTS_HINT);

const optionalImageUrlSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || isAllowedImageUrl(value),
    ALLOWED_IMAGE_HOSTS_HINT,
  );

export const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
    image: optionalImageUrlSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const mealTypes = ["breakfast", "lunch", "dinner", "snack", "dessert"] as const;
const difficulties = ["easy", "medium", "hard"] as const;

export const recipeFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100, "Max 100 characters"),
  shortDescription: z
    .string()
    .trim()
    .min(1, "Short description is required")
    .max(150, "Max 150 characters"),
  fullDescription: z
    .string()
    .trim()
    .min(100, "Full description must be at least 100 characters"),
  mealType: z.enum(mealTypes, { message: "Select a meal type" }),
  cuisine: z.string().trim().min(1, "Cuisine is required"),
  difficulty: z.enum(difficulties, { message: "Select a difficulty" }),
  prepTime: z.coerce.number().min(0, "Prep time must be ≥ 0"),
  cookTime: z.coerce.number().min(0, "Cook time must be ≥ 0"),
  servings: z.coerce.number().min(1, "Servings must be at least 1"),
  dietaryTags: z.array(z.string()),
  nutrition: z.object({
    calories: z.coerce.number().min(0, "Calories must be ≥ 0"),
    protein: z.coerce.number().min(0, "Protein must be ≥ 0"),
    carbs: z.coerce.number().min(0, "Carbs must be ≥ 0"),
    fat: z.coerce.number().min(0, "Fat must be ≥ 0"),
    fiber: z.coerce.number().min(0),
  }),
  ingredients: z
    .array(
      z.object({
        name: z.string().trim().min(1, "Ingredient name is required"),
        quantity: z.string().trim().min(1, "Quantity is required"),
      }),
    )
    .min(3, "Add at least 3 ingredients"),
  instructions: z
    .array(
      z.object({
        step: z.string().trim().min(1, "Step cannot be empty"),
      }),
    )
    .min(3, "Add at least 3 steps"),
  image1: imageUrlSchema,
  image2: imageUrlSchema,
  image3: optionalImageUrlSchema,
});

export const plannerFormSchema = z.object({
  dietaryPreference: z.string().min(1, "Select a dietary preference"),
  healthGoal: z.string().min(1, "Select a health goal"),
  days: z.union([z.literal(3), z.literal(5), z.literal(7)]),
  mealsPerDay: z.union([
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  calorieTarget: z.coerce.number().min(1200).max(3500),
  cuisines: z.array(z.string()),
  allergies: z.array(z.string()),
  additionalNotes: z.string().max(300),
});

export const CONTACT_SUBJECTS = [
  "General",
  "Meal Planning",
  "Technical",
  "Partnership",
] as const;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Max 100 characters"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(254, "Email is too long"),
  subject: z.enum(CONTACT_SUBJECTS, { message: "Select a subject" }),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(2000, "Max 2000 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type RecipeFormValues = z.infer<typeof recipeFormSchema>;
export type PlannerFormValues = z.infer<typeof plannerFormSchema>;
export type ContactFormValues = z.infer<typeof contactSchema>;
