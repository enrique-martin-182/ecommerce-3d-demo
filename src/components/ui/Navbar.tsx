"use client";
import "@/lib/react19-compat";
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
    <header className="sticky top-0 z-50 border-b-2 border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-black text-sm uppercase tracking-tight transition-colors hover:text-[var(--color-accent)]"
        >
          STORE 3D
        </Link>

        <nav className="hidden md:flex items-center gap-0 text-xs font-bold uppercase">
          <Link
            href="/"
            className="border-2 border-transparent px-4 py-2 transition-colors hover:border-[var(--color-border)] hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]"
          >
            Tienda
          </Link>
        </nav>

        <div className="flex items-center gap-0">
          <ThemeToggle />
          <button
            onClick={toggleDrawer}
            aria-label={`Carrito — ${count()} artículos`}
            className="relative flex h-10 items-center gap-2 border-l-2 border-[var(--color-border)] px-4 text-xs font-bold uppercase transition-colors hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M1 1h2.5l2 9h7l2-7H4.5" />
              <circle cx="6.5" cy="13.5" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="12.5" cy="13.5" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            Carrito
            {count() > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center bg-[var(--color-accent)] px-1 text-[10px] font-black text-white tabular-nums">
                {count() > 9 ? "9+" : count()}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
