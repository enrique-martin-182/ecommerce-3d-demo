"use client";
import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { getProductPrice } from "@/lib/products";
import { ProductViewerClient } from "@/components/three/ProductViewerClient";
import { CartDrawer } from "@/components/shop/CartDrawer";
import type { Product } from "@/lib/types";
import Link from "next/link";

type ViewMode = "photo" | "3d";

export function ProductPageClient({ product }: { product: Product }) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0].id
  );
  const [added, setAdded] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("photo");
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
    <main>
      {/* Breadcrumb */}
      <div className="border-b border-[var(--color-iron-veil)] bg-[var(--color-forest-floor)] px-4 py-3 sm:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ash-label)]">
          <Link href="/" className="transition-colors hover:text-[var(--color-mint-signal)]">
            Tienda
          </Link>
          {" / "}
          <span className="capitalize">{product.category}</span>
          {" / "}
          <span className="text-white">{product.name}</span>
        </p>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-[1fr_1fr] min-h-[75vh]">

        {/* ── LEFT: Visual ── */}
        <div className="border-b border-[var(--color-iron-veil)] lg:border-b-0 lg:border-r">

          {/* View mode toggle */}
          <div className="flex border-b border-[var(--color-iron-veil)]">
            <button
              onClick={() => setViewMode("photo")}
              className={`flex-1 border-r border-[var(--color-iron-veil)] py-3 text-xs font-medium uppercase tracking-wider transition-colors ${
                viewMode === "photo"
                  ? "bg-[var(--color-deep-canopy)] text-white"
                  : "text-[var(--color-ash-label)] hover:text-white"
              }`}
            >
              ◻ Foto
            </button>
            <button
              onClick={() => setViewMode("3d")}
              className={`flex-1 py-3 text-xs font-medium uppercase tracking-wider transition-colors ${
                viewMode === "3d"
                  ? "bg-[var(--color-deep-canopy)] text-[var(--color-mint-signal)]"
                  : "text-[var(--color-ash-label)] hover:text-white"
              }`}
            >
              ◈ Visor 3D
            </button>
          </div>

          {/* Photo view */}
          {viewMode === "photo" && (
            <div className="relative aspect-square overflow-hidden bg-[var(--color-forest-floor)]">
              <Image
                src={product.fallbackImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-abyssal-ink)]/70 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <span
                  className="block font-light uppercase leading-[0.85] tracking-wide text-white"
                  style={{ fontSize: "clamp(2.5rem,6vw,4rem)" }}
                >
                  {product.name}
                </span>
                <span className="mt-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-mint-signal)]">
                  {selectedVariant.name}
                </span>
              </div>
            </div>
          )}

          {/* 3D view */}
          {viewMode === "3d" && (
            <div className="aspect-square bg-[var(--color-deep-canopy)]">
              <ProductViewerClient product={product} selectedVariant={selectedVariant} />
            </div>
          )}

          {/* Variant swatches */}
          <div className="flex items-center gap-0 border-b border-[var(--color-iron-veil)] p-5">
            <span className="mr-5 font-mono text-[10px] uppercase tracking-widest text-[var(--color-ash-label)] whitespace-nowrap">
              Color
            </span>
            <div className="flex gap-2" role="radiogroup" aria-label="Seleccionar color">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantId(variant.id)}
                  role="radio"
                  aria-checked={variant.id === selectedVariantId}
                  aria-label={variant.name}
                  title={variant.name}
                  style={{ backgroundColor: variant.color }}
                  className={`h-8 w-8 rounded-full transition-all ${
                    variant.id === selectedVariantId
                      ? "ring-2 ring-white ring-offset-2 ring-offset-[var(--color-background)] scale-110"
                      : "ring-1 ring-white/20 hover:ring-white/50"
                  }`}
                />
              ))}
              <span className="ml-2 flex items-center text-sm text-[var(--color-tide-pool)]">
                {selectedVariant.name}
              </span>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 divide-x divide-[var(--color-iron-veil)]">
            <div className="p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ash-label)]">Categoría</p>
              <p className="mt-1 text-sm uppercase tracking-wide text-white">{product.category}</p>
            </div>
            <div className="p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ash-label)]">Variantes</p>
              <p className="mt-1 text-sm uppercase tracking-wide text-white">{product.variants.length} colores</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Info ── */}
        <div className="flex flex-col">
          {/* Header */}
          <div className="border-b border-[var(--color-iron-veil)] p-8 lg:p-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ash-label)]">
              {product.category}
            </p>
            <h1 className="mt-3 font-light text-4xl uppercase leading-tight tracking-wide text-white lg:text-5xl">
              {product.name}
            </h1>
            <p className="mt-5 font-light text-5xl tabular-nums text-[var(--color-mint-signal)]">
              {price} €
            </p>
          </div>

          {/* Description */}
          <div className="border-b border-[var(--color-iron-veil)] p-8 lg:p-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ash-label)] mb-4">
              Descripción
            </p>
            <p className="text-sm leading-relaxed text-[var(--color-tide-pool)]">
              {product.description}
            </p>
          </div>

          {/* Add to cart */}
          <div className="border-b border-[var(--color-iron-veil)] p-8 lg:p-10">
            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`w-full rounded-full py-4 text-sm font-medium uppercase tracking-widest transition-all disabled:opacity-70 ${
                added
                  ? "bg-[var(--color-mint-signal)] text-black"
                  : "bg-white text-black hover:bg-[var(--color-ghost-white)]"
              }`}
            >
              {added ? "✓ Añadido al carrito" : "Añadir al carrito →"}
            </button>
            <p className="mt-3 text-center text-[11px] text-[var(--color-ash-label)] uppercase tracking-widest">
              Envío gratuito · Demo — sin pago real
            </p>
          </div>

          {/* Hotspots */}
          {product.hotspots.length > 0 && (
            <div className="flex-1 p-8 lg:p-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ash-label)] mb-5">
                Características
              </p>
              <ul className="space-y-0">
                {product.hotspots.map((h, i) => (
                  <li
                    key={h.id}
                    className="flex items-start gap-5 border-t border-[var(--color-iron-veil)] py-5 first:border-t-0"
                  >
                    <span className="font-mono text-xs text-[var(--color-mint-signal)] w-5 tabular-nums shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-sm font-medium uppercase tracking-wide text-white">{h.label}</p>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--color-tide-pool)]">
                        {h.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Back */}
          <div className="border-t border-[var(--color-iron-veil)] p-6">
            <Link
              href="/"
              className="text-xs font-medium uppercase tracking-wider text-[var(--color-ash-label)] transition-colors hover:text-[var(--color-mint-signal)]"
            >
              ← Volver a la tienda
            </Link>
          </div>
        </div>
      </div>

      <CartDrawer />
    </main>
  );
}
