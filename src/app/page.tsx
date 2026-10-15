import { getFeaturedProduct, getProducts } from "@/lib/products";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CartDrawer } from "@/components/shop/CartDrawer";
import Link from "next/link";

export default function HomePage() {
  const products = getProducts();
  const featured = getFeaturedProduct();

  return (
    <main>
      {/* ── HERO ── */}
      <section className="border-b-2 border-[var(--color-border)]">
        {/* Top strip */}
        <div className="border-b-2 border-[var(--color-border)] bg-[var(--color-accent)] px-6 py-2">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-white">
            ★ TIENDA DEMO — VISOR 3D INTERACTIVO ★
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_1fr] min-h-[80vh]">
          {/* Left: text */}
          <div className="flex flex-col justify-between border-r-2 border-[var(--color-border)] p-8 md:p-12">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-muted)]">
                Producto destacado / 01
              </p>
              <h1 className="mt-4 font-black uppercase leading-[0.9] text-[clamp(3rem,10vw,7rem)] tracking-tight">
                {featured?.name ?? "STORE 3D"}
              </h1>
              <p className="mt-6 max-w-sm font-mono text-sm text-[var(--color-muted-fg)]">
                {featured?.shortDescription}
              </p>
            </div>

            <div className="mt-12 flex flex-col gap-4">
              <div className="flex items-baseline gap-4">
                <span className="font-black text-5xl tabular-nums">
                  {featured?.price} €
                </span>
                <span className="font-mono text-xs text-[var(--color-muted)]">IVA incl.</span>
              </div>
              <div className="flex gap-0">
                <Link
                  href={`/products/${featured?.slug}`}
                  className="border-2 border-[var(--color-border)] bg-[var(--color-foreground)] px-8 py-4 font-black text-sm uppercase text-[var(--color-background)] transition-all hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)]"
                >
                  Explorar en 3D →
                </Link>
                <Link
                  href="/#productos"
                  className="border-2 border-l-0 border-[var(--color-border)] px-8 py-4 font-black text-sm uppercase transition-all hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]"
                >
                  Ver todo
                </Link>
              </div>
            </div>
          </div>

          {/* Right: CSS placeholder for featured product */}
          <div
            className="relative flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: featured?.variants[0]?.color ?? "#cccccc" }}
            aria-label={`Imagen placeholder de ${featured?.name}`}
          >
            <span
              className="select-none font-black uppercase leading-none text-[clamp(3rem,8vw,6rem)] tracking-tighter"
              style={{ color: "white", mixBlendMode: "difference" }}
              aria-hidden="true"
            >
              {featured?.name?.split(" ")[0] ?? "3D"}
            </span>
            <div className="absolute bottom-4 right-4 border-2 border-white/40 px-3 py-1">
              <span className="font-mono text-[10px] font-bold uppercase text-white/70">
                placeholder
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="overflow-hidden border-b-2 border-[var(--color-border)] bg-[var(--color-foreground)] py-2.5">
        <p className="animate-[ticker_15s_linear_infinite] whitespace-nowrap font-mono text-xs font-bold uppercase text-[var(--color-background)]">
          &nbsp;&nbsp;ELECTRÓNICA&nbsp;&nbsp;//&nbsp;&nbsp;MUEBLES&nbsp;&nbsp;//&nbsp;&nbsp;ACCESORIOS&nbsp;&nbsp;//&nbsp;&nbsp;CALZADO&nbsp;&nbsp;//&nbsp;&nbsp;VISOR 3D INTERACTIVO&nbsp;&nbsp;//&nbsp;&nbsp;ROTA · CAMBIA COLOR · DESCUBRE&nbsp;&nbsp;//&nbsp;&nbsp;ELECTRÓNICA&nbsp;&nbsp;//&nbsp;&nbsp;MUEBLES&nbsp;&nbsp;//&nbsp;&nbsp;ACCESORIOS&nbsp;&nbsp;//&nbsp;&nbsp;CALZADO&nbsp;&nbsp;//&nbsp;&nbsp;VISOR 3D&nbsp;&nbsp;//&nbsp;&nbsp;
        </p>
      </div>

      {/* ── PRODUCT SECTION ── */}
      <section id="productos" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex items-end justify-between border-b-2 border-[var(--color-border)] pb-4">
          <div className="flex items-baseline gap-4">
            <h2 className="font-black text-3xl uppercase tracking-tight">
              Productos
            </h2>
            <span className="font-mono text-xs text-[var(--color-muted)]">
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
