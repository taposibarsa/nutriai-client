"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { PlannerForm } from "@/components/meal-planner/PlannerForm";
import { MealPlanDisplay } from "@/components/meal-planner/MealPlanDisplay";
import { SavedPlanCard } from "@/components/meal-planner/SavedPlanCard";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  useDeleteMealPlan,
  useGenerateMealPlan,
  useSaveMealPlan,
  useSavedMealPlans,
  saveUserPreferences,
} from "@/hooks/useMealPlans";
import { ApiError } from "@/lib/api";
import type { PlannerFormValues } from "@/lib/validations";
import type { GeneratedPlan, MealPlanPreferences, SavedMealPlan } from "@/types";

function toPreferences(values: PlannerFormValues): MealPlanPreferences {
  return {
    dietaryPreference: values.dietaryPreference,
    healthGoal: values.healthGoal,
    days: values.days,
    mealsPerDay: values.mealsPerDay,
    calorieTarget: values.calorieTarget,
    cuisines: values.cuisines,
    allergies: values.allergies,
    additionalNotes: values.additionalNotes ?? "",
  };
}

function defaultTitle(prefs: MealPlanPreferences): string {
  const diet =
    prefs.dietaryPreference === "No Restrictions"
      ? "Custom"
      : prefs.dietaryPreference;
  return `My ${prefs.days}-Day ${diet} Plan`;
}

