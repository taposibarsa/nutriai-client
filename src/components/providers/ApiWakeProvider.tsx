"use client";

import { useEffect } from "react";
import { wakeApi } from "@/lib/api";

/** Fire-and-forget wake of the Render API so first login is less likely to fail. */
export function ApiWakeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void wakeApi(20_000);
  }, []);

  return <>{children}</>;
}
