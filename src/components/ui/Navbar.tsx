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
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight transition-opacity hover:opacity-70"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <rect
              x="2"
              y="2"
              width="7"
              height="7"
              rx="1.5"
              fill="currentColor"
              opacity=".9"
            />
            <rect
              x="11"
              y="2"
              width="7"
              height="7"
              rx="1.5"
              fill="currentColor"
              opacity=".5"
            />
            <rect
              x="2"
              y="11"
              width="7"
              height="7"
              rx="1.5"
              fill="currentColor"
              opacity=".5"
            />
            <rect
              x="11"
              y="11"
              width="7"
              height="7"
              rx="1.5"
              fill="currentColor"
              opacity=".9"
            />
          </svg>
          <span>Store 3D</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link
            href="/"
            className="rounded-md px-3 py-1.5 text-[var(--color-muted-fg)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]"
          >
            Tienda
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={toggleDrawer}
            aria-label={`Carrito — ${count()} artículos`}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[var(--color-surface)]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M1.5 1.5h2l2 9h8l2-7H5.5" />
              <circle cx="7.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
              <circle cx="13.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            {count() > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[var(--color-foreground)] text-[10px] font-semibold text-[var(--color-background)] leading-none">
                {count() > 9 ? "9+" : count()}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
