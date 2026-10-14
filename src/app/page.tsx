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
      <section className="relative flex h-[80vh] items-end overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-card)]">
        {featured && (
          <div className="absolute inset-0">
            <HeroSceneClient model={featured.model} />
          </div>
        )}
        <div className="relative z-10 p-8 md:p-16">
          <p className="mb-2 text-xs font-mono uppercase tracking-widest text-[var(--color-muted)]">
            Producto destacado
          </p>
          <h1 className="text-4xl font-semibold md:text-6xl">
            {featured?.name}
          </h1>
          <p className="mt-2 text-[var(--color-muted)] max-w-md">
            {featured?.shortDescription}
          </p>
          <Link
            href={`/products/${featured?.slug}`}
            className="mt-6 inline-block rounded-xl bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-[var(--color-accent-fg)] transition-opacity hover:opacity-80"
          >
            Explorar en 3D
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-8 text-2xl font-semibold">Nuestros Productos</h2>
        <ProductGrid products={products} />
      </div>

      <CartDrawer />
    </main>
  );
}
