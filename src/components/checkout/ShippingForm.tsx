"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ShippingData } from "@/lib/types";

const shippingSchema = z.object({
  firstName: z.string().min(2, "Mínimo 2 caracteres"),
  lastName: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  address: z.string().min(5, "Introduce una dirección completa"),
  city: z.string().min(2, "Ciudad requerida"),
  postalCode: z.string().regex(/^\d{4,10}$/, "Código postal inválido"),
  country: z.string().min(2, "País requerido"),
});

interface ShippingFormProps {
  onSubmit: (data: ShippingData) => void;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2.5 text-sm placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]";

export function ShippingForm({ onSubmit }: ShippingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingData>({
    resolver: zodResolver(shippingSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nombre" error={errors.firstName?.message}>
          <input
            {...register("firstName")}
            className={inputClass}
            placeholder="Juan"
          />
        </Field>
        <Field label="Apellidos" error={errors.lastName?.message}>
          <input
            {...register("lastName")}
            className={inputClass}
            placeholder="García"
          />
        </Field>
      </div>
      <Field label="Email" error={errors.email?.message}>
        <input
          {...register("email")}
          type="email"
          className={inputClass}
          placeholder="juan@ejemplo.com"
        />
      </Field>
      <Field label="Dirección" error={errors.address?.message}>
        <input
          {...register("address")}
          className={inputClass}
          placeholder="Calle Mayor 1, 2ºA"
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Ciudad" error={errors.city?.message}>
          <input
            {...register("city")}
            className={inputClass}
            placeholder="Madrid"
          />
        </Field>
        <Field label="Código postal" error={errors.postalCode?.message}>
          <input
            {...register("postalCode")}
            className={inputClass}
            placeholder="28001"
          />
        </Field>
      </div>
      <Field label="País" error={errors.country?.message}>
        <input
          {...register("country")}
          className={inputClass}
          placeholder="España"
        />
      </Field>
      <button
        type="submit"
        className="w-full rounded-xl bg-[var(--color-accent)] py-3 text-sm font-medium text-[var(--color-accent-fg)] transition-opacity hover:opacity-80"
      >
        Continuar al pago →
      </button>
    </form>
  );
}
