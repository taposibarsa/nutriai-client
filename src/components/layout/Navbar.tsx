"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Leaf, Menu, X, LogOut, User } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const guestLinks = [
  { href: "/", label: "Home" },
  { href: "/recipes", label: "Recipes" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const authLinks = [
  { href: "/", label: "Home" },
  { href: "/recipes", label: "Recipes" },
  { href: "/meal-planner", label: "AI Meal Planner" },
  { href: "/coach", label: "AI Coach" },
  { href: "/items/add", label: "Add Recipe" },
  { href: "/items/manage", label: "My Recipes" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const isLoggedIn = Boolean(user);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const links = isLoggedIn ? authLinks : guestLinks;
  const onLogin = pathname === "/login";
  const onRegister = pathname === "/register";

  const authBtnBase =
    "rounded-full px-4 py-2 text-sm font-semibold transition";
  const authBtnFilled =
    `${authBtnBase} bg-[var(--coral)] text-[var(--forest)] hover:brightness-95`;
  const authBtnOutline =
    `${authBtnBase} border border-[var(--coral)] text-[var(--coral)] hover:bg-[var(--coral)] hover:text-[var(--forest)]`;

  useEffect(() => {
    if (!menuOpen) return;

    function onPointerDown(e: MouseEvent | TouchEvent) {
      const el = menuRef.current;
      if (el && !el.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  async function handleSignOut() {
    await authClient.signOut();
    setMenuOpen(false);
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 bg-[var(--forest)] text-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display flex items-center gap-2 text-xl font-bold tracking-tight"
        >
          <Leaf className="h-5 w-5 text-[var(--coral)]" />
          <span>
            Nutri<span className="text-[var(--coral)]">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition hover:text-[var(--coral)] ${
                pathname === link.href ? "text-[var(--coral)]" : "text-white/90"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Show Login/Register even while session is loading — only hide when logged in */}
          {!isLoggedIn && (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className={onLogin ? authBtnFilled : authBtnOutline}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={onRegister || (!onLogin && !onRegister) ? authBtnFilled : authBtnOutline}
              >
                Register
              </Link>
            </div>
          )}

          {isLoggedIn && user && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full border border-white/20 px-2 py-1 text-sm"
              >
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name ?? "User"}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                    <User className="h-4 w-4" />
                  </span>
                )}
                <span className="max-w-[120px] truncate">{user.name}</span>
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-[var(--card)] p-3 text-[var(--foreground)] shadow-lg"
                >
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-[var(--warm-gray)]">{user.email}</p>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleSignOut}
                    className="mt-3 flex w-full items-center gap-2 rounded-full bg-[var(--sage)] px-3 py-2 text-sm font-medium text-[var(--forest)] hover:bg-[var(--coral)]"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        <button
          type="button"
          className="lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-sm font-medium ${
                  pathname === link.href ? "text-[var(--coral)]" : "text-white/90"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!isLoggedIn ? (
              <div className="mt-1 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={`text-center ${onLogin ? authBtnFilled : authBtnOutline}`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className={`text-center ${onRegister || (!onLogin && !onRegister) ? authBtnFilled : authBtnOutline}`}
                >
                  Register
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  setOpen(false);
                  await handleSignOut();
                }}
                className="text-left text-sm font-semibold text-[var(--coral)]"
              >
                Logout ({user?.name})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
