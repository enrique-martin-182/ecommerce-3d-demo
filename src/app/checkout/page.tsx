"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { StepIndicator } from "@/components/checkout/StepIndicator";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import type { ShippingData, PaymentData } from "@/lib/types";
import { getProduct, getProductPrice } from "@/lib/products";
import Link from "next/link";

type Step = 1 | 2 | "success";

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>(1);
  const [orderNumber, setOrderNumber] = useState(0);
  const { items, total, clearCart } = useCartStore();

  useEffect(() => {
    setOrderNumber(Math.floor(100000 + Math.random() * 900000));
  }, []);

  if (items.length === 0 && step !== "success") {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="font-light text-5xl uppercase tracking-wide text-[var(--color-ash-label)]">Vacío</p>
        <p className="mt-4 text-sm text-[var(--color-tide-pool)]">
          Tu carrito no tiene artículos.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-medium uppercase tracking-widest text-white transition-all hover:border-white/60 hover:bg-white/5"
        >
          ← Volver a la tienda
        </Link>
      </main>
    );
  }

  if (step === "success") {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="rounded-xl border border-[var(--color-iron-veil)] bg-[var(--color-forest-floor)] p-12">
          <p className="font-light text-6xl text-[var(--color-mint-signal)]">✓</p>
          <h1 className="mt-4 font-light text-3xl uppercase tracking-wide text-white">¡Pedido confirmado!</h1>
          <p className="mt-2 font-mono text-sm text-[var(--color-ash-label)]">
            Pedido #{orderNumber}
          </p>
          <p className="mt-4 text-xs text-[var(--color-tide-pool)] uppercase tracking-widest">
            Demo — no se procesó ningún pago real.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium uppercase tracking-widest text-black transition-all hover:bg-[var(--color-ghost-white)]"
          >
            ← Volver a la tienda
          </Link>
        </div>
      </main>
    );
  }

  function handleShipping(_data: ShippingData) {
    setStep(2);
  }

  function handlePayment(_data: PaymentData) {
    clearCart();
    setStep("success");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between border-b border-[var(--color-iron-veil)] pb-5">
        <h1 className="font-light text-3xl uppercase tracking-[0.04em] text-white">Checkout</h1>
        <Link
          href="/"
          className="text-xs font-medium uppercase tracking-wider text-[var(--color-ash-label)] transition-colors hover:text-[var(--color-mint-signal)]"
        >
          ← Seguir comprando
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-[1fr_280px]">
        {/* Left: steps */}
        <div className="space-y-5">
          <div className="rounded-xl border border-[var(--color-iron-veil)] bg-[var(--color-forest-floor)] p-1">
            <StepIndicator currentStep={step as 1 | 2} />
          </div>
          <div className="rounded-xl border border-[var(--color-iron-veil)] bg-[var(--color-forest-floor)] p-6">
            {step === 1 && <ShippingForm onSubmit={handleShipping} />}
            {step === 2 && (
              <PaymentForm onSubmit={handlePayment} onBack={() => setStep(1)} />
            )}
          </div>
        </div>

        {/* Right: order summary */}
        <div className="rounded-xl border border-[var(--color-iron-veil)] bg-[var(--color-forest-floor)] p-5 h-fit">
          <p className="mb-4 border-b border-[var(--color-iron-veil)] pb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ash-label)]">
            Resumen del pedido
          </p>
          <div className="space-y-3 border-b border-[var(--color-iron-veil)] pb-4">
            {items.map((item) => {
              const p = getProduct(item.productId);
              const unitPrice = p ? getProductPrice(p, item.variantId) : 0;
              return (
                <div key={`${item.productId}-${item.variantId}`} className="flex items-start justify-between gap-2">
                  <span className="text-xs text-[var(--color-tide-pool)] line-clamp-2 flex-1">
                    {p?.name ?? item.productId}
                    <span className="text-[var(--color-ash-label)]"> ×{item.quantity}</span>
                  </span>
                  <span className="text-sm font-medium tabular-nums text-white">
                    {(unitPrice * item.quantity).toFixed(0)} €
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-wider text-[var(--color-ash-label)]">Total</span>
            <span className="font-light text-3xl tabular-nums text-[var(--color-mint-signal)]">{total().toFixed(0)} €</span>
          </div>
          <p className="mt-3 text-center text-[11px] text-[var(--color-ash-label)] uppercase tracking-widest">
            Demo — pago simulado
          </p>
        </div>
      </div>
    </main>
  );
}
