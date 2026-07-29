import { AddRecipeForm } from "./AddRecipeForm";

export default function AddRecipePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--forest)]">
          Share a Healthy Recipe
        </h1>
        <p className="mt-2 text-[var(--warm-gray)]">
          Add your recipe to the NutriAI community library.
        </p>
      </div>
      <AddRecipeForm />
    </main>
  );
}
