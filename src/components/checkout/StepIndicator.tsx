interface StepIndicatorProps {
  currentStep: 1 | 2;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: "Envío" },
    { number: 2, label: "Pago" },
  ];

  return (
    <div className="flex items-center gap-1 p-1">
      {steps.map((step) => (
        <div
          key={step.number}
          className={`flex h-9 flex-1 items-center justify-center gap-2.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
            currentStep >= step.number
              ? "bg-white text-black"
              : "text-[var(--color-ash-label)]"
          }`}
        >
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
              currentStep >= step.number
                ? "bg-[var(--color-mint-signal)] text-black"
                : "border border-[var(--color-iron-veil)] text-[var(--color-ash-label)]"
            }`}
          >
            {step.number}
          </span>
          {step.label}
        </div>
      ))}
    </div>
  );
}
