import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-[var(--warm-gray)]">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
