"use client";
import { useState, useMemo } from "react";
import { FilterBar, type Category, type SortOption } from "./FilterBar";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const [category, setCategory] = useState<Category>("all");
  const [sort, setSort] = useState<SortOption>("price-asc");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000);

  const filtered = useMemo(() => {
    let result = products;
    if (category !== "all") result = result.filter((p) => p.category === category);
    result = result.filter((p) => p.price <= maxPrice);
    if (search)
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.shortDescription.toLowerCase().includes(search.toLowerCase())
      );
    return [...result].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });
  }, [products, category, sort, search, maxPrice]);

  return (
    <section aria-label="Catálogo de productos">
      <FilterBar
        onCategoryChange={setCategory}
        onSortChange={setSort}
        onSearchChange={setSearch}
        onPriceChange={setMaxPrice}
        maxPrice={maxPrice}
      />
      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-sm text-[var(--color-muted)]">
          No hay productos que coincidan con los filtros.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
