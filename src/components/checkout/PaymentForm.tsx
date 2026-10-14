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

const inputClass =
  "w-full rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2.5 text-sm placeholder:text-[var(--color-muted)] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]";

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
        <label className="mb-1 block text-sm font-medium">
          Titular de la tarjeta
        </label>
        <input
          {...register("cardName")}
          className={inputClass}
          placeholder="JUAN GARCIA"
        />
        {errors.cardName && (
          <p className="mt-1 text-xs text-red-500">{errors.cardName.message}</p>
        )}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">
          Número de tarjeta
        </label>
        <input
          {...register("cardNumber")}
          onChange={formatCardNumber}
          className={inputClass}
          placeholder="4111111111111111"
          maxLength={16}
          inputMode="numeric"
        />
        {errors.cardNumber && (
          <p className="mt-1 text-xs text-red-500">
            {errors.cardNumber.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Caducidad</label>
          <input
            {...register("expiry")}
            onChange={formatExpiry}
            className={inputClass}
            placeholder="MM/AA"
            maxLength={5}
            inputMode="numeric"
          />
          {errors.expiry && (
            <p className="mt-1 text-xs text-red-500">{errors.expiry.message}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">CVV</label>
          <input
            {...register("cvv")}
            className={inputClass}
            placeholder="123"
            maxLength={4}
            inputMode="numeric"
            type="password"
          />
          {errors.cvv && (
            <p className="mt-1 text-xs text-red-500">{errors.cvv.message}</p>
          )}
        </div>
      </div>

      <p className="text-xs text-[var(--color-muted)]">
        🔒 Demo — no se procesan pagos reales. Usa 4111111111111111 para probar.
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-xl border border-[var(--color-border)] py-3 text-sm transition-colors hover:bg-[var(--color-card)]"
        >
          ← Volver
        </button>
        <button
          type="submit"
          className="flex-1 rounded-xl bg-[var(--color-accent)] py-3 text-sm font-medium text-[var(--color-accent-fg)] transition-opacity hover:opacity-80"
        >
          Confirmar pedido
        </button>
      </div>
    </form>
  );
}
