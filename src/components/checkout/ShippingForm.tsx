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
    <p className="mt-1 font-mono text-[10px] font-bold uppercase text-[var(--color-error)]">
      ✕ {message}
    </p>
  );
}

const labelClass = "mb-1 block font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)]";
const inputClass =
  "w-full border-2 border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2.5 font-mono text-sm placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors";

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
      <div className="grid grid-cols-2 gap-0">
        <div className="border-r-2 border-[var(--color-border)] pr-4">
          <label className={labelClass}>Nombre</label>
          <input {...register("firstName")} className={inputClass} placeholder="Juan" />
          <FieldError message={errors.firstName?.message} />
        </div>
        <div className="pl-4">
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

      <div className="grid grid-cols-2 gap-0">
        <div className="border-r-2 border-[var(--color-border)] pr-4">
          <label className={labelClass}>Ciudad</label>
          <input {...register("city")} className={inputClass} placeholder="Madrid" />
          <FieldError message={errors.city?.message} />
        </div>
        <div className="pl-4">
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
        className="w-full border-2 border-[var(--color-border)] bg-[var(--color-foreground)] py-3.5 font-black text-sm uppercase text-[var(--color-background)] transition-all hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)]"
      >
        CONTINUAR AL PAGO →
      </button>
    </form>
  );
}
