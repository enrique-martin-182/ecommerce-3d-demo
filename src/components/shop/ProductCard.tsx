"use client";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, toggleDrawer } = useCartStore();
  const defaultVariant = product.variants[0];

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem(product.id, defaultVariant.id);
    toggleDrawer();
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col border-2 border-[var(--color-border)] bg-[var(--color-card)] transition-all duration-150 hover:[box-shadow:4px_4px_0_0_var(--color-border)] hover:-translate-x-[2px] hover:-translate-y-[2px]"
    >
      {/* CSS Placeholder image */}
      <div
        className="relative aspect-square overflow-hidden border-b-2 border-[var(--color-border)] flex items-end p-4"
        style={{ backgroundColor: defaultVariant.color }}
        aria-label={`Placeholder de ${product.name}`}
      >
        {/* Product name as big text */}
        <span
          className="select-none font-black uppercase leading-none text-[clamp(2rem,5vw,3.5rem)] tracking-tighter"
          style={{ color: "white", mixBlendMode: "difference" }}
          aria-hidden="true"
        >
          {product.name.split(" ")[0]}
        </span>

        {/* Variant swatches */}
        {product.variants.length > 1 && (
          <div className="absolute right-3 top-3 flex flex-col gap-1">
            {product.variants.slice(0, 4).map((v) => (
              <span
                key={v.id}
                style={{ background: v.color }}
                className="h-4 w-4 border-2 border-white/50"
                title={v.name}
              />
            ))}
          </div>
        )}

        {/* 3D badge */}
        <div className="absolute left-3 top-3 border-2 border-white/50 bg-black/50 px-2 py-0.5">
          <span className="font-mono text-[9px] font-bold uppercase text-white">3D</span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-1 flex-col p-4">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
          {product.category}
        </span>
        <h3 className="mt-1 font-black text-base uppercase leading-tight tracking-tight">
          {product.name}
        </h3>
        <p className="mt-1 font-mono text-xs text-[var(--color-muted-fg)] line-clamp-2">
          {product.shortDescription}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2 border-t-2 border-[var(--color-border)] pt-4">
          <span className="font-black text-xl tabular-nums">
            {product.price} €
          </span>
          <button
            onClick={handleAddToCart}
            aria-label={`Añadir ${product.name} al carrito`}
            className="border-2 border-[var(--color-border)] bg-[var(--color-background)] px-3 py-1.5 font-black text-xs uppercase transition-all hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]"
          >
            + Añadir
          </button>
        </div>
      </div>
    </Link>
  );
}
