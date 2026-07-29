"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { authClient, getSiteOrigin } from "@/lib/auth-client";
import { wakeApi } from "@/lib/api";
import { loginSchema, type LoginFormValues } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const LOGIN_BG =
  "url(https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=2000&q=80)";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!sessionPending && session) {
      router.replace(redirectTo);
    }
  }, [session, sessionPending, redirectTo, router]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setSubmitting(true);
    try {
      // Render free tier may be asleep — wake + one retry
      await wakeApi();

      let result = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (result.error) {
        await wakeApi();
        result = await authClient.signIn.email({
          email: values.email,
          password: values.password,
        });
      }

      if (result.error) {
        toast.error("Invalid email or password");
        return;
      }

      toast.success(`Welcome back, ${result.data?.user.name ?? "there"}!`);
      router.push(redirectTo);
      router.refresh();
    } catch {
      toast.error("Could not reach the server. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    const origin = getSiteOrigin();
    const returnTo =
      redirectTo.startsWith("/") && !redirectTo.startsWith("//")
        ? `${origin}${redirectTo}`
        : origin;
    try {
      await wakeApi();
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: returnTo,
      });
      if (error) {
        toast.error(
          error.message ||
            "Google sign-in is not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET on the server.",
        );
      }
    } catch {
      toast.error("Could not start Google sign-in. Please try again.");
    }
  }

  function fillDemo() {
    setValue("email", "demo@nutriai.app");
    setValue("password", "demo1234");
    toast.success("Demo credentials filled");
  }

  // Only block UI when we already have a session and are redirecting —
  // never hide the form forever while sessionPending (cold starts / CORS).
  if (session) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: LOGIN_BG }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[var(--forest)]/55" aria-hidden />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Left — vertically centered brand copy */}
        <div className="text-center text-white lg:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--coral)]">
            NutriAI
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Eat smart. Live better. Powered by AI.
          </h1>
          <p className="mt-4 max-w-md text-base text-white/85 lg:mx-0 mx-auto">
            Sign in to generate meal plans and chat with your nutrition coach.
          </p>
        </div>

        {/* Right — transparent form */}
        <div className="w-full max-w-md justify-self-center rounded-2xl border border-white/25 bg-white/15 p-8 shadow-lg backdrop-blur-md lg:justify-self-end">
          <h2 className="text-2xl font-bold text-white">Welcome back</h2>
          <p className="mt-1 text-sm text-white/75">Sign in to continue to NutriAI</p>

          <button
            type="button"
            onClick={handleGoogle}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/30"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-white/60">
            <span className="h-px flex-1 bg-white/25" />
            or sign in with email
            <span className="h-px flex-1 bg-white/25" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-white">Email Address</label>
              <input
                type="email"
                {...register("email")}
                className="w-full rounded-xl border border-white/30 bg-white/20 px-3 py-2.5 text-white outline-none placeholder:text-white/50 focus:border-[var(--coral)]"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-200">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-white">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full rounded-xl border border-white/30 bg-white/20 px-3 py-2.5 pr-10 text-white outline-none placeholder:text-white/50 focus:border-[var(--coral)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-200">{errors.password.message}</p>
              )}
            </div>

            <button
              type="button"
              onClick={fillDemo}
              className="w-full rounded-xl border border-white/40 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Use Demo Account
            </button>

            <Button type="submit" loading={submitting} className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-white/75">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-[var(--coral)] hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.7 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l.1.1 6.2 5.2C39.3 36.8 44 32 44 24c0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  );
}
