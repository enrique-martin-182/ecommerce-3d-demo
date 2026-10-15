"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { StepIndicator } from "@/components/checkout/StepIndicator";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import type { ShippingData, PaymentData } from "@/lib/types";
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
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-card)]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-muted-fg)]" aria-hidden="true">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold">Carrito vacío</h1>
        <p className="mt-2 text-sm text-[var(--color-muted-fg)]">Añade productos antes de continuar.</p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--color-border)] px-5 text-sm font-medium transition-colors hover:bg-[var(--color-surface)]"
        >
          Volver a la tienda
        </Link>
      </main>
    );
  }

  if (step === "success") {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-card)]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-success)]" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold">¡Pedido confirmado!</h1>
        <p className="mt-2 text-sm text-[var(--color-muted-fg)]">
          Pedido #{orderNumber}
        </p>
        <p className="mt-4 text-xs text-[var(--color-muted)]">
          Demo — no se ha procesado ningún pago.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 text-sm font-medium text-[var(--color-accent-fg)] transition-opacity hover:opacity-85"
        >
          Volver a la tienda
        </Link>
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
    <main className="mx-auto max-w-2xl px-4 py-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Checkout</h1>
        <Link
          href="/"
          className="text-xs text-[var(--color-muted-fg)] transition-colors hover:text-[var(--color-foreground)]"
        >
          ← Seguir comprando
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_280px]">
        {/* Left: steps */}
        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-1">
            <StepIndicator currentStep={step as 1 | 2} />
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
            {step === 1 && <ShippingForm onSubmit={handleShipping} />}
            {step === 2 && (
              <PaymentForm onSubmit={handlePayment} onBack={() => setStep(1)} />
            )}
          </div>
        </div>

        {/* Right: order summary */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 h-fit">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
            Resumen
          </p>
          <div className="space-y-2 border-b border-[var(--color-border)] pb-4">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="flex items-center justify-between gap-2 text-xs">
                <span className="text-[var(--color-muted-fg)] line-clamp-1 flex-1">
                  {item.productName} × {item.quantity}
                </span>
                <span className="tabular-nums font-medium">
                  {(item.price * item.quantity).toFixed(0)} €
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-[var(--color-muted-fg)]">Total</span>
            <span className="text-base font-semibold tabular-nums">{total().toFixed(0)} €</span>
          </div>
          <p className="mt-3 text-[11px] text-center text-[var(--color-muted)]">
            Demo — pago simulado
          </p>
        </div>
      </div>
    </main>
  );
}
