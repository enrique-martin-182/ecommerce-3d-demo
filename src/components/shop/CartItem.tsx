"use client";
import { useCartStore } from "@/store/cart";
import { getProduct, getProductPrice } from "@/lib/products";
import type { CartItem as CartItemType } from "@/lib/types";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartStore();
  const product = getProduct(item.productId);
  if (!product) return null;

  const variant = product.variants.find((v) => v.id === item.variantId);
  const price = getProductPrice(product, item.variantId);

  return (
    <div className="flex items-start gap-3 px-5 py-4">
      {/* Color swatch */}
      <div
        className="h-10 w-10 shrink-0 rounded-lg border border-[var(--color-border)]"
        style={{ backgroundColor: variant?.color ?? "#888" }}
        aria-hidden="true"
      />

      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <p className="text-sm font-medium leading-snug truncate">{product.name}</p>
        <p className="text-xs text-[var(--color-muted-fg)]">{variant?.name}</p>

        {/* Qty stepper */}
        <div className="mt-2 flex items-center gap-1.5">
          <button
            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
            aria-label="Reducir cantidad"
            className="flex h-6 w-6 items-center justify-center rounded border border-[var(--color-border)] text-sm leading-none transition-colors hover:bg-[var(--color-surface-raised)] hover:border-[var(--color-muted)]"
          >
            −
          </button>
          <span className="w-5 text-center text-xs tabular-nums">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
            aria-label="Aumentar cantidad"
            className="flex h-6 w-6 items-center justify-center rounded border border-[var(--color-border)] text-sm leading-none transition-colors hover:bg-[var(--color-surface-raised)] hover:border-[var(--color-muted)]"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="text-sm font-semibold tabular-nums">
          {(price * item.quantity).toFixed(0)} €
        </span>
        <button
          onClick={() => removeItem(item.productId, item.variantId)}
          aria-label={`Eliminar ${product.name}`}
          className="text-[11px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-error)]"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
