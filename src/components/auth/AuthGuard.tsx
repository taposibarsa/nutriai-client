"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const SESSION_WAIT_MS = 20_000;

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [timedOut, setTimedOut] = useState(false);

  const user = session?.user;
  const waiting = isPending && !timedOut;

  useEffect(() => {
    if (!isPending) {
      setTimedOut(false);
      return;
    }
    const t = setTimeout(() => setTimedOut(true), SESSION_WAIT_MS);
    return () => clearTimeout(t);
  }, [isPending]);

  useEffect(() => {
    if (waiting) return;
    if (!user) {
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.replace(loginUrl);
    }
  }, [waiting, user, pathname, router]);

  if (waiting) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-[var(--warm-gray)]">
        Checking session...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
