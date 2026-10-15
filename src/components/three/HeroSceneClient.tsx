"use client";
import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ProductModel } from "@/lib/types";

const HeroScene = dynamic(
  () => import("./HeroScene").then((m) => ({ default: m.HeroScene })),
  { ssr: false, loading: () => <Skeleton className="h-full w-full" /> }
);

class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <div className="h-full w-full bg-[var(--color-card)]" />;
    }
    return this.props.children;
  }
}

export function HeroSceneClient({ model }: { model: ProductModel }) {
  return (
    <SceneErrorBoundary>
      <HeroScene model={model} />
    </SceneErrorBoundary>
  );
}
