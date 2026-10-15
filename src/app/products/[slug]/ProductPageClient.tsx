"use client";
import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { getProductPrice } from "@/lib/products";
import { ProductViewerClient } from "@/components/three/ProductViewerClient";
import { CartDrawer } from "@/components/shop/CartDrawer";
import type { Product } from "@/lib/types";
import Link from "next/link";

export function ProductPageClient({ product }: { product: Product }) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0].id
  );
  const [added, setAdded] = useState(false);
  const [show3D, setShow3D] = useState(false);
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
      <div className="border-b-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 sm:px-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
          <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">TIENDA</Link>
          {" / "}
          <span className="capitalize">{product.category}</span>
          {" / "}
          <span>{product.name.toUpperCase()}</span>
        </p>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-[1fr_1fr] min-h-[75vh]">

        {/* ── LEFT: Visual ── */}
        <div className="border-b-2 border-[var(--color-border)] lg:border-b-0 lg:border-r-2">

          {/* CSS color placeholder — main "image" */}
          <div
            className="relative aspect-square flex flex-col items-start justify-end p-8 border-b-2 border-[var(--color-border)]"
            style={{ backgroundColor: selectedVariant.color }}
            aria-label={`Placeholder de ${product.name} — ${selectedVariant.name}`}
          >
            {/* Product name big text */}
            <span
              className="select-none font-black uppercase leading-[0.85] tracking-tighter"
              style={{
                fontSize: "clamp(3rem, 10vw, 6rem)",
                color: "white",
                mixBlendMode: "difference",
              }}
              aria-hidden="true"
            >
              {product.name}
            </span>

            {/* Variant badge */}
            <span
              className="mt-3 font-mono text-xs font-bold uppercase"
              style={{ color: "white", mixBlendMode: "difference" }}
              aria-hidden="true"
            >
              {selectedVariant.name}
            </span>

            {/* 3D toggle button */}
            <button
              onClick={() => setShow3D((s) => !s)}
              className="absolute right-4 top-4 border-2 border-white/50 bg-black/40 px-3 py-1.5 font-mono text-[10px] font-bold uppercase text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              aria-label={show3D ? "Ocultar visor 3D" : "Ver en 3D"}
            >
              {show3D ? "← FOTO" : "3D →"}
            </button>
          </div>

          {/* 3D viewer panel — conditionally shown */}
          {show3D && (
            <div className="aspect-square border-b-2 border-[var(--color-border)] bg-[var(--color-surface)]">
              <ProductViewerClient product={product} selectedVariant={selectedVariant} />
            </div>
          )}

          {/* Variant swatches row */}
          <div className="flex items-center gap-0 border-b-2 border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <span className="mr-4 font-mono text-[10px] font-bold uppercase text-[var(--color-muted)] whitespace-nowrap">
              COLOR
            </span>
            <div className="flex gap-0" role="radiogroup" aria-label="Seleccionar color">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantId(variant.id)}
                  role="radio"
                  aria-checked={variant.id === selectedVariantId}
                  aria-label={variant.name}
                  title={variant.name}
                  style={{ backgroundColor: variant.color }}
                  className={`h-9 w-9 border-2 transition-all ${
                    variant.id === selectedVariantId
                      ? "border-[var(--color-border)] scale-110 z-10 relative"
                      : "border-transparent hover:border-[var(--color-border)]"
                  }`}
                />
              ))}
              <span className="ml-3 flex items-center font-mono text-xs font-bold uppercase text-[var(--color-muted-fg)]">
                {selectedVariant.name}
              </span>
            </div>
          </div>

          {/* Technical info strip */}
          <div className="grid grid-cols-2 divide-x-2 divide-[var(--color-border)] border-b-2 border-[var(--color-border)] lg:border-b-0">
            <div className="p-4">
              <p className="font-mono text-[10px] uppercase text-[var(--color-muted)]">Categoría</p>
              <p className="mt-1 font-black text-sm uppercase">{product.category}</p>
            </div>
            <div className="p-4">
              <p className="font-mono text-[10px] uppercase text-[var(--color-muted)]">Variantes</p>
              <p className="mt-1 font-black text-sm uppercase">{product.variants.length} colores</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Info ── */}
        <div className="flex flex-col">
          {/* Header */}
          <div className="border-b-2 border-[var(--color-border)] p-8">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
              {product.category}
            </p>
            <h1 className="mt-2 font-black text-4xl uppercase leading-tight tracking-tight lg:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 font-black text-5xl tabular-nums">{price} €</p>
          </div>

          {/* Description */}
          <div className="border-b-2 border-[var(--color-border)] p-8">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] mb-3">
              DESCRIPCIÓN
            </p>
            <p className="font-mono text-sm leading-relaxed text-[var(--color-muted-fg)]">
              {product.description}
            </p>
          </div>

          {/* Add to cart */}
          <div className="border-b-2 border-[var(--color-border)] p-8">
            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`w-full border-2 border-[var(--color-border)] py-4 font-black text-sm uppercase tracking-wider transition-all disabled:opacity-70 ${
                added
                  ? "bg-[var(--color-success)] text-white border-[var(--color-success)]"
                  : "bg-[var(--color-foreground)] text-[var(--color-background)] hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)]"
              }`}
            >
              {added ? "✓ AÑADIDO AL CARRITO" : "AÑADIR AL CARRITO →"}
            </button>
            <p className="mt-3 font-mono text-[10px] text-center text-[var(--color-muted)] uppercase">
              Envío gratuito · Demo — sin pago real
            </p>
          </div>

          {/* Hotspots / features */}
          {product.hotspots.length > 0 && (
            <div className="flex-1 p-8">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] mb-4">
                CARACTERÍSTICAS
              </p>
              <ul className="space-y-0">
                {product.hotspots.map((h, i) => (
                  <li
                    key={h.id}
                    className="flex items-start gap-4 border-t-2 border-[var(--color-border)] py-4 first:border-t-0"
                  >
                    <span className="font-mono text-xs font-bold text-[var(--color-muted)] w-5 tabular-nums shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-black text-sm uppercase">{h.label}</p>
                      <p className="mt-0.5 font-mono text-xs text-[var(--color-muted-fg)]">
                        {h.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Back link */}
          <div className="border-t-2 border-[var(--color-border)] p-6">
            <Link
              href="/"
              className="font-mono text-xs font-bold uppercase text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
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
