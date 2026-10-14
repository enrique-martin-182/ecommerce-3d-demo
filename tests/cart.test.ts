import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "@/store/cart";

const PRODUCT_ID = "p1";
const VARIANT_A = "v1";
const VARIANT_B = "v2";

beforeEach(() => {
  useCartStore.setState({ items: [], isOpen: false });
});

describe("addItem", () => {
  it("adds a new item with quantity 1", () => {
    useCartStore.getState().addItem(PRODUCT_ID, VARIANT_A);
    expect(useCartStore.getState().items).toEqual([
      { productId: PRODUCT_ID, variantId: VARIANT_A, quantity: 1 },
    ]);
  });

  it("increments quantity when same product+variant added again", () => {
    useCartStore.getState().addItem(PRODUCT_ID, VARIANT_A);
    useCartStore.getState().addItem(PRODUCT_ID, VARIANT_A);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it("treats same product with different variant as separate item", () => {
    useCartStore.getState().addItem(PRODUCT_ID, VARIANT_A);
    useCartStore.getState().addItem(PRODUCT_ID, VARIANT_B);
    expect(useCartStore.getState().items).toHaveLength(2);
  });
});

describe("removeItem", () => {
  it("removes the item from cart", () => {
    useCartStore.getState().addItem(PRODUCT_ID, VARIANT_A);
    useCartStore.getState().removeItem(PRODUCT_ID, VARIANT_A);
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});

describe("updateQuantity", () => {
  it("updates quantity to given value", () => {
    useCartStore.getState().addItem(PRODUCT_ID, VARIANT_A);
    useCartStore.getState().updateQuantity(PRODUCT_ID, VARIANT_A, 5);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it("removes item when quantity set to 0", () => {
    useCartStore.getState().addItem(PRODUCT_ID, VARIANT_A);
    useCartStore.getState().updateQuantity(PRODUCT_ID, VARIANT_A, 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});

describe("clearCart", () => {
  it("empties all items", () => {
    useCartStore.getState().addItem(PRODUCT_ID, VARIANT_A);
    useCartStore.getState().addItem(PRODUCT_ID, VARIANT_B);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});

describe("count", () => {
  it("sums all item quantities", () => {
    useCartStore.getState().addItem(PRODUCT_ID, VARIANT_A);
    useCartStore.getState().addItem(PRODUCT_ID, VARIANT_A);
    useCartStore.getState().addItem(PRODUCT_ID, VARIANT_B);
    expect(useCartStore.getState().count()).toBe(3);
  });
});

describe("total with stale productId", () => {
  it("returns 0 for unknown productId without throwing", () => {
    useCartStore.setState({
      items: [{ productId: "nonexistent", variantId: "v1", quantity: 1 }],
      isOpen: false,
    });
    expect(() => useCartStore.getState().total()).not.toThrow();
    expect(useCartStore.getState().total()).toBe(0);
  });
});
