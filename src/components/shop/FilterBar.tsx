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
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--color-iron-veil)] bg-[var(--color-forest-floor)] p-5">
      {/* Category pills */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setActiveCategory(cat.value);
                onCategoryChange(cat.value);
              }}
              className={`rounded-full px-4 py-2 text-xs font-medium uppercase tracking-widest transition-all ${
                activeCategory === cat.value
                  ? "bg-white text-black"
                  : "border border-white/20 text-[var(--color-tide-pool)] hover:border-white/40 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <input
          type="search"
          placeholder="Buscar..."
          value={searchValue}
          onChange={handleSearch}
          aria-label="Buscar productos"
          className="h-9 min-w-[140px] flex-1 rounded-lg border border-[var(--color-iron-veil)] bg-[var(--color-deep-canopy)] px-3 text-sm text-white placeholder:text-[var(--color-ash-label)] focus:border-[var(--color-tide-pool)] focus:outline-none"
        />

        {/* Price range */}
        <label className="flex h-9 flex-shrink-0 items-center gap-2 rounded-lg border border-[var(--color-iron-veil)] bg-[var(--color-deep-canopy)] px-3 text-xs text-[var(--color-ash-label)]">
          <span className="whitespace-nowrap">Máx {maxPrice} €</span>
          <input
            type="range"
            min={100}
            max={1000}
            step={50}
            defaultValue={1000}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className="w-20 accent-[var(--color-mint-signal)] cursor-pointer"
            aria-label="Precio máximo"
          />
        </label>

        {/* Sort */}
        <select
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          aria-label="Ordenar por"
          className="h-9 flex-shrink-0 rounded-lg border border-[var(--color-iron-veil)] bg-[var(--color-deep-canopy)] px-3 text-xs text-[var(--color-ash-label)] focus:border-[var(--color-tide-pool)] focus:outline-none cursor-pointer"
        >
          <option value="price-asc">Precio ↑</option>
          <option value="price-desc">Precio ↓</option>
          <option value="name-asc">Nombre A–Z</option>
        </select>
      </div>
    </div>
  );
}
