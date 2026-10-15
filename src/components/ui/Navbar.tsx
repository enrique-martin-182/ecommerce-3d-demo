"use client";
import "@/lib/react19-compat";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { useEffect, useState } from "react";

export function Navbar() {
  const { count, toggleDrawer } = useCartStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    useCartStore.persist.rehydrate();
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-[var(--color-iron-veil)] bg-[var(--color-background)]/95 backdrop-blur-sm shadow-sm"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="font-light text-lg tracking-[0.12em] uppercase text-white transition-colors hover:text-[var(--color-mint-signal)]"
        >
          STORE<span className="text-[var(--color-mint-signal)]">3D</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium uppercase tracking-widest text-[var(--color-ash-label)]">
          <Link href="/" className="transition-colors hover:text-white">
            Tienda
          </Link>
        </nav>

        {/* Cart */}
        <button
          onClick={toggleDrawer}
          aria-label={`Carrito — ${count()} artículos`}
          className="relative flex items-center gap-2 rounded-full border border-[var(--color-iron-veil)] bg-[var(--color-forest-floor)] px-4 py-2 text-xs font-medium uppercase tracking-wider text-white transition-all hover:border-[var(--color-tide-pool)] hover:bg-[var(--color-deep-canopy)]"
        >
          <svg
            width="14"
            height="14"
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
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--color-mint-signal)] px-1 text-[10px] font-bold text-black tabular-nums">
              {count() > 9 ? "9+" : count()}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
