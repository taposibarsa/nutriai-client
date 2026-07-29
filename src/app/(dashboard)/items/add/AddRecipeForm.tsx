"use client";

import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import {
  recipeFormSchema,
  type RecipeFormValues,
} from "@/lib/validations";
import { MEAL_TYPES, DIETARY_TAGS } from "@/lib/constants";
import { useCreateRecipe } from "@/hooks/useRecipes";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { ALLOWED_IMAGE_HOSTS_HINT, isAllowedImageUrl } from "@/lib/imageHosts";

const defaultValues: RecipeFormValues = {
  title: "",
  shortDescription: "",
  fullDescription: "",
  mealType: "lunch",
  cuisine: "",
  difficulty: "easy",
  prepTime: 10,
  cookTime: 20,
  servings: 2,
  dietaryTags: [],
  nutrition: {
    calories: 300,
    protein: 10,
    carbs: 30,
    fat: 10,
    fiber: 0,
  },
  ingredients: [
    { name: "", quantity: "" },
    { name: "", quantity: "" },
    { name: "", quantity: "" },
  ],
  instructions: [{ step: "" }, { step: "" }, { step: "" }],
  image1: "",
  image2: "",
  image3: "",
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-[var(--card)] p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-[var(--forest)]">{title}</h2>
      {children}
    </section>
  );
}

function ImagePreview({ url, label }: { url: string; label: string }) {
  const show = isAllowedImageUrl(url);
  if (!show) {
    return (
      <div className="flex h-20 w-28 items-center justify-center rounded-xl bg-[var(--sage)] px-2 text-center text-[10px] leading-tight text-[var(--warm-gray)]">
        {url.trim() ? "Host not allowed" : "Preview"}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={label}
      className="h-20 w-28 rounded-xl object-cover"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = "none";
      }}
    />
  );
}

