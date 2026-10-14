"use client";
import { useProgress } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";

export function Loader3D() {
  const { progress, active } = useProgress();
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[var(--color-card)]"
          aria-live="polite"
          aria-label={`Cargando modelo 3D: ${Math.round(progress)}%`}
        >
          <div className="h-px w-48 bg-[var(--color-border)]">
            <motion.div
              className="h-full bg-[var(--color-foreground)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.15 }}
            />
          </div>
          <p className="mt-3 font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest">
            {Math.round(progress)}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
