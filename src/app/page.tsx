import { getFeaturedProduct, getProducts } from "@/lib/products";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { HeroSceneClient } from "@/components/three/HeroSceneClient";
import Link from "next/link";

export default function HomePage() {
  const products = getProducts();
  const featured = getFeaturedProduct();

  return (
    <main>
      {/* Hero */}
      <section className="relative flex min-h-[88vh] items-end overflow-hidden border-b border-[var(--color-border)]">
        {/* Background gradient — visible when 3D fails */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(255,255,255,0.04) 0%, transparent 70%), linear-gradient(135deg, #080808 0%, #0f0f0f 100%)",
          }}
          aria-hidden="true"
        />
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
          aria-hidden="true"
        />

        {featured && (
          <div className="absolute inset-0">
            <HeroSceneClient model={featured.model} />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 w-full px-6 pb-14 pt-32 md:px-16 md:pb-20">
          <div className="max-w-xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-medium text-[var(--color-muted-fg)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
              Producto destacado
            </p>
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
              {featured?.name}
            </h1>
            <p className="mt-4 text-base text-[var(--color-muted-fg)] md:text-lg">
              {featured?.shortDescription}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={`/products/${featured?.slug}`}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 text-sm font-medium text-[var(--color-accent-fg)] transition-opacity hover:opacity-85"
              >
                Explorar en 3D
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4" />
                </svg>
              </Link>
              <span className="text-sm text-[var(--color-muted)]">
                {featured?.price} €
              </span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 right-6 z-10 hidden md:flex flex-col items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] [writing-mode:vertical-rl]">
            scroll
          </span>
          <div className="h-8 w-px bg-[var(--color-border)]" />
        </div>
      </section>

      {/* Product section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-muted)]">
              Colección
            </p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight">
              Todos los productos
            </h2>
          </div>
          <p className="text-sm text-[var(--color-muted-fg)]">
            {products.length} artículos
          </p>
        </div>
        <ProductGrid products={products} />
      </section>

      <CartDrawer />
    </main>
  );
}
