"use client";
import { useState, useCallback } from "react";

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

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
      const timer = setTimeout(() => onSearchChange(e.target.value), 300);
      return () => clearTimeout(timer);
    },
    [onSearchChange]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => {
              setActiveCategory(cat.value);
              onCategoryChange(cat.value);
            }}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === cat.value
                ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                : "border-[var(--color-border)] hover:border-[var(--color-foreground)]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="search"
          placeholder="Buscar productos..."
          value={searchValue}
          onChange={handleSearch}
          aria-label="Buscar productos"
          className="h-9 rounded-lg border border-[var(--color-border)] bg-transparent px-3 text-sm placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        />
        <label className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
          Máx. precio: {maxPrice} €
          <input
            type="range"
            min={100}
            max={1000}
            step={50}
            defaultValue={1000}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className="w-28 accent-[var(--color-accent)]"
            aria-label="Precio máximo"
          />
        </label>
        <select
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          aria-label="Ordenar por"
          className="h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        >
          <option value="price-asc">Precio: menor primero</option>
          <option value="price-desc">Precio: mayor primero</option>
          <option value="name-asc">Nombre A–Z</option>
        </select>
      </div>
    </div>
  );
}
