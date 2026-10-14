import { getProducts } from "@/lib/products";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CartDrawer } from "@/components/shop/CartDrawer";

export default function HomePage() {
  const products = getProducts();

  return (
    <main>
      {/* Hero — 3D scene added in Task 6 */}
      <div className="flex h-[60vh] items-center justify-center border-b border-[var(--color-border)] bg-[var(--color-card)]">
        <p className="text-[var(--color-muted)] text-sm">Hero 3D — próximamente</p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="mb-8 text-2xl font-semibold">Nuestros Productos</h1>
        <ProductGrid products={products} />
      </div>

      <CartDrawer />
    </main>
  );
}
