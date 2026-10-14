import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct, getProductPrice } from "@/lib/products";
import type { CartItem } from "@/lib/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (productId: string, variantId: string) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, qty: number) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (productId, variantId) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === productId && i.variantId === variantId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === productId && i.variantId === variantId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { productId, variantId, quantity: 1 }],
          };
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        })),

      updateQuantity: (productId, variantId, qty) => {
        if (qty <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity: qty }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),

      total: () => {
        const { items } = get();
        return items.reduce((sum, item) => {
          const product = getProduct(item.productId);
          if (!product) return sum;
          return sum + getProductPrice(product, item.variantId) * item.quantity;
        }, 0);
      },

      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "ecommerce-3d-cart",
      skipHydration: true,
    }
  )
);
