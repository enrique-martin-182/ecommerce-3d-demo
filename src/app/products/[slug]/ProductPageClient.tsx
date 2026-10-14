"use client";
import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { getProductPrice } from "@/lib/products";
import { ProductViewerClient } from "@/components/three/ProductViewerClient";
import { CartDrawer } from "@/components/shop/CartDrawer";
import type { Product } from "@/lib/types";

export function ProductPageClient({ product }: { product: Product }) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0].id
  );
  const [added, setAdded] = useState(false);
  const { addItem, toggleDrawer } = useCartStore();

  const selectedVariant = product.variants.find(
    (v) => v.id === selectedVariantId
  )!;
  const price = getProductPrice(product, selectedVariantId);

  function handleAddToCart() {
    addItem(product.id, selectedVariantId);
    setAdded(true);
    toggleDrawer();
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <ProductViewerClient product={product} selectedVariant={selectedVariant} />

        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted)] capitalize">
              {product.category}
            </p>
            <h1 className="mt-1 text-3xl font-semibold">{product.name}</h1>
            <p className="mt-3 text-2xl font-semibold">{price} €</p>
          </div>

          <p className="text-[var(--color-muted)] leading-relaxed">
            {product.description}
          </p>

          <div>
            <p className="mb-2 text-sm font-medium">
              Color:{" "}
              <span className="text-[var(--color-muted)]">
                {selectedVariant.name}
              </span>
            </p>
            <div
              className="flex gap-2"
              role="radiogroup"
              aria-label="Seleccionar color"
            >
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantId(variant.id)}
                  role="radio"
                  aria-checked={variant.id === selectedVariantId}
                  aria-label={variant.name}
                  title={variant.name}
                  className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    variant.id === selectedVariantId
                      ? "border-[var(--color-foreground)] scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: variant.color }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={added}
            className="rounded-xl bg-[var(--color-accent)] py-4 text-sm font-medium text-[var(--color-accent-fg)] transition-opacity hover:opacity-80 disabled:opacity-60"
          >
            {added ? "¡Añadido! ✓" : "Añadir al carrito"}
          </button>
        </div>
      </div>
      <CartDrawer />
    </main>
  );
}
