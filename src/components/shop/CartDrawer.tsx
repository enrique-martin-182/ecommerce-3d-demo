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
            transition={{ duration: 0.2 }}
            onClick={toggleDrawer}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[380px] flex-col border-l border-[var(--color-border)] bg-[var(--color-card)]"
            aria-label="Carrito de compra"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold">Carrito</h2>
                {count() > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--color-surface-raised)] px-1.5 text-[11px] font-medium tabular-nums">
                    {count()}
                  </span>
                )}
              </div>
              <button
                onClick={toggleDrawer}
                aria-label="Cerrar carrito"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted-fg)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M2 2l10 10M12 2L2 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-muted)]" aria-hidden="true">
                    <path d="M4 4h4l4 18h16l4-14H10" />
                    <circle cx="15" cy="30" r="2" fill="currentColor" stroke="none" />
                    <circle cx="27" cy="30" r="2" fill="currentColor" stroke="none" />
                  </svg>
                  <p className="text-sm text-[var(--color-muted-fg)]">
                    Tu carrito está vacío
                  </p>
                  <button
                    onClick={toggleDrawer}
                    className="text-xs text-[var(--color-muted)] underline underline-offset-2 hover:text-[var(--color-foreground)]"
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
                      transition={{ duration: 0.2 }}
                      className="border-b border-[var(--color-border)] last:border-0"
                    >
                      <CartItem item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[var(--color-border)] px-5 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-muted-fg)]">Subtotal</span>
                  <span className="text-base font-semibold tabular-nums">{total().toFixed(0)} €</span>
                </div>
                <p className="text-[11px] text-[var(--color-muted)] text-center">
                  Envío gratuito en pedidos superiores a 50 €
                </p>
                <Link
                  href="/checkout"
                  onClick={toggleDrawer}
                  className="flex h-11 w-full items-center justify-center rounded-lg bg-[var(--color-accent)] text-sm font-medium text-[var(--color-accent-fg)] transition-opacity hover:opacity-85"
                >
                  Finalizar pedido
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
