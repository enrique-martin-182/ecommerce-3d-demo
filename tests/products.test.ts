import { describe, it, expect } from "vitest";
import {
  getProducts,
  getProduct,
  getFeaturedProduct,
  getProductPrice,
} from "@/lib/products";

describe("getProducts", () => {
  it("returns all 4 products", () => {
    expect(getProducts()).toHaveLength(4);
  });

  it("each product has required fields", () => {
    for (const p of getProducts()) {
      expect(p.id).toBeTruthy();
      expect(p.slug).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.price).toBeGreaterThan(0);
      expect(p.variants.length).toBeGreaterThan(0);
      expect(p.hotspots.length).toBeGreaterThan(0);
    }
  });
});

describe("getProduct", () => {
  it("returns product by slug", () => {
    const p = getProduct("wireless-headphones");
    expect(p?.id).toBe("p1");
    expect(p?.name).toBe("AX-900 Headphones");
  });

  it("returns undefined for unknown slug", () => {
    expect(getProduct("does-not-exist")).toBeUndefined();
  });
});

describe("getFeaturedProduct", () => {
  it("returns the featured product", () => {
    const p = getFeaturedProduct();
    expect(p?.featured).toBe(true);
    expect(p?.slug).toBe("wireless-headphones");
  });
});

describe("getProductPrice", () => {
  it("returns base price when no variant", () => {
    const p = getProduct("wireless-headphones")!;
    expect(getProductPrice(p)).toBe(299);
  });

  it("returns base price when variant has no override", () => {
    const p = getProduct("wireless-headphones")!;
    expect(getProductPrice(p, "v1")).toBe(299);
  });
});
