"use client";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { ThemeToggle } from "./ThemeToggle";
import { useEffect } from "react";

export function Navbar() {
  const { count, toggleDrawer } = useCartStore();

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="font-semibold text-sm tracking-tight">
          STORE 3D
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--color-muted)]">
          <Link
            href="/"
            className="hover:text-[var(--color-foreground)] transition-colors"
          >
            Tienda
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={toggleDrawer}
            aria-label={`Carrito — ${count()} artículos`}
            className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] text-sm transition-colors hover:bg-[var(--color-card)]"
          >
            🛒
            {count() > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] text-[var(--color-accent-fg)] font-mono">
                {count()}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
