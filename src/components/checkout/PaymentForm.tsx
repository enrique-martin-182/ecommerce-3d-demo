"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { PaymentData } from "@/lib/types";

function luhn(cardNumber: string): boolean {
  const digits = cardNumber
    .replace(/\s/g, "")
    .split("")
    .reverse()
    .map(Number);
  const sum = digits.reduce((acc, digit, i) => {
    if (i % 2 === 1) {
      const doubled = digit * 2;
      return acc + (doubled > 9 ? doubled - 9 : doubled);
    }
    return acc + digit;
  }, 0);
  return sum % 10 === 0;
}

const paymentSchema = z.object({
  cardName: z.string().min(3, "Nombre requerido"),
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, "16 dígitos requeridos")
    .refine(luhn, "Número de tarjeta inválido"),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Formato MM/AA")
    .refine((val) => {
      const [month, year] = val.split("/").map(Number);
      const now = new Date();
      const expDate = new Date(2000 + year, month - 1);
      return expDate > now;
    }, "Tarjeta caducada"),
  cvv: z.string().regex(/^\d{3,4}$/, "3 o 4 dígitos"),
});

interface PaymentFormProps {
  onSubmit: (data: PaymentData) => void;
  onBack: () => void;
}

const labelClass = "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ash-label)]";
const inputClass =
  "w-full rounded-lg border border-[var(--color-iron-veil)] bg-[var(--color-deep-canopy)] px-3 py-2.5 text-sm text-white placeholder:text-[var(--color-ash-label)] focus:border-[var(--color-tide-pool)] focus:outline-none transition-colors";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-[11px] text-[var(--color-error)]">✕ {message}</p>
  );
}

export function PaymentForm({ onSubmit, onBack }: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentData>({
    resolver: zodResolver(paymentSchema),
  });

  function formatCardNumber(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    setValue("cardNumber", raw, { shouldValidate: true });
    e.target.value = raw;
  }

  function formatExpiry(e: React.ChangeEvent<HTMLInputElement>) {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) raw = raw.slice(0, 2) + "/" + raw.slice(2);
    setValue("expiry", raw, { shouldValidate: true });
    e.target.value = raw;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className={labelClass}>Titular de la tarjeta</label>
        <input
          {...register("cardName")}
          className={inputClass}
          placeholder="Juan García"
        />
        <FieldError message={errors.cardName?.message} />
      </div>

      <div>
        <label className={labelClass}>Número de tarjeta</label>
        <input
          {...register("cardNumber")}
          onChange={formatCardNumber}
          className={inputClass}
          placeholder="4111111111111111"
          maxLength={16}
          inputMode="numeric"
        />
        <FieldError message={errors.cardNumber?.message} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Caducidad</label>
          <input
            {...register("expiry")}
            onChange={formatExpiry}
            className={inputClass}
            placeholder="MM/AA"
            maxLength={5}
            inputMode="numeric"
          />
          <FieldError message={errors.expiry?.message} />
        </div>
        <div>
          <label className={labelClass}>CVV</label>
          <input
            {...register("cvv")}
            className={inputClass}
            placeholder="123"
            maxLength={4}
            inputMode="numeric"
            type="password"
          />
          <FieldError message={errors.cvv?.message} />
        </div>
      </div>

      <div className="rounded-lg border border-[var(--color-moss-border)] bg-[var(--color-deep-canopy)] p-3.5">
        <p className="text-[11px] text-[var(--color-tide-pool)]">
          Demo — sin pagos reales · Prueba con:{" "}
          <span className="font-mono text-[var(--color-mint-signal)]">4111111111111111</span>
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-full border border-white/30 py-3.5 text-xs font-medium uppercase tracking-wider text-white transition-all hover:border-white/60 hover:bg-white/5"
        >
          ← Volver
        </button>
        <button
          type="submit"
          className="flex-[2] rounded-full bg-white py-3.5 text-xs font-medium uppercase tracking-widest text-black transition-all hover:bg-[var(--color-ghost-white)]"
        >
          Confirmar pedido →
        </button>
      </div>
    </form>
  );
}
