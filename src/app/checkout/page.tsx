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
        <p className="font-black text-5xl uppercase text-[var(--color-muted)]">VACÍO</p>
        <p className="mt-4 font-mono text-sm text-[var(--color-muted-fg)]">
          Tu carrito no tiene artículos.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center gap-2 border-2 border-[var(--color-border)] px-6 font-black text-sm uppercase transition-colors hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]"
        >
          ← Volver a la tienda
        </Link>
      </main>
    );
  }

  if (step === "success") {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-12">
          <p className="font-black text-6xl text-[var(--color-success)]">✓</p>
          <h1 className="mt-4 font-black text-3xl uppercase">¡PEDIDO OK!</h1>
          <p className="mt-2 font-mono text-sm text-[var(--color-muted-fg)]">
            Pedido #{orderNumber}
          </p>
          <p className="mt-4 font-mono text-xs text-[var(--color-muted)]">
            DEMO — no se procesó ningún pago real.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex h-11 items-center gap-2 border-2 border-[var(--color-border)] bg-[var(--color-foreground)] px-6 font-black text-sm uppercase text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)]"
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
      {/* Header bar */}
      <div className="mb-6 flex items-center justify-between border-b-2 border-[var(--color-border)] pb-4">
        <h1 className="font-black text-2xl uppercase tracking-tight">CHECKOUT</h1>
        <Link
          href="/"
          className="font-mono text-xs font-bold uppercase text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
        >
          ← Seguir comprando
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_260px]">
        {/* Left: steps */}
        <div className="space-y-4">
          <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-1">
            <StepIndicator currentStep={step as 1 | 2} />
          </div>
          <div className="border-2 border-[var(--color-border)] bg-[var(--color-card)] p-6">
            {step === 1 && <ShippingForm onSubmit={handleShipping} />}
            {step === 2 && (
              <PaymentForm onSubmit={handlePayment} onBack={() => setStep(1)} />
            )}
          </div>
        </div>

        {/* Right: order summary */}
        <div className="border-2 border-[var(--color-border)] bg-[var(--color-card)] p-5 h-fit">
          <p className="mb-4 border-b-2 border-[var(--color-border)] pb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
            RESUMEN DEL PEDIDO
          </p>
          <div className="space-y-2 border-b-2 border-[var(--color-border)] pb-4">
            {items.map((item) => {
              const p = getProduct(item.productId);
              const unitPrice = p ? getProductPrice(p, item.variantId) : 0;
              return (
                <div key={`${item.productId}-${item.variantId}`} className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs text-[var(--color-muted-fg)] line-clamp-2 flex-1">
                    {p?.name ?? item.productId}
                    <span className="text-[var(--color-muted)]"> ×{item.quantity}</span>
                  </span>
                  <span className="font-black text-sm tabular-nums">
                    {(unitPrice * item.quantity).toFixed(0)} €
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="font-mono text-xs font-bold uppercase text-[var(--color-muted)]">TOTAL</span>
            <span className="font-black text-2xl tabular-nums">{total().toFixed(0)} €</span>
          </div>
          <p className="mt-3 font-mono text-[10px] text-center text-[var(--color-muted)] uppercase">
            DEMO — pago simulado
          </p>
        </div>
      </div>
    </main>
  );
}
