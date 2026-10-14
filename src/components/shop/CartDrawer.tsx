"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { CartItem } from "./CartItem";

export function CartDrawer() {
  const { items, isOpen, toggleDrawer, total, count } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleDrawer}
            className="fixed inset-0 z-40 bg-black/40"
            aria-hidden="true"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-[var(--color-background)] shadow-2xl"
            aria-label="Carrito de compra"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
              <h2 className="font-semibold">Carrito ({count()})</h2>
              <button
                onClick={toggleDrawer}
                aria-label="Cerrar carrito"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] text-sm hover:bg-[var(--color-card)] transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4">
              {items.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-[var(--color-muted)]">
                    Tu carrito está vacío
                  </p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={`${item.productId}-${item.variantId}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-b border-[var(--color-border)] last:border-0"
                    >
                      <CartItem item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-[var(--color-border)] p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-muted)]">Subtotal</span>
                  <span className="font-semibold">{total().toFixed(0)} €</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={toggleDrawer}
                  className="block w-full rounded-xl bg-[var(--color-accent)] py-3 text-center text-sm font-medium text-[var(--color-accent-fg)] transition-opacity hover:opacity-80"
                >
                  Proceder al pago
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