export default function MealPlannerPage() {
  const savedQuery = useSavedMealPlans();
  const generate = useGenerateMealPlan();
  const savePlan = useSaveMealPlan();
  const deletePlan = useDeleteMealPlan();

  const [preferences, setPreferences] = useState<MealPlanPreferences | null>(
    null,
  );
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [formDefaults, setFormDefaults] = useState<Partial<PlannerFormValues>>();
  const [formKey, setFormKey] = useState(0);
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<SavedMealPlan | null>(null);
  const [loadedPlanId, setLoadedPlanId] = useState<string | null>(null);

  const savedPlans = savedQuery.data?.data ?? [];

  const suggestedTitle = useMemo(
    () => (preferences ? defaultTitle(preferences) : "My Meal Plan"),
    [preferences],
  );

  function scrollToPlanPanel() {
    requestAnimationFrame(() => {
      document
        .getElementById("meal-plan-panel")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  async function handleGenerate(values: PlannerFormValues) {
    const prefs = toPreferences(values);
    setPreferences(prefs);
    setPlan(null);
    setLoadedPlanId(null);
    scrollToPlanPanel();
    try {
      const result = await generate.mutateAsync(prefs);
      setPlan(result.generatedPlan);
      void saveUserPreferences(prefs);
      toast.success("Meal plan ready!");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Could not generate meal plan. Please try again.";
      toast.error(message);
    }
  }

  async function handleRegenerate() {
    if (!preferences || generate.isPending) return;
    scrollToPlanPanel();
    try {
      const result = await generate.mutateAsync(preferences);
      setPlan(result.generatedPlan);
      setLoadedPlanId(null);
      toast.success("Plan regenerated!");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Could not regenerate plan.";
      toast.error(message);
    }
  }

  function openSaveModal() {
    setSaveTitle(suggestedTitle);
    setSaveOpen(true);
  }

  async function confirmSave() {
    if (!plan || !preferences) return;
    if (!saveTitle.trim()) {
      toast.error("Please enter a plan title.");
      return;
    }
    try {
      await savePlan.mutateAsync({
        title: saveTitle.trim(),
        preferences,
        generatedPlan: plan,
      });
      toast.success("Plan saved!");
      setSaveOpen(false);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Could not save plan.";
      toast.error(message);
    }
  }

  function handleLoad(saved: SavedMealPlan) {
    setPreferences(saved.preferences);
    setPlan(saved.generatedPlan);
    setFormDefaults({
      dietaryPreference: saved.preferences.dietaryPreference,
      healthGoal: saved.preferences.healthGoal,
      days: saved.preferences.days,
      mealsPerDay: saved.preferences.mealsPerDay as 2 | 3 | 4 | 5,
      calorieTarget: saved.preferences.calorieTarget,
      cuisines: saved.preferences.cuisines,
      allergies: saved.preferences.allergies,
      additionalNotes: saved.preferences.additionalNotes ?? "",
    });
    setFormKey((k) => k + 1);
    setLoadedPlanId(saved._id);
    scrollToPlanPanel();
    toast.success(`Loaded “${saved.title}”`);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const deletedId = deleteTarget._id;
    try {
      await deletePlan.mutateAsync(deletedId);
      if (loadedPlanId === deletedId) {
        setPlan(null);
        setPreferences(null);
        setLoadedPlanId(null);
      }
      toast.success("Plan deleted");
      setDeleteTarget(null);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Could not delete plan.";
      toast.error(message);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--forest)]">
          AI Meal Planner
        </h1>
        <p className="mt-2 text-[var(--warm-gray)]">
          Tell NutriAI your goals — Claude builds a complete personalized plan.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="w-full space-y-4 lg:w-[38%] lg:shrink-0">
          <PlannerForm
            key={formKey}
            defaultValues={formDefaults}
            onGenerate={handleGenerate}
            generating={generate.isPending}
          />

          <section className="rounded-2xl bg-[var(--card)] p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-[var(--forest)]">
              Saved Plans
            </h2>
            {savedQuery.isLoading ? (
              <div className="animate-pulse space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-forest/10 p-3"
                  >
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
                    <div className="mt-3 flex gap-2">
                      <div className="h-8 flex-1 rounded-full bg-gray-200" />
                      <div className="h-8 w-8 rounded-full bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : savedQuery.isError ? (
              <p className="text-sm text-red-600">
                Could not load saved plans. Please try again.
              </p>
            ) : savedPlans.length === 0 ? (
              <EmptyState
                compact
                heading="No saved plans yet"
                description="Generate a meal plan, then save it here for quick reload."
              />
            ) : (
              <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                {savedPlans.map((saved) => (
                  <SavedPlanCard
                    key={saved._id}
                    plan={saved}
                    onLoad={() => handleLoad(saved)}
                    onDelete={() => setDeleteTarget(saved)}
                    deleting={
                      deletePlan.isPending && deleteTarget?._id === saved._id
                    }
                  />
                ))}
              </div>
            )}
          </section>
        </aside>

        <section id="meal-plan-panel" className="min-w-0 flex-1 scroll-mt-24">
          <MealPlanDisplay
            plan={plan}
            preferences={preferences}
            loading={generate.isPending && !plan}
            regenerating={generate.isPending && Boolean(plan)}
            onRegenerate={plan && !generate.isPending ? handleRegenerate : undefined}
            onSave={plan && !generate.isPending ? openSaveModal : undefined}
          />
        </section>
      </div>

      <Modal
        open={saveOpen}
        title="Name your plan"
        confirmLabel="Save"
        confirmVariant="secondary"
        confirmLoading={savePlan.isPending}
        onConfirm={confirmSave}
        onClose={() => {
          if (!savePlan.isPending) setSaveOpen(false);
        }}
      >
        <label className="block text-sm font-semibold text-[var(--forest)]">
          Plan title
          <input
            value={saveTitle}
            onChange={(e) => setSaveTitle(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[var(--coral)]"
            placeholder={suggestedTitle}
          />
        </label>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        title="Delete meal plan?"
        confirmLabel="Delete"
        confirmLoading={deletePlan.isPending}
        onConfirm={confirmDelete}
        onClose={() => {
          if (!deletePlan.isPending) setDeleteTarget(null);
        }}
      >
        <p>
          Are you sure you want to delete{" "}
          <strong className="text-[var(--forest)]">{deleteTarget?.title}</strong>
          ? This cannot be undone.
        </p>
      </Modal>
    </main>
  );
}
