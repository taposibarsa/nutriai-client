import { Suspense } from "react";
import LoginForm from "./LoginForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function LoginRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
