interface StepIndicatorProps {
  currentStep: 1 | 2;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: "ENVÍO" },
    { number: 2, label: "PAGO" },
  ];

  return (
    <div className="flex items-center">
      {steps.map((step, i) => (
        <div key={step.number} className="flex items-center flex-1">
          <div
            className={`flex h-10 flex-1 items-center justify-center gap-3 border-2 border-[var(--color-border)] font-mono text-xs font-bold uppercase transition-colors ${
              currentStep >= step.number
                ? "bg-[var(--color-foreground)] text-[var(--color-background)]"
                : "bg-[var(--color-surface)] text-[var(--color-muted)]"
            } ${i > 0 ? "border-l-0" : ""}`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center border font-black text-[10px] ${
                currentStep >= step.number
                  ? "border-[var(--color-background)]/40 text-[var(--color-background)]"
                  : "border-[var(--color-muted)] text-[var(--color-muted)]"
              }`}
            >
              {step.number}
            </span>
            {step.label}
          </div>
        </div>
      ))}
    </div>
  );
}
