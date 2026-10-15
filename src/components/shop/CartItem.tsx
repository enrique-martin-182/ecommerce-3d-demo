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
    <div className="flex items-start gap-4 p-5">
      {/* Color swatch */}
      <div
        className="h-14 w-14 shrink-0 rounded-lg flex items-end p-1.5"
        style={{ backgroundColor: variant?.color ?? "#1e2c31" }}
        aria-hidden="true"
      >
        <span
          className="select-none font-mono text-[9px] uppercase leading-none text-white"
          style={{ mixBlendMode: "difference" }}
        >
          {product.name.split(" ")[0].substring(0, 4)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <p className="text-sm font-medium uppercase leading-tight tracking-wide text-white truncate">
          {product.name}
        </p>
        <p className="text-xs text-[var(--color-ash-label)]">{variant?.name}</p>

        {/* Qty stepper */}
        <div className="mt-2.5 flex items-center gap-0">
          <button
            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
            aria-label="Reducir cantidad"
            className="flex h-7 w-7 items-center justify-center rounded-l-full border border-[var(--color-iron-veil)] text-sm text-[var(--color-ash-label)] transition-colors hover:border-[var(--color-tide-pool)] hover:text-white"
          >
            −
          </button>
          <span className="flex h-7 w-8 items-center justify-center border-y border-[var(--color-iron-veil)] text-xs tabular-nums text-white">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
            aria-label="Aumentar cantidad"
            className="flex h-7 w-7 items-center justify-center rounded-r-full border border-[var(--color-iron-veil)] text-sm text-[var(--color-ash-label)] transition-colors hover:border-[var(--color-tide-pool)] hover:text-white"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between gap-4">
        <span className="font-light text-lg tabular-nums text-[var(--color-mint-signal)]">
          {(price * item.quantity).toFixed(0)} €
        </span>
        <button
          onClick={() => removeItem(item.productId, item.variantId)}
          aria-label={`Eliminar ${product.name}`}
          className="text-[11px] uppercase tracking-wider text-[var(--color-ash-label)] transition-colors hover:text-[var(--color-error)]"
        >
          Quitar
        </button>
      </div>
    </div>
  );
}
