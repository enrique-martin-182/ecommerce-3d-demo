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
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[380px] flex-col border-l border-[var(--color-iron-veil)] bg-[var(--color-forest-floor)]"
            aria-label="Carrito de compra"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-iron-veil)] px-6 py-4">
              <h2 className="font-light text-base uppercase tracking-[0.12em] text-white">
                Carrito <span className="text-[var(--color-mint-signal)]">[{count()}]</span>
              </h2>
              <button
                onClick={toggleDrawer}
                aria-label="Cerrar carrito"
                className="rounded-full border border-[var(--color-iron-veil)] px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-[var(--color-ash-label)] transition-colors hover:border-[var(--color-tide-pool)] hover:text-white"
              >
                ✕ Cerrar
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center">
                  <p className="font-light text-3xl uppercase tracking-wide text-[var(--color-ash-label)]">
                    Vacío
                  </p>
                  <p className="text-sm text-[var(--color-tide-pool)]">
                    Tu carrito no tiene artículos.
                  </p>
                  <button
                    onClick={toggleDrawer}
                    className="rounded-full border border-white/30 px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition-all hover:border-white/60 hover:bg-white/5"
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
                      className="border-b border-[var(--color-iron-veil)] last:border-0"
                    >
                      <CartItem item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[var(--color-iron-veil)] p-6 space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-wider text-[var(--color-ash-label)]">
                    Total
                  </span>
                  <span className="font-light text-3xl tabular-nums text-[var(--color-mint-signal)]">
                    {total().toFixed(0)} €
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={toggleDrawer}
                  className="flex h-12 w-full items-center justify-center rounded-full bg-white text-sm font-medium uppercase tracking-widest text-black transition-all hover:bg-[var(--color-ghost-white)]"
                >
                  Finalizar pedido →
                </Link>
                <p className="text-center text-[11px] text-[var(--color-ash-label)]">
                  Demo — sin pago real
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
