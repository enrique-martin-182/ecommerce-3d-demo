"use client";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Product, ProductVariant } from "@/lib/types";

const ProductViewer = dynamic(
  () => import("./ProductViewer").then((m) => ({ default: m.ProductViewer })),
  {
    ssr: false,
    loading: () => <Skeleton className="aspect-square w-full rounded-2xl" />,
  }
);

export function ProductViewerClient({
  product,
  selectedVariant,
}: {
  product: Product;
  selectedVariant: ProductVariant;
}) {
  return <ProductViewer product={product} selectedVariant={selectedVariant} />;
}
