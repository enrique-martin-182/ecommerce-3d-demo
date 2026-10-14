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
    <div className="flex items-start gap-3 py-4">
      <div
        className="h-10 w-10 shrink-0 rounded-lg border border-[var(--color-border)]"
        style={{ backgroundColor: variant?.color ?? "#ccc" }}
        aria-hidden="true"
      />
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <p className="text-sm font-medium truncate">{product.name}</p>
        <p className="text-xs text-[var(--color-muted)]">{variant?.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() =>
              updateQuantity(item.productId, item.variantId, item.quantity - 1)
            }
            aria-label="Reducir cantidad"
            className="flex h-6 w-6 items-center justify-center rounded border border-[var(--color-border)] text-sm hover:bg-[var(--color-card)]"
          >
            −
          </button>
          <span className="text-sm tabular-nums">{item.quantity}</span>
          <button
            onClick={() =>
              updateQuantity(item.productId, item.variantId, item.quantity + 1)
            }
            aria-label="Aumentar cantidad"
            className="flex h-6 w-6 items-center justify-center rounded border border-[var(--color-border)] text-sm hover:bg-[var(--color-card)]"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="text-sm font-semibold">
          {(price * item.quantity).toFixed(0)} €
        </span>
        <button
          onClick={() => removeItem(item.productId, item.variantId)}
          aria-label={`Eliminar ${product.name}`}
          className="text-xs text-[var(--color-muted)] hover:text-red-500 transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
