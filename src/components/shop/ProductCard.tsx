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
      className="group relative flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-[var(--color-border)]">
        <Image
          src={product.fallbackImage}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs text-[var(--color-muted)] capitalize">
          {product.category}
        </span>
        <h3 className="font-medium text-sm leading-tight">{product.name}</h3>
        <p className="text-xs text-[var(--color-muted)] line-clamp-2">
          {product.shortDescription}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-semibold">{product.price} €</span>
          <button
            onClick={handleAddToCart}
            aria-label={`Añadir ${product.name} al carrito`}
            className="rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-[var(--color-accent-fg)] transition-opacity hover:opacity-80"
          >
            + Carrito
          </button>
        </div>
        <span className="text-center text-xs text-[var(--color-muted)] opacity-0 transition-opacity group-hover:opacity-100">
          Explorar en 3D →
        </span>
      </div>
    </Link>
  );
}
