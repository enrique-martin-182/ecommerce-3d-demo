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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={toggleDrawer}
            className="fixed inset-0 z-40 bg-black/60"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[360px] flex-col border-l-2 border-[var(--color-border)] bg-[var(--color-background)]"
            aria-label="Carrito de compra"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-[var(--color-border)] bg-[var(--color-foreground)] px-5 py-3 text-[var(--color-background)]">
              <h2 className="font-black text-sm uppercase tracking-tight">
                CARRITO [{count()}]
              </h2>
              <button
                onClick={toggleDrawer}
                aria-label="Cerrar carrito"
                className="border-2 border-[var(--color-background)]/40 px-3 py-1 font-mono text-xs font-bold uppercase text-[var(--color-background)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-foreground)]"
              >
                ✕ CERRAR
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                  <p className="font-black text-3xl uppercase text-[var(--color-muted)]">
                    VACÍO
                  </p>
                  <p className="font-mono text-xs text-[var(--color-muted-fg)]">
                    Tu carrito no tiene artículos.
                  </p>
                  <button
                    onClick={toggleDrawer}
                    className="border-2 border-[var(--color-border)] px-5 py-2 font-black text-xs uppercase transition-colors hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]"
                  >
                    Seguir comprando
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={`${item.productId}-${item.variantId}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.15 }}
                      className="border-b-2 border-[var(--color-border)] last:border-0"
                    >
                      <CartItem item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t-2 border-[var(--color-border)] p-5 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs font-bold uppercase text-[var(--color-muted)]">
                    TOTAL
                  </span>
                  <span className="font-black text-2xl tabular-nums">
                    {total().toFixed(0)} €
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={toggleDrawer}
                  className="flex h-12 w-full items-center justify-center border-2 border-[var(--color-border)] bg-[var(--color-foreground)] font-black text-sm uppercase text-[var(--color-background)] transition-all hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)]"
                >
                  FINALIZAR PEDIDO →
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
