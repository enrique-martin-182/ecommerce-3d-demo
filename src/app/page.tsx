import { getFeaturedProduct, getProducts } from "@/lib/products";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CartDrawer } from "@/components/shop/CartDrawer";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const products = getProducts();
  const featured = getFeaturedProduct();

  return (
    <main>
      {/* ── HERO ── */}
      <section className="border-b border-[var(--color-iron-veil)]">
        {/* Announcement bar */}
        <div className="border-b border-[var(--color-moss-border)] bg-[var(--color-deep-canopy)] px-6 py-2.5">
          <p className="font-mono text-xs tracking-widest text-[var(--color-mint-signal)] uppercase text-center">
            ✦ TIENDA DEMO — VISOR 3D INTERACTIVO ✦
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_1fr] min-h-[85vh]">
          {/* Left: text */}
          <div className="flex flex-col border-r border-[var(--color-iron-veil)] px-10 py-16 md:px-14 gap-10">
            <div className="flex flex-col gap-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-ash-label)]">
                Producto destacado · 01
              </p>
              <h1
                className="font-light uppercase leading-[0.9] tracking-[0.02em] text-white"
                style={{ fontSize: "clamp(3rem,7vw,6rem)" }}
              >
                {featured?.name ?? "STORE 3D"}
              </h1>
              <p className="max-w-sm text-sm leading-relaxed text-[var(--color-tide-pool)]">
                {featured?.shortDescription}
              </p>
            </div>

            <div className="mt-auto flex flex-col gap-6">
              <div className="flex items-baseline gap-3">
                <span
                  className="font-light tabular-nums text-[var(--color-mint-signal)]"
                  style={{ fontSize: "clamp(2rem,4vw,3rem)" }}
                >
                  {featured?.price} €
                </span>
                <span className="font-mono text-xs text-[var(--color-ash-label)]">IVA incl.</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/products/${featured?.slug}`}
                  className="rounded-full bg-white px-7 py-3 text-sm font-medium uppercase tracking-widest text-black transition-all hover:bg-[var(--color-ghost-white)]"
                >
                  Explorar en 3D
                </Link>
                <Link
                  href="/#productos"
                  className="rounded-full border border-white/30 px-7 py-3 text-sm font-medium uppercase tracking-widest text-white transition-all hover:border-white/60 hover:bg-white/5"
                >
                  Ver todo
                </Link>
              </div>
            </div>
          </div>

          {/* Right: product image */}
          {featured && (
            <div className="relative overflow-hidden bg-[var(--color-forest-floor)]">
              <Image
                src={featured.fallbackImage}
                alt={featured.name}
                fill
                className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                priority
                unoptimized
              />
              {/* Bottom gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-abyssal-ink)]/70 via-transparent to-transparent" />
              {/* Product name */}
              <div className="absolute bottom-8 left-8">
                <span
                  className="block font-light uppercase leading-none tracking-[0.04em] text-white"
                  style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}
                  aria-hidden="true"
                >
                  {featured.name.split(" ")[0]}
                </span>
                <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-mint-signal)]">
                  3D · Interactivo
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── TICKER ── */}
      <div
        className="overflow-hidden border-b border-[var(--color-iron-veil)] py-3"
        style={{ background: "linear-gradient(rgb(36,71,73) 0%, rgb(24,46,47) 100%)" }}
      >
        <p className="animate-[ticker_20s_linear_infinite] whitespace-nowrap font-mono text-[11px] uppercase tracking-widest text-[var(--color-mint-signal)]">
          &nbsp;&nbsp;ELECTRÓNICA&nbsp;&nbsp;·&nbsp;&nbsp;MUEBLES&nbsp;&nbsp;·&nbsp;&nbsp;ACCESORIOS&nbsp;&nbsp;·&nbsp;&nbsp;CALZADO&nbsp;&nbsp;·&nbsp;&nbsp;VISOR 3D INTERACTIVO&nbsp;&nbsp;·&nbsp;&nbsp;ROTA · CAMBIA COLOR · DESCUBRE&nbsp;&nbsp;·&nbsp;&nbsp;ELECTRÓNICA&nbsp;&nbsp;·&nbsp;&nbsp;MUEBLES&nbsp;&nbsp;·&nbsp;&nbsp;ACCESORIOS&nbsp;&nbsp;·&nbsp;&nbsp;CALZADO&nbsp;&nbsp;·&nbsp;&nbsp;VISOR 3D&nbsp;&nbsp;·&nbsp;&nbsp;
        </p>
      </div>

      {/* ── PRODUCT SECTION ── */}
      <section id="productos" className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="mb-10 flex items-end justify-between border-b border-[var(--color-iron-veil)] pb-6">
          <div className="flex items-baseline gap-4">
            <h2 className="font-light text-4xl uppercase tracking-[0.04em] text-white">
              Productos
            </h2>
            <span className="font-mono text-xs text-[var(--color-mint-signal)]">
              [{products.length}]
            </span>
          </div>
        </div>
        <ProductGrid products={products} />
      </section>

      <CartDrawer />

      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </main>
  );
}
