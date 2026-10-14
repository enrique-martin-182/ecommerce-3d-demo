"use client";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ProductModel } from "@/lib/types";

const HeroScene = dynamic(
  () => import("./HeroScene").then((m) => ({ default: m.HeroScene })),
  { ssr: false, loading: () => <Skeleton className="h-full w-full" /> }
);

export function HeroSceneClient({ model }: { model: ProductModel }) {
  return <HeroScene model={model} />;
}
