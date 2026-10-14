interface StepIndicatorProps {
  currentStep: 1 | 2;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: "Envío" },
    { number: 2, label: "Pago" },
  ];

  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, i) => (
        <div key={step.number} className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold border-2 ${
                currentStep >= step.number
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                  : "border-[var(--color-border)] text-[var(--color-muted)]"
              }`}
            >
              {step.number}
            </div>
            <span
              className={`text-sm ${currentStep >= step.number ? "font-medium" : "text-[var(--color-muted)]"}`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-px w-16 ${currentStep > step.number ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
