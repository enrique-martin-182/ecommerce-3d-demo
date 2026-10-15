"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-10 w-10" />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Modo claro" : "Modo oscuro"}
      className="flex h-10 w-10 items-center justify-center border-l-2 border-[var(--color-border)] text-xs font-bold uppercase transition-colors hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]"
    >
      {isDark ? "☀" : "◑"}
    </button>
  );
}
