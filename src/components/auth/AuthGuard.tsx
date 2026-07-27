"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.replace(loginUrl);
    }
  }, [isPending, session, pathname, router]);

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-[var(--warm-gray)]">
        Checking session...
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
