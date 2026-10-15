"use client";
import Link from "next/link";
import Image from "next/image";
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
      className="group flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] transition-all duration-300 hover:border-[var(--color-muted)] hover:shadow-[0_0_0_1px_var(--color-border),0_8px_32px_-8px_rgba(0,0,0,0.4)]"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[var(--color-surface)]">
        <Image
          src={product.fallbackImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* 3D badge */}
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-background)]/80 px-2 py-0.5 text-[10px] font-medium text-[var(--color-muted-fg)] backdrop-blur-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
            <path d="M5 0L9.33 2.5v5L5 10 .67 7.5v-5L5 0z" opacity=".8" />
          </svg>
          3D
        </div>
        {/* Swatch dots */}
        {product.variants.length > 1 && (
          <div className="absolute bottom-3 right-3 flex gap-1">
            {product.variants.slice(0, 4).map((v) => (
              <span
                key={v.id}
                style={{ background: v.color }}
                className="h-2.5 w-2.5 rounded-full border border-white/20 shadow-sm"
                title={v.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
          {product.category}
        </span>
        <h3 className="font-medium leading-snug">{product.name}</h3>
        <p className="mt-0.5 text-xs text-[var(--color-muted-fg)] line-clamp-2">
          {product.shortDescription}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-base font-semibold tabular-nums">
            {product.price} €
          </span>
          <button
            onClick={handleAddToCart}
            aria-label={`Añadir ${product.name} al carrito`}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs font-medium text-[var(--color-foreground)] transition-colors hover:border-[var(--color-foreground)] hover:bg-[var(--color-surface-raised)]"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M5.5 1v9M1 5.5h9" />
            </svg>
            Añadir
          </button>
        </div>
      </div>
    </Link>
  );
}
