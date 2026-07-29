export type Nutrition = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
};

export type Ingredient = {
  name: string;
  quantity: string;
};

export type Recipe = {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack" | "dessert";
  cuisine: string;
  difficulty: "easy" | "medium" | "hard";
  prepTime: number;
  cookTime: number;
  servings: number;
  dietaryTags: string[];
  nutrition: Nutrition;
  ingredients: Ingredient[];
  instructions: string[];
  images: string[];
  averageRating: number;
  totalReviews: number;
  featured: boolean;
  postedBy: string;
  createdAt: string;
  updatedAt: string;
};

export type Review = {
  _id: string;
  recipe: string;
  user: string;
  userName: string;
  userImage?: string | null;
  rating: number;
  comment: string;
  createdAt: string;
};

export type RecipeListResponse = {
  data: Recipe[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type RecipeDetail = Recipe & {
  reviews: Review[];
  related: Recipe[];
};

export type RecipeListParams = {
  page?: number;
  limit?: number;
  search?: string;
  mealType?: string;
  dietaryTag?: string;
  cuisine?: string;
  maxCalories?: number;
  difficulty?: string;
  sort?: string;
};

export type MealPlanPreferences = {
  dietaryPreference: string;
  healthGoal: string;
  days: 3 | 5 | 7;
  cuisines: string[];
  allergies: string[];
  calorieTarget: number;
  mealsPerDay: number;
  additionalNotes?: string;
};

export type PlanMeal = {
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type PlanDay = {
  dayNumber: number;
  meals: PlanMeal[];
  totalCalories: number;
};

export type ShoppingCategory = {
  category: string;
  items: string[];
};

export type GeneratedPlan = {
  days: PlanDay[];
  totalCaloriesPerDay: number;
  shoppingList: ShoppingCategory[];
  preparationTips: string[];
};

export type SavedMealPlan = {
  _id: string;
  user: string;
  title: string;
  preferences: MealPlanPreferences;
  generatedPlan: GeneratedPlan;
  createdAt: string;
  updatedAt: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export type ChatConversationSummary = {
  _id: string;
  title: string;
  updatedAt: string;
  createdAt?: string;
};

export type ChatConversation = {
  _id: string;
  user: string;
  title: string;
  messages: ChatMessage[];
  activeMealPlanId?: string | null;
  createdAt: string;
  updatedAt: string;
};
