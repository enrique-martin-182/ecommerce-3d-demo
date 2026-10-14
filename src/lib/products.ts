import productsData from "../../data/products.json";
import type { Product } from "./types";

const products = productsData as Product[];

export function getProducts(): Product[] {
  return products;
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProduct(): Product | undefined {
  return products.find((p) => p.featured);
}

export function getProductPrice(product: Product, variantId?: string): number {
  if (!variantId) return product.price;
  const variant = product.variants.find((v) => v.id === variantId);
  return variant?.priceOverride ?? product.price;
}
