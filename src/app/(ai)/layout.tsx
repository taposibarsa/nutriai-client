import { AuthGuard } from "@/components/auth/AuthGuard";

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
