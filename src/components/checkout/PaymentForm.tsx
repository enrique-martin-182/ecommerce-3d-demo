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

const labelClass = "mb-1 block font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)]";
const inputClass =
  "w-full border-2 border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2.5 font-mono text-sm placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 font-mono text-[10px] font-bold uppercase text-[var(--color-error)]">
      ✕ {message}
    </p>
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className={labelClass}>Titular de la tarjeta</label>
        <input
          {...register("cardName")}
          className={inputClass}
          placeholder="JUAN GARCIA"
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

      <div className="grid grid-cols-2 gap-0">
        <div className="border-r-2 border-[var(--color-border)] pr-4">
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
        <div className="pl-4">
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

      <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-3">
        <p className="font-mono text-[10px] font-bold uppercase text-[var(--color-muted)]">
          DEMO — sin pagos reales · Prueba con: 4111111111111111
        </p>
      </div>

      <div className="flex gap-0">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border-2 border-[var(--color-border)] border-r-0 py-3.5 font-black text-xs uppercase transition-colors hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]"
        >
          ← VOLVER
        </button>
        <button
          type="submit"
          className="flex-[2] border-2 border-[var(--color-border)] bg-[var(--color-foreground)] py-3.5 font-black text-xs uppercase text-[var(--color-background)] transition-all hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)]"
        >
          CONFIRMAR PEDIDO →
        </button>
      </div>
    </form>
  );
}
