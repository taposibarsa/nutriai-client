"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { registerSchema, type RegisterFormValues } from "@/lib/validations";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!sessionPending && session) {
      router.replace("/");
    }
  }, [session, sessionPending, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      image: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setSubmitting(true);
    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      ...(values.image ? { image: values.image } : {}),
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message || "Email already registered");
      return;
    }

    toast.success("Account created! Welcome to NutriAI");
    router.push("/");
    router.refresh();
  }

  async function handleGoogle() {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: window.location.origin,
    });
    if (error) {
      toast.error(
        error.message ||
          "Google sign-in is not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET on the server.",
      );
    }
  }

  if (sessionPending || session) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-[var(--warm-gray)]">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-[var(--forest)]">Create your account</h2>
        <p className="mt-1 text-sm text-[var(--warm-gray)]">Join NutriAI and start eating smarter</p>

        <button
          type="button"
          onClick={handleGoogle}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold hover:bg-[var(--sage)]"
        >
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-[var(--warm-gray)]">
          <span className="h-px flex-1 bg-gray-200" />
          or register with email
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Full Name</label>
            <input
              type="text"
              {...register("name")}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-[var(--coral)]"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email Address</label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-[var(--coral)]"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 pr-10 outline-none focus:border-[var(--coral)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-[var(--coral)]"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Profile Photo URL (optional)</label>
            <input
              type="url"
              {...register("image")}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-[var(--coral)]"
            />
            {errors.image && <p className="mt-1 text-xs text-red-600">{errors.image.message}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[var(--coral)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--warm-gray)]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[var(--coral)]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
