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
        <p className="text-[var(--color-muted)]">Tu carrito está vacío.</p>
        <Link href="/" className="mt-4 inline-block text-sm underline">
          Volver a la tienda
        </Link>
      </main>
    );
  }

  if (step === "success") {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h1 className="text-2xl font-semibold">¡Pedido confirmado!</h1>
        <p className="mt-2 text-[var(--color-muted)]">Pedido #{orderNumber}</p>
        <p className="mt-4 text-sm text-[var(--color-muted)]">
          Esto es una demo. No se ha procesado ningún pago.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-xl bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-[var(--color-accent-fg)]"
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
    <main className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-6 text-2xl font-semibold text-center">Checkout</h1>
      <StepIndicator currentStep={step as 1 | 2} />

      <div className="rounded-2xl border border-[var(--color-border)] p-6 mb-6">
        {step === 1 && <ShippingForm onSubmit={handleShipping} />}
        {step === 2 && (
          <PaymentForm onSubmit={handlePayment} onBack={() => setStep(1)} />
        )}
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] p-4 text-sm">
        <p className="font-medium mb-2">Resumen del pedido</p>
        <div className="flex justify-between text-[var(--color-muted)]">
          <span>{items.length} artículo(s)</span>
          <span>{total().toFixed(0)} €</span>
        </div>
      </div>
    </main>
  );
}
