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
  { value: "all", label: "TODO" },
  { value: "electronics", label: "ELECTRÓNICA" },
  { value: "furniture", label: "MUEBLES" },
  { value: "accessories", label: "ACCESORIOS" },
  { value: "footwear", label: "CALZADO" },
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
    <div className="flex flex-col gap-3 border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      {/* Category row */}
      <div className="flex flex-wrap gap-0">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.value}
            onClick={() => {
              setActiveCategory(cat.value);
              onCategoryChange(cat.value);
            }}
            className={`border-2 border-r-0 px-4 py-2 font-mono text-[11px] font-bold uppercase transition-all last:border-r-2 ${
              activeCategory === cat.value
                ? "bg-[var(--color-foreground)] text-[var(--color-background)] border-[var(--color-border)]"
                : "border-[var(--color-border)] hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]"
            }`}
            style={{ marginLeft: i === 0 ? 0 : -2 }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-0">
        {/* Search */}
        <input
          type="search"
          placeholder="BUSCAR..."
          value={searchValue}
          onChange={handleSearch}
          aria-label="Buscar productos"
          className="h-9 border-2 border-[var(--color-border)] bg-[var(--color-card)] px-3 font-mono text-xs uppercase placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-0 focus:border-[var(--color-accent)]"
        />

        {/* Price */}
        <label className="flex h-9 items-center gap-2 border-2 border-l-0 border-[var(--color-border)] bg-[var(--color-card)] px-3 font-mono text-[11px] font-bold uppercase">
          <span className="whitespace-nowrap">MAX {maxPrice} €</span>
          <input
            type="range"
            min={100}
            max={1000}
            step={50}
            defaultValue={1000}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className="w-20 accent-[var(--color-accent)] cursor-pointer"
            aria-label="Precio máximo"
          />
        </label>

        {/* Sort */}
        <select
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          aria-label="Ordenar por"
          className="h-9 border-2 border-l-0 border-[var(--color-border)] bg-[var(--color-card)] px-2 font-mono text-[11px] font-bold uppercase focus:outline-none focus:border-[var(--color-accent)] cursor-pointer"
        >
          <option value="price-asc">PRECIO ↑</option>
          <option value="price-desc">PRECIO ↓</option>
          <option value="name-asc">NOMBRE A–Z</option>
        </select>
      </div>
    </div>
  );
}