export function AddRecipeForm() {
  const router = useRouter();
  const createRecipe = useCreateRecipe();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RecipeFormValues>({
    // Zod 4 + RHF resolver typing mismatch
    resolver: zodResolver(recipeFormSchema) as never,
    defaultValues,
  });

  const ingredients = useFieldArray({ control, name: "ingredients" });
  const instructions = useFieldArray({ control, name: "instructions" });

  const shortDescription = watch("shortDescription") ?? "";
  const fullDescription = watch("fullDescription") ?? "";
  const dietaryTags = watch("dietaryTags") ?? [];
  const image1 = watch("image1") ?? "";
  const image2 = watch("image2") ?? "";
  const image3 = watch("image3") ?? "";

  function toggleTag(tag: string) {
    const next = dietaryTags.includes(tag)
      ? dietaryTags.filter((t) => t !== tag)
      : [...dietaryTags, tag];
    setValue("dietaryTags", next, { shouldValidate: true });
  }

  async function onSubmit(values: RecipeFormValues) {
    const images = [values.image1, values.image2, values.image3].filter(Boolean);
    try {
      await createRecipe.mutateAsync({
        title: values.title,
        shortDescription: values.shortDescription,
        fullDescription: values.fullDescription,
        mealType: values.mealType,
        cuisine: values.cuisine,
        difficulty: values.difficulty,
        prepTime: values.prepTime,
        cookTime: values.cookTime,
        servings: values.servings,
        dietaryTags: values.dietaryTags,
        nutrition: {
          ...values.nutrition,
          fiber: values.nutrition.fiber ?? 0,
        },
        ingredients: values.ingredients,
        instructions: values.instructions.map((row) => row.step),
        images,
      });
      toast.success("Recipe published! 🎉");
      router.push("/items/manage");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Could not publish recipe.";
      toast.error(message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Section title="Basic Info">
        <label className="block text-sm font-semibold text-[var(--forest)]">
          Recipe Title
          <input
            {...register("title")}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[var(--coral)]"
            placeholder="e.g. Lemon Herb Grilled Chicken"
          />
          <FieldError message={errors.title?.message} />
        </label>

        <label className="mt-4 block text-sm font-semibold text-[var(--forest)]">
          Short Description
          <textarea
            {...register("shortDescription")}
            rows={2}
            maxLength={150}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[var(--coral)]"
          />
          <span className="mt-1 block text-xs font-normal text-[var(--warm-gray)]">
            {shortDescription.length}/150
          </span>
          <FieldError message={errors.shortDescription?.message} />
        </label>

        <label className="mt-4 block text-sm font-semibold text-[var(--forest)]">
          Full Description
          <textarea
            {...register("fullDescription")}
            rows={5}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[var(--coral)]"
            placeholder="At least 100 characters about the dish..."
          />
          <span className="mt-1 block text-xs font-normal text-[var(--warm-gray)]">
            {fullDescription.length} characters (min 100)
          </span>
          <FieldError message={errors.fullDescription?.message} />
        </label>
      </Section>

      <Section title="Classification">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-[var(--forest)]">
            Meal Type
            <select
              {...register("mealType")}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal capitalize outline-none focus:border-[var(--coral)]"
            >
              {MEAL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <FieldError message={errors.mealType?.message} />
          </label>

          <label className="block text-sm font-semibold text-[var(--forest)]">
            Cuisine
            <input
              {...register("cuisine")}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[var(--coral)]"
              placeholder="Mediterranean"
            />
            <FieldError message={errors.cuisine?.message} />
          </label>
        </div>

        <fieldset className="mt-4">
          <legend className="text-sm font-semibold text-[var(--forest)]">
            Difficulty
          </legend>
          <div className="mt-2 flex flex-wrap gap-4">
            {(["easy", "medium", "hard"] as const).map((level) => (
              <label key={level} className="flex items-center gap-2 text-sm capitalize">
                <input type="radio" value={level} {...register("difficulty")} />
                {level}
              </label>
            ))}
          </div>
          <FieldError message={errors.difficulty?.message} />
        </fieldset>

        <fieldset className="mt-4">
          <legend className="text-sm font-semibold text-[var(--forest)]">
            Dietary Tags
          </legend>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {DIETARY_TAGS.map((tag) => (
              <label key={tag} className="flex items-center gap-2 text-sm capitalize">
                <input
                  type="checkbox"
                  checked={dietaryTags.includes(tag)}
                  onChange={() => toggleTag(tag)}
                />
                {tag}
              </label>
            ))}
          </div>
        </fieldset>
      </Section>

      <Section title="Timing & Servings">
        <div className="grid gap-4 sm:grid-cols-3">
          {(
            [
              ["prepTime", "Prep Time (min)"],
              ["cookTime", "Cook Time (min)"],
              ["servings", "Servings"],
            ] as const
          ).map(([name, label]) => (
            <label key={name} className="block text-sm font-semibold text-[var(--forest)]">
              {label}
              <input
                type="number"
                {...register(name)}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[var(--coral)]"
              />
              <FieldError message={errors[name]?.message} />
            </label>
          ))}
        </div>
      </Section>

      <Section title="Nutrition (per serving)">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {(
            [
              ["calories", "Calories"],
              ["protein", "Protein (g)"],
              ["carbs", "Carbs (g)"],
              ["fat", "Fat (g)"],
              ["fiber", "Fiber (g)"],
            ] as const
          ).map(([name, label]) => (
            <label key={name} className="block text-sm font-semibold text-[var(--forest)]">
              {label}
              <input
                type="number"
                step="any"
                {...register(`nutrition.${name}`)}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[var(--coral)]"
              />
              <FieldError message={errors.nutrition?.[name]?.message} />
            </label>
          ))}
        </div>
      </Section>

      <Section title="Ingredients">
        <div className="space-y-3">
          {ingredients.fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-2 sm:flex-row sm:items-start">
              <div className="flex-1">
                <input
                  {...register(`ingredients.${index}.name`)}
                  placeholder="Ingredient name"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--coral)]"
                />
                <FieldError message={errors.ingredients?.[index]?.name?.message} />
              </div>
              <div className="sm:w-40">
                <input
                  {...register(`ingredients.${index}.quantity`)}
                  placeholder="Quantity"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--coral)]"
                />
                <FieldError message={errors.ingredients?.[index]?.quantity?.message} />
              </div>
              <button
                type="button"
                onClick={() => ingredients.remove(index)}
                disabled={ingredients.fields.length <= 3}
                className="rounded-full p-2 text-[var(--warm-gray)] hover:bg-[var(--sage)] disabled:opacity-40"
                aria-label="Remove ingredient"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <FieldError
          message={errors.ingredients?.message || errors.ingredients?.root?.message}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => ingredients.append({ name: "", quantity: "" })}
        >
          <Plus className="h-4 w-4" /> Add Ingredient
        </Button>
      </Section>

      <Section title="Instructions">
        <div className="space-y-3">
          {instructions.fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <span className="mt-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--forest)] text-xs font-bold text-white">
                {index + 1}
              </span>
              <div className="flex-1">
                <textarea
                  {...register(`instructions.${index}.step`)}
                  rows={2}
                  placeholder={`Step ${index + 1}`}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--coral)]"
                />
                <FieldError message={errors.instructions?.[index]?.step?.message} />
              </div>
              <button
                type="button"
                onClick={() => instructions.remove(index)}
                disabled={instructions.fields.length <= 3}
                className="mt-1 rounded-full p-2 text-[var(--warm-gray)] hover:bg-[var(--sage)] disabled:opacity-40"
                aria-label="Remove step"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <FieldError
          message={
            errors.instructions?.message || errors.instructions?.root?.message
          }
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => instructions.append({ step: "" })}
        >
          <Plus className="h-4 w-4" /> Add Step
        </Button>
      </Section>

      <Section title="Images">
        <p className="mb-3 text-xs text-[var(--warm-gray)]">
          {ALLOWED_IMAGE_HOSTS_HINT}
        </p>
        <p className="mb-3 text-sm text-[var(--warm-gray)]">
          Paste at least 2 image URLs (Unsplash works well). A third is optional.
        </p>
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="block text-sm font-semibold text-[var(--forest)]">
              Image URL 1 *
              <input
                {...register("image1")}
                placeholder="https://images.unsplash.com/..."
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[var(--coral)]"
              />
              <FieldError message={errors.image1?.message} />
            </label>
            <ImagePreview url={image1} label="Preview 1" />
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="block text-sm font-semibold text-[var(--forest)]">
              Image URL 2 *
              <input
                {...register("image2")}
                placeholder="https://images.unsplash.com/..."
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[var(--coral)]"
              />
              <FieldError message={errors.image2?.message} />
            </label>
            <ImagePreview url={image2} label="Preview 2" />
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="block text-sm font-semibold text-[var(--forest)]">
              Image URL 3 (optional)
              <input
                {...register("image3")}
                placeholder="https://images.unsplash.com/..."
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[var(--coral)]"
              />
              <FieldError message={errors.image3?.message} />
            </label>
            <ImagePreview url={image3} label="Preview 3" />
          </div>
        </div>
      </Section>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        loading={createRecipe.isPending}
      >
        Publish Recipe
      </Button>
    </form>
  );
}
