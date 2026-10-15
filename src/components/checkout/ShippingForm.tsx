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
  return (
    <p className="mt-1 text-[11px] text-[var(--color-error)]">✕ {message}</p>
  );
}

const labelClass = "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ash-label)]";
const inputClass =
  "w-full rounded-lg border border-[var(--color-iron-veil)] bg-[var(--color-deep-canopy)] px-3 py-2.5 text-sm text-white placeholder:text-[var(--color-ash-label)] focus:border-[var(--color-tide-pool)] focus:outline-none transition-colors";

export function ShippingForm({ onSubmit }: ShippingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingData>({
    resolver: zodResolver(shippingSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nombre</label>
          <input {...register("firstName")} className={inputClass} placeholder="Juan" />
          <FieldError message={errors.firstName?.message} />
        </div>
        <div>
          <label className={labelClass}>Apellidos</label>
          <input {...register("lastName")} className={inputClass} placeholder="García" />
          <FieldError message={errors.lastName?.message} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Email</label>
        <input {...register("email")} type="email" className={inputClass} placeholder="juan@ejemplo.com" />
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <label className={labelClass}>Dirección</label>
        <input {...register("address")} className={inputClass} placeholder="Calle Mayor 1, 2ºA" />
        <FieldError message={errors.address?.message} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Ciudad</label>
          <input {...register("city")} className={inputClass} placeholder="Madrid" />
          <FieldError message={errors.city?.message} />
        </div>
        <div>
          <label className={labelClass}>Código postal</label>
          <input {...register("postalCode")} className={inputClass} placeholder="28001" />
          <FieldError message={errors.postalCode?.message} />
        </div>
      </div>

      <div>
        <label className={labelClass}>País</label>
        <input {...register("country")} className={inputClass} placeholder="España" />
        <FieldError message={errors.country?.message} />
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-white py-3.5 text-sm font-medium uppercase tracking-widest text-black transition-all hover:bg-[var(--color-ghost-white)]"
      >
        Continuar al pago →
      </button>
    </form>
  );
}
