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
    <div className="flex items-start gap-3 p-4">
      {/* Color swatch as placeholder */}
      <div
        className="h-14 w-14 shrink-0 border-2 border-[var(--color-border)] flex items-end p-1"
        style={{ backgroundColor: variant?.color ?? "#888" }}
        aria-hidden="true"
      >
        <span
          className="select-none font-black text-[10px] uppercase leading-none"
          style={{ color: "white", mixBlendMode: "difference" }}
        >
          {product.name.split(" ")[0].substring(0, 4)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <p className="font-black text-sm uppercase leading-tight tracking-tight truncate">
          {product.name}
        </p>
        <p className="font-mono text-[11px] text-[var(--color-muted-fg)]">
          {variant?.name}
        </p>

        {/* Qty stepper */}
        <div className="mt-2 flex items-center gap-0">
          <button
            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
            aria-label="Reducir cantidad"
            className="flex h-7 w-7 items-center justify-center border-2 border-[var(--color-border)] font-bold text-sm transition-colors hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]"
          >
            −
          </button>
          <span className="flex h-7 w-8 items-center justify-center border-y-2 border-[var(--color-border)] font-mono text-xs font-bold tabular-nums">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
            aria-label="Aumentar cantidad"
            className="flex h-7 w-7 items-center justify-center border-2 border-l-0 border-[var(--color-border)] font-bold text-sm transition-colors hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between gap-4">
        <span className="font-black text-base tabular-nums">
          {(price * item.quantity).toFixed(0)} €
        </span>
        <button
          onClick={() => removeItem(item.productId, item.variantId)}
          aria-label={`Eliminar ${product.name}`}
          className="font-mono text-[10px] font-bold uppercase text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
        >
          QUITAR
        </button>
      </div>
    </div>
  );
}
