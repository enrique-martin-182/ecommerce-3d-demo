"use client";
import { useState, useCallback, useRef } from "react";

export type SortOption = "price-asc" | "price-desc" | "name-asc";
export type Category =
  | "all"
  | "electronics"
  | "furniture"
  | "accessories"
  | "footwear";

interface FilterBarProps {
  onCategoryChange: (category: Category) => void;
  onSortChange: (sort: SortOption) => void;
  onSearchChange: (query: string) => void;
  onPriceChange: (max: number) => void;
  maxPrice: number;
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "all", label: "Todo" },
  { value: "electronics", label: "Electrónica" },
  { value: "furniture", label: "Muebles" },
  { value: "accessories", label: "Accesorios" },
  { value: "footwear", label: "Calzado" },
];

export function FilterBar({
  onCategoryChange,
  onSortChange,
  onSearchChange,
  onPriceChange,
  maxPrice,
}: FilterBarProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [searchValue, setSearchValue] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearchValue(val);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onSearchChange(val), 300);
    },
    [onSearchChange]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Category pills */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => {
              setActiveCategory(cat.value);
              onCategoryChange(cat.value);
            }}
            className={`rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-all duration-150 ${
              activeCategory === cat.value
                ? "border-[var(--color-foreground)] bg-[var(--color-foreground)] text-[var(--color-background)]"
                : "border-[var(--color-border)] text-[var(--color-muted-fg)] hover:border-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="5.5" cy="5.5" r="4" />
            <path d="M9 9l3 3" />
          </svg>
          <input
            type="search"
            placeholder="Buscar…"
            value={searchValue}
            onChange={handleSearch}
            aria-label="Buscar productos"
            className="h-8 w-44 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] pl-8 pr-3 text-xs placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-muted)]"
          />
        </div>

        {/* Price */}
        <label className="flex items-center gap-2 text-xs text-[var(--color-muted-fg)]">
          <span className="w-20 text-right tabular-nums">Hasta {maxPrice} €</span>
          <input
            type="range"
            min={100}
            max={1000}
            step={50}
            defaultValue={1000}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className="w-24 accent-[var(--color-foreground)] cursor-pointer"
            aria-label="Precio máximo"
          />
        </label>

        {/* Sort */}
        <select
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          aria-label="Ordenar por"
          className="h-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 text-xs text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-muted)] cursor-pointer"
        >
          <option value="price-asc">Precio ↑</option>
          <option value="price-desc">Precio ↓</option>
          <option value="name-asc">Nombre A–Z</option>
        </select>
      </div>
    </div>
  );
}
