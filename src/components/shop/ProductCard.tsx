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
      className="group flex flex-col overflow-hidden rounded-xl border border-[var(--color-iron-veil)] bg-[var(--color-forest-floor)] transition-all duration-200 hover:border-[var(--color-tide-pool)] hover:shadow-[var(--shadow-feature)]"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[var(--color-deep-canopy)]">
        <Image
          src={product.fallbackImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          unoptimized
        />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-forest-floor)]/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Product name on hover */}
        <div className="absolute bottom-4 left-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="font-light text-lg uppercase leading-tight tracking-wide text-white">
            {product.name}
          </span>
        </div>

        {/* 3D badge */}
        <div className="absolute left-3 top-3 rounded-full border border-[var(--color-mint-signal)]/40 bg-[var(--color-abyssal-ink)]/70 px-2.5 py-0.5 backdrop-blur-sm">
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[var(--color-mint-signal)]">3D</span>
        </div>

        {/* Variant dots */}
        {product.variants.length > 1 && (
          <div className="absolute right-3 top-3 flex flex-col gap-1.5">
            {product.variants.slice(0, 4).map((v) => (
              <span
                key={v.id}
                style={{ background: v.color }}
                className="h-2.5 w-2.5 rounded-full border border-white/30"
                title={v.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-1 flex-col p-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ash-label)]">
          {product.category}
        </span>
        <h3 className="mt-1.5 font-light text-lg uppercase leading-tight tracking-wide text-white">
          {product.name}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-tide-pool)] line-clamp-2">
          {product.shortDescription}
        </p>

        <div className="mt-5 flex items-center justify-between gap-2 border-t border-[var(--color-iron-veil)] pt-4">
          <span className="font-light text-2xl tabular-nums text-[var(--color-mint-signal)]">
            {product.price} €
          </span>
          <button
            onClick={handleAddToCart}
            aria-label={`Añadir ${product.name} al carrito`}
            className="rounded-full bg-white px-4 py-2 text-xs font-medium uppercase tracking-wider text-black transition-all hover:bg-[var(--color-ghost-white)]"
          >
            + Añadir
          </button>
        </div>
      </div>
    </Link>
  );
}
