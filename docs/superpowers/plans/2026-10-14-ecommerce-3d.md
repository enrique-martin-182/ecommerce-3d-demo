# E-Commerce 3D — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 3D e-commerce portfolio demo with product viewer (OrbitControls, color variants, hotspots), cart (Zustand + localStorage), and 2-step checkout with validation.

**Architecture:** Next.js 15 App Router with TypeScript strict mode. Mock product data in `data/products.json` served by `lib/products.ts`. State in a single Zustand store with `persist` middleware. 3D rendered with React Three Fiber; canvas lazy-loaded and SSR-disabled. Two Tailwind v4 color themes via `next-themes`.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, React Three Fiber, @react-three/drei, Zustand, Framer Motion, React Hook Form, Zod, Vitest, next-themes

**Spec:** `docs/superpowers/specs/2026-10-14-ecommerce-3d-design.md`

## Global Constraints

- TypeScript strict mode — `"strict": true` in tsconfig, zero `any` types
- Tailwind CSS v4 (CSS-first config, `@import "tailwindcss"` in globals.css)
- `frameloop="demand"` on every Canvas — never `"always"`
- `pixelRatio` capped at `Math.min(window.devicePixelRatio, 1.5)` on Canvas
- Canonical CC-BY model source: Poly Pizza (polypizza.com) or Sketchfab CC-BY
- All 3D canvas imports via `dynamic(() => import(...), { ssr: false })`
- `prefers-reduced-motion`: disable auto-rotation in HeroScene, halve Framer Motion durations
- Lighthouse > 90 performance on `/` and `/checkout` (pages without active 3D)

## Review Focus

1. **GLB 404 / load failure** — ProductViewer must show a procedural sphere fallback (not a blank canvas or crash) when the `.glb` fetch fails; test this in Task 7 by temporarily passing an invalid model path.
2. **Luhn check edge case** — card number `4111111111111110` has 16 digits but fails Luhn; PaymentForm must reject it; test in Task 9.
3. **Cart rehydration with stale data** — if `localStorage` contains a cartItem for a non-existent product, `total()` must not throw; test in Task 2.
4. **Variant color lerp on rapid switching** — clicking three variants fast must land on the last selected color, not an intermediate; test by asserting final material color in Task 7.
5. **Hotspots during active drag** — hotspots must have `pointer-events: none` and `opacity: 0` while the user is orbiting; verify with `onPointerDown`/`onPointerUp` state in Task 8.

---

## File Map

```
ecommerce-3d/
├── src/
│   ├── app/
│   │   ├── layout.tsx              Task 3
│   │   ├── globals.css             Task 3
│   │   ├── page.tsx                Tasks 4, 6
│   │   ├── products/[slug]/
│   │   │   └── page.tsx            Tasks 7, 8
│   │   └── checkout/
│   │       └── page.tsx            Task 9
│   ├── components/
│   │   ├── three/
│   │   │   ├── HeroScene.tsx       Task 6
│   │   │   ├── ProductViewer.tsx   Task 7
│   │   │   ├── Hotspot.tsx         Task 8
│   │   │   └── Loader3D.tsx        Task 6
│   │   ├── shop/
│   │   │   ├── ProductCard.tsx     Task 4
│   │   │   ├── ProductGrid.tsx     Task 4
│   │   │   ├── FilterBar.tsx       Task 4
│   │   │   ├── CartDrawer.tsx      Task 5
│   │   │   └── CartItem.tsx        Task 5
│   │   ├── checkout/
│   │   │   ├── StepIndicator.tsx   Task 9
│   │   │   ├── ShippingForm.tsx    Task 9
│   │   │   └── PaymentForm.tsx     Task 9
│   │   └── ui/
│   │       ├── Navbar.tsx          Task 3
│   │       ├── ThemeToggle.tsx     Task 3
│   │       └── Skeleton.tsx        Task 3
│   ├── store/
│   │   └── cart.ts                 Task 2
│   ├── lib/
│   │   ├── products.ts             Task 1
│   │   └── types.ts                Task 1
│   └── hooks/
│       └── useReducedMotion.ts     Task 6
├── data/
│   └── products.json               Task 1
├── public/
│   ├── models/                     Task 6 (GLB download)
│   └── products/                   Task 6 (fallback WebP)
├── tests/
│   ├── setup.ts                    Task 2
│   └── cart.test.ts                Task 2
├── vitest.config.ts                Task 1
└── next.config.ts                  Task 10
```

---

### Task 1: Project foundation — scaffold, types, mock data

**Files:**
- Create: `src/lib/types.ts`
- Create: `data/products.json`
- Create: `src/lib/products.ts`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts` (empty for now — Zustand mocks added in Task 2)

**Interfaces:**
- Produces: `Product`, `ProductVariant`, `Hotspot`, `CartItem`, `ShippingData`, `PaymentData` (consumed by all tasks)
- Produces: `getProducts()`, `getProduct(slug)` (consumed by Tasks 4, 7)

- [ ] **Step 1: Scaffold the project**

```bash
cd "C:\Users\enriq\Desktop\Apps"
npx create-next-app@latest ecommerce-3d \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"
cd ecommerce-3d
```

When prompted, accept all defaults. This creates the standard Next.js 15 App Router structure. Then move everything under `src/`:

```bash
mkdir src
mv app src/app
mv components src/components 2>/dev/null || true
```

Update `tsconfig.json` paths to point to `src`:
```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

- [ ] **Step 2: Install dependencies**

```bash
npm install @react-three/fiber@^8 @react-three/drei@^9 three@^0.169
npm install zustand framer-motion next-themes
npm install react-hook-form @hookform/resolvers zod
npm install -D @types/three vitest @vitejs/plugin-react jsdom
npm install -D @testing-library/react @testing-library/user-event
```

- [ ] **Step 3: Configure Tailwind CSS v4**

Tailwind v4 uses CSS-first config. Replace the generated `tailwind.config.ts` approach.

`src/app/globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-background: #ffffff;
  --color-foreground: #0a0a0a;
  --color-muted: #737373;
  --color-border: #e5e5e5;
  --color-card: #f9f9f9;
  --color-accent: #0a0a0a;
  --color-accent-fg: #ffffff;
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}

.dark {
  --color-background: #0a0a0a;
  --color-foreground: #fafafa;
  --color-muted: #a3a3a3;
  --color-border: #262626;
  --color-card: #111111;
  --color-accent: #fafafa;
  --color-accent-fg: #0a0a0a;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { background-color: var(--color-background); color: var(--color-foreground); font-family: var(--font-sans); }
```

- [ ] **Step 4: Create `src/lib/types.ts`**

```typescript
export interface ProductVariant {
  id: string;
  name: string;
  color: string;
  priceOverride?: number;
}

export interface Hotspot {
  id: string;
  position: [number, number, number];
  label: string;
  description: string;
}

export interface ProductModel {
  glb: string;
  scale: [number, number, number];
  position: [number, number, number];
  cameraPosition: [number, number, number];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: "electronics" | "furniture" | "accessories" | "footwear";
  price: number;
  description: string;
  shortDescription: string;
  featured: boolean;
  fallbackImage: string;
  model: ProductModel;
  variants: ProductVariant[];
  hotspots: Hotspot[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentData {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}
```

- [ ] **Step 5: Create `data/products.json`**

```json
[
  {
    "id": "p1",
    "slug": "wireless-headphones",
    "name": "AX-900 Headphones",
    "category": "electronics",
    "price": 299,
    "description": "Auriculares inalámbricos premium con cancelación de ruido activa, 40 horas de batería y audio espacial de alta fidelidad. Transductores de 40mm con imanes de neodimio para graves profundos y altos cristalinos.",
    "shortDescription": "Cancelación de ruido activa · 40h batería · Audio espacial",
    "featured": true,
    "fallbackImage": "/products/headphones.webp",
    "model": {
      "glb": "/models/headphones.glb",
      "scale": [1, 1, 1],
      "position": [0, 0, 0],
      "cameraPosition": [0, 0.5, 2.5]
    },
    "variants": [
      { "id": "v1", "name": "Negro Medianoche", "color": "#1a1a1a" },
      { "id": "v2", "name": "Blanco Perla", "color": "#f5f5f5" },
      { "id": "v3", "name": "Rojo Carmesí", "color": "#b91c1c" }
    ],
    "hotspots": [
      { "id": "h1", "position": [0.3, 0.2, 0.1], "label": "Drivers 40mm", "description": "Transductores de 40mm con imanes de neodimio. Graves profundos, altos cristalinos." },
      { "id": "h2", "position": [-0.1, 0.4, 0.2], "label": "ANC Híbrido", "description": "Micrófonos duales feed-forward y feed-back eliminan hasta 35dB de ruido ambiental." }
    ]
  },
  {
    "id": "p2",
    "slug": "lounge-chair",
    "name": "Silla Lounge Moderna",
    "category": "furniture",
    "price": 849,
    "description": "Sillón de diseño con estructura de madera maciza de roble y tapizado de tela Kvadrat. Ergonómico y elegante, perfecto para espacios contemporáneos.",
    "shortDescription": "Roble macizo FSC · Tapizado Kvadrat · Diseño ergonómico",
    "featured": false,
    "fallbackImage": "/products/chair.webp",
    "model": {
      "glb": "/models/chair.glb",
      "scale": [1, 1, 1],
      "position": [0, -0.5, 0],
      "cameraPosition": [2, 1.5, 3]
    },
    "variants": [
      { "id": "v1", "name": "Natural", "color": "#d4a96a" },
      { "id": "v2", "name": "Nogal", "color": "#5c3d1e" },
      { "id": "v3", "name": "Negro", "color": "#1a1a1a" }
    ],
    "hotspots": [
      { "id": "h1", "position": [0.5, 0.3, 0.2], "label": "Roble FSC", "description": "Estructura de roble macizo certificado FSC, acabado con aceite natural." },
      { "id": "h2", "position": [0, 0.6, 0.3], "label": "Tapizado Kvadrat", "description": "Tela Kvadrat Remix, 100% lana reciclada, resistente al desgaste." }
    ]
  },
  {
    "id": "p3",
    "slug": "leather-bag",
    "name": "Bolso Cuero Premium",
    "category": "accessories",
    "price": 495,
    "description": "Bolso de mano elaborado en cuero full-grain de curtido vegetal. Herrajes de latón dorado, interior forrado en algodón y asa ajustable incluida.",
    "shortDescription": "Cuero full-grain · Herrajes latón · Hecho a mano",
    "featured": false,
    "fallbackImage": "/products/bag.webp",
    "model": {
      "glb": "/models/bag.glb",
      "scale": [1.2, 1.2, 1.2],
      "position": [0, 0, 0],
      "cameraPosition": [0, 0.3, 2]
    },
    "variants": [
      { "id": "v1", "name": "Camel", "color": "#c68642" },
      { "id": "v2", "name": "Negro", "color": "#1a1a1a" },
      { "id": "v3", "name": "Burdeos", "color": "#722f37" }
    ],
    "hotspots": [
      { "id": "h1", "position": [0.2, 0.1, 0.3], "label": "Full-Grain", "description": "Cuero de primera capa, curtido al vegetal. Desarrolla pátina con el uso." },
      { "id": "h2", "position": [-0.3, 0.2, 0.1], "label": "Cierre YKK", "description": "Cremallera YKK de latón macizo, teflonada para máxima durabilidad." }
    ]
  },
  {
    "id": "p4",
    "slug": "sneaker-x",
    "name": "Sneaker X Concept",
    "category": "footwear",
    "price": 189,
    "description": "Zapatilla conceptual de edición limitada. Upper de malla técnica monofilamento transpirable, suela de goma vulcanizada Vibram y entresuela de espuma EVA de retorno de energía.",
    "shortDescription": "Edición limitada · Malla técnica · Suela Vibram",
    "featured": false,
    "fallbackImage": "/products/sneaker.webp",
    "model": {
      "glb": "/models/sneaker.glb",
      "scale": [1, 1, 1],
      "position": [0, -0.3, 0],
      "cameraPosition": [1.5, 0.8, 2.5]
    },
    "variants": [
      { "id": "v1", "name": "Blanco / Blanco", "color": "#f5f5f5" },
      { "id": "v2", "name": "Negro / Negro", "color": "#1a1a1a" },
      { "id": "v3", "name": "Azul Royal", "color": "#1d4ed8" }
    ],
    "hotspots": [
      { "id": "h1", "position": [0.1, 0.2, 0.4], "label": "Upper técnico", "description": "Malla monofilamento de 200 micras, 40% más ligera que tejido estándar." },
      { "id": "h2", "position": [0.3, -0.1, 0.2], "label": "Suela Vibram", "description": "Compuesto Vibram Megagrip. Tracción excepcional en seco y mojado." }
    ]
  }
]
```

- [ ] **Step 6: Create `src/lib/products.ts`**

```typescript
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

export function getProductPrice(product: Product, variantId: string): number {
  const variant = product.variants.find((v) => v.id === variantId);
  return variant?.priceOverride ?? product.price;
}
```

- [ ] **Step 7: Configure Vitest**

`vitest.config.ts` in project root:
```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

`tests/setup.ts` (localStorage mock):
```typescript
import { vi, beforeEach } from "vitest";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});
```

Add to `package.json` scripts:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 8: Initialize git and first commit**

```bash
git init
git add .
git commit -m "chore: scaffold Next.js 15 + TypeScript + Tailwind v4, types, mock data"
```

- [ ] **Step 9: Verify**

Run: `npm run dev`
Expected: Next.js dev server starts on port 3000, default page renders without errors.

---

### Task 2: Cart store (Zustand) + all tests

**Files:**
- Create: `src/store/cart.ts`
- Create: `tests/cart.test.ts`

**Interfaces:**
- Consumes: `CartItem`, `Product`, `getProductPrice` from Task 1
- Produces: `useCartStore` (hook) — consumed by Tasks 3, 4, 5, 9

- [ ] **Step 1: Write the failing tests first**

`tests/cart.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run tests — expect ALL to FAIL**

Run: `npm test`
Expected: FAIL — "Cannot find module '@/store/cart'"

- [ ] **Step 3: Implement `src/store/cart.ts`**

```typescript
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
          return { items: [...state.items, { productId, variantId, quantity: 1 }] };
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
```

- [ ] **Step 4: Run tests — expect ALL to PASS**

Run: `npm test`
Expected: PASS — 9/9 tests

- [ ] **Step 5: Commit**

```bash
git add src/store/cart.ts tests/cart.test.ts tests/setup.ts vitest.config.ts
git commit -m "feat: Zustand cart store with persist + full test coverage"
```

---

### Task 3: Root layout — Navbar, ThemeToggle, Skeleton, theme provider

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Create: `src/components/ui/Navbar.tsx`
- Create: `src/components/ui/ThemeToggle.tsx`
- Create: `src/components/ui/Skeleton.tsx`

**Interfaces:**
- Consumes: `useCartStore` from Task 2
- Produces: `<Navbar />`, `<Skeleton />` (consumed by Tasks 4, 5, 7)

- [ ] **Step 1: Update `src/app/layout.tsx`**

```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/ui/Navbar";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Store 3D | Explorar productos en 3D",
  description: "Tienda demo con visor 3D interactivo por producto.",
  openGraph: {
    title: "Store 3D",
    description: "Explora productos en 3D: rota, cambia color y descubre detalles.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create `src/components/ui/ThemeToggle.tsx`**

```typescript
"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] text-sm transition-colors hover:bg-[var(--color-card)]"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
```

- [ ] **Step 3: Create `src/components/ui/Navbar.tsx`**

```typescript
"use client";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { ThemeToggle } from "./ThemeToggle";
import { useEffect } from "react";

export function Navbar() {
  const { count, toggleDrawer } = useCartStore();

  // Rehydrate cart from localStorage on client mount
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="font-semibold text-sm tracking-tight">
          STORE 3D
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--color-muted)]">
          <Link href="/" className="hover:text-[var(--color-foreground)] transition-colors">Tienda</Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={toggleDrawer}
            aria-label={`Carrito — ${count()} artículos`}
            className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] text-sm transition-colors hover:bg-[var(--color-card)]"
          >
            🛒
            {count() > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] text-[var(--color-accent-fg)] font-mono">
                {count()}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Create `src/components/ui/Skeleton.tsx`**

```typescript
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[var(--color-border)] ${className}`}
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 5: Verify**

Run: `npm run dev`
Expected: Navbar renders, theme toggle switches dark/light, cart icon shows 0 count. No console errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css src/components/ui/
git commit -m "feat: root layout with Navbar, ThemeToggle, Skeleton, next-themes"
```

---

### Task 4: Home page — ProductCard, ProductGrid, FilterBar

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/components/shop/ProductCard.tsx`
- Create: `src/components/shop/ProductGrid.tsx`
- Create: `src/components/shop/FilterBar.tsx`

**Interfaces:**
- Consumes: `getProducts()` from Task 1, `useCartStore` from Task 2, `<Skeleton />` from Task 3
- Produces: Full home page with grid + filters (no 3D hero yet — added in Task 6)

- [ ] **Step 1: Create `src/components/shop/ProductCard.tsx`**

```typescript
"use client";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, toggleDrawer } = useCartStore();
  const defaultVariant = product.variants[0];

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem(product.id, defaultVariant.id);
    toggleDrawer();
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-[var(--color-border)]">
        <Image
          src={product.fallbackImage}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs text-[var(--color-muted)] capitalize">{product.category}</span>
        <h3 className="font-medium text-sm leading-tight">{product.name}</h3>
        <p className="text-xs text-[var(--color-muted)] line-clamp-2">{product.shortDescription}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-semibold">{product.price} €</span>
          <button
            onClick={handleAddToCart}
            aria-label={`Añadir ${product.name} al carrito`}
            className="rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-[var(--color-accent-fg)] transition-opacity hover:opacity-80"
          >
            + Carrito
          </button>
        </div>
        <span className="text-center text-xs text-[var(--color-muted)] opacity-0 transition-opacity group-hover:opacity-100">
          Explorar en 3D →
        </span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create `src/components/shop/FilterBar.tsx`**

```typescript
"use client";
import { useState, useCallback } from "react";

export type SortOption = "price-asc" | "price-desc" | "name-asc";
export type Category = "all" | "electronics" | "furniture" | "accessories" | "footwear";

interface FilterBarProps {
  onCategoryChange: (category: Category) => void;
  onSortChange: (sort: SortOption) => void;
  onSearchChange: (query: string) => void;
  onPriceChange: (max: number) => void;
  maxPrice: number;
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "all", label: "Todo" },
  { value: "electronics", label: "Electrónica" },
  { value: "furniture", label: "Muebles" },
  { value: "accessories", label: "Accesorios" },
  { value: "footwear", label: "Calzado" },
];

export function FilterBar({ onCategoryChange, onSortChange, onSearchChange, onPriceChange, maxPrice }: FilterBarProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
      const timer = setTimeout(() => onSearchChange(e.target.value), 300);
      return () => clearTimeout(timer);
    },
    [onSearchChange]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => { setActiveCategory(cat.value); onCategoryChange(cat.value); }}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === cat.value
                ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                : "border-[var(--color-border)] hover:border-[var(--color-foreground)]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="search"
          placeholder="Buscar productos..."
          value={searchValue}
          onChange={handleSearch}
          aria-label="Buscar productos"
          className="h-9 rounded-lg border border-[var(--color-border)] bg-transparent px-3 text-sm placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        />
        <label className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
          Máx. precio: {maxPrice} €
          <input
            type="range"
            min={100}
            max={1000}
            step={50}
            defaultValue={1000}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className="w-28 accent-[var(--color-accent)]"
            aria-label="Precio máximo"
          />
        </label>
        <select
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          aria-label="Ordenar por"
          className="h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        >
          <option value="price-asc">Precio: menor primero</option>
          <option value="price-desc">Precio: mayor primero</option>
          <option value="name-asc">Nombre A–Z</option>
        </select>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/shop/ProductGrid.tsx`**

```typescript
"use client";
import { useState, useMemo } from "react";
import { FilterBar, type Category, type SortOption } from "./FilterBar";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const [category, setCategory] = useState<Category>("all");
  const [sort, setSort] = useState<SortOption>("price-asc");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000);

  const filtered = useMemo(() => {
    let result = products;
    if (category !== "all") result = result.filter((p) => p.category === category);
    result = result.filter((p) => p.price <= maxPrice);
    if (search) result = result.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase())
    );
    return [...result].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });
  }, [products, category, sort, search, maxPrice]);

  return (
    <section aria-label="Catálogo de productos">
      <FilterBar
        onCategoryChange={setCategory}
        onSortChange={setSort}
        onSearchChange={setSearch}
        onPriceChange={setMaxPrice}
        maxPrice={maxPrice}
      />
      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-sm text-[var(--color-muted)]">
          No hay productos que coincidan con los filtros.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Create `src/app/page.tsx`** (hero placeholder; 3D added in Task 6)

```typescript
import { getProducts } from "@/lib/products";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CartDrawer } from "@/components/shop/CartDrawer";

export default function HomePage() {
  const products = getProducts();

  return (
    <main>
      {/* Hero — 3D scene added in Task 6 */}
      <div className="flex h-[60vh] items-center justify-center border-b border-[var(--color-border)] bg-[var(--color-card)]">
        <p className="text-[var(--color-muted)] text-sm">Hero 3D — próximamente</p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="mb-8 text-2xl font-semibold">Nuestros Productos</h1>
        <ProductGrid products={products} />
      </div>

      <CartDrawer />
    </main>
  );
}
```

Note: `CartDrawer` is imported here but created in Task 5. Next.js will error until Task 5 is done — add a temporary stub file `src/components/shop/CartDrawer.tsx` with `export function CartDrawer() { return null; }` if you need to verify this page before Task 5.

- [ ] **Step 5: Verify**

Run: `npm run dev`, open `http://localhost:3000`
Expected: Grid shows 4 product cards (with broken images — that's fine until Task 6). Filter pills and search work. Sort changes order.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/components/shop/
git commit -m "feat: home page with product grid, filter by category/price/search/sort"
```

---

### Task 5: Cart drawer (Framer Motion slide-in)

**Files:**
- Create: `src/components/shop/CartDrawer.tsx`
- Create: `src/components/shop/CartItem.tsx`

**Interfaces:**
- Consumes: `useCartStore` from Task 2, `getProduct`, `getProductPrice` from Task 1
- Produces: `<CartDrawer />` (used in app/page.tsx), `<CartItem />`

- [ ] **Step 1: Create `src/components/shop/CartItem.tsx`**

```typescript
"use client";
import { useCartStore } from "@/store/cart";
import { getProduct, getProductPrice } from "@/lib/products";
import type { CartItem as CartItemType } from "@/lib/types";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartStore();
  const product = getProduct(item.productId);
  if (!product) return null;

  const variant = product.variants.find((v) => v.id === item.variantId);
  const price = getProductPrice(product, item.variantId);

  return (
    <div className="flex items-start gap-3 py-4">
      <div
        className="h-10 w-10 shrink-0 rounded-lg border border-[var(--color-border)]"
        style={{ backgroundColor: variant?.color ?? "#ccc" }}
        aria-hidden="true"
      />
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <p className="text-sm font-medium truncate">{product.name}</p>
        <p className="text-xs text-[var(--color-muted)]">{variant?.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
            aria-label="Reducir cantidad"
            className="flex h-6 w-6 items-center justify-center rounded border border-[var(--color-border)] text-sm hover:bg-[var(--color-card)]"
          >−</button>
          <span className="text-sm tabular-nums">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
            aria-label="Aumentar cantidad"
            className="flex h-6 w-6 items-center justify-center rounded border border-[var(--color-border)] text-sm hover:bg-[var(--color-card)]"
          >+</button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="text-sm font-semibold">{(price * item.quantity).toFixed(0)} €</span>
        <button
          onClick={() => removeItem(item.productId, item.variantId)}
          aria-label={`Eliminar ${product.name}`}
          className="text-xs text-[var(--color-muted)] hover:text-red-500 transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/shop/CartDrawer.tsx`**

```typescript
"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { CartItem } from "./CartItem";

export function CartDrawer() {
  const { items, isOpen, toggleDrawer, total, count } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleDrawer}
            className="fixed inset-0 z-40 bg-black/40"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-[var(--color-background)] shadow-2xl"
            aria-label="Carrito de compra"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
              <h2 className="font-semibold">Carrito ({count()})</h2>
              <button
                onClick={toggleDrawer}
                aria-label="Cerrar carrito"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] text-sm hover:bg-[var(--color-card)] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4">
              {items.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-[var(--color-muted)]">Tu carrito está vacío</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={`${item.productId}-${item.variantId}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-b border-[var(--color-border)] last:border-0"
                    >
                      <CartItem item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[var(--color-border)] p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-muted)]">Subtotal</span>
                  <span className="font-semibold">{total().toFixed(0)} €</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={toggleDrawer}
                  className="block w-full rounded-xl bg-[var(--color-accent)] py-3 text-center text-sm font-medium text-[var(--color-accent-fg)] transition-opacity hover:opacity-80"
                >
                  Proceder al pago
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run dev`
Expected: Click "+" on product card → CartDrawer slides in from right. Item shows with correct color swatch and price. Quantity buttons increment/decrement. "Eliminar" removes item. AnimatePresence animates out when item removed.

- [ ] **Step 4: Commit**

```bash
git add src/components/shop/CartDrawer.tsx src/components/shop/CartItem.tsx
git commit -m "feat: cart drawer with Framer Motion slide-in and animated item list"
```

---

### Task 6: 3D models + HeroScene + Loader3D + useReducedMotion

**Files:**
- Create: `src/hooks/useReducedMotion.ts`
- Create: `src/components/three/Loader3D.tsx`
- Create: `src/components/three/HeroScene.tsx`
- Create: `src/components/three/HeroSceneClient.tsx` (dynamic import wrapper)
- Modify: `src/app/page.tsx` (replace placeholder with real hero)
- Add: `public/models/*.glb` (download from Poly Pizza)
- Add: `public/products/*.webp` (fallback images)

**Interfaces:**
- Consumes: `getFeaturedProduct()` from Task 1
- Produces: `<HeroSceneClient />` (consumed by page.tsx), `<Loader3D />`

- [ ] **Step 1: Download CC-BY GLB models from Poly Pizza**

Go to https://polypizza.com and search for each. Download, then optimize with Draco:

```bash
npm install -g gltf-pipeline
gltf-pipeline -i downloaded-headphones.glb -o public/models/headphones.glb --draco.compressMeshes
gltf-pipeline -i downloaded-chair.glb     -o public/models/chair.glb     --draco.compressMeshes
gltf-pipeline -i downloaded-bag.glb       -o public/models/bag.glb       --draco.compressMeshes
gltf-pipeline -i downloaded-sneaker.glb   -o public/models/sneaker.glb   --draco.compressMeshes
```

Each target: < 2 MB. Verify file sizes with `ls -lh public/models/`.

Create fallback placeholder images (300×300 solid-color WebPs) for each product. Use any design tool or generate with sharp:

```bash
npm install -D sharp
node -e "
const sharp = require('sharp');
const colors = { headphones: '#1a1a1a', chair: '#d4a96a', bag: '#c68642', sneaker: '#f5f5f5' };
Object.entries(colors).forEach(([name, bg]) =>
  sharp({ create: { width: 400, height: 400, channels: 3, background: bg } })
    .webp().toFile(\`public/products/\${name}.webp\`)
);
"
```

- [ ] **Step 2: Create `src/hooks/useReducedMotion.ts`**

```typescript
import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}
```

- [ ] **Step 3: Create `src/components/three/Loader3D.tsx`**

```typescript
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
```

- [ ] **Step 4: Create `src/components/three/HeroScene.tsx`**

```typescript
"use client";
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Loader3D } from "./Loader3D";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ProductModel } from "@/lib/types";

interface RotatingModelProps {
  model: ProductModel;
  reducedMotion: boolean;
}

function RotatingModel({ model, reducedMotion }: RotatingModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(model.glb);

  useFrame((_, delta) => {
    if (!groupRef.current || reducedMotion) return;
    groupRef.current.rotation.y += delta * 0.4;
  });

  return (
    <group
      ref={groupRef}
      scale={model.scale}
      position={model.position}
    >
      <primitive object={scene} />
    </group>
  );
}

interface HeroSceneProps {
  model: ProductModel;
}

export function HeroScene({ model }: HeroSceneProps) {
  const reducedMotion = useReducedMotion();
  useGLTF.preload(model.glb);

  return (
    <div className="relative h-full w-full">
      <Canvas
        frameloop="demand"
        camera={{ position: model.cameraPosition, fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        shadows
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Suspense fallback={null}>
          <RotatingModel model={model} reducedMotion={reducedMotion} />
          <ContactShadows position={[0, -0.8, 0]} opacity={0.4} scale={4} blur={2} />
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      <Loader3D />
    </div>
  );
}
```

- [ ] **Step 5: Create dynamic import wrapper `src/components/three/HeroSceneClient.tsx`**

```typescript
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
```

- [ ] **Step 6: Update `src/app/page.tsx` to use real hero**

```typescript
import { getFeaturedProduct, getProducts } from "@/lib/products";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { HeroSceneClient } from "@/components/three/HeroSceneClient";
import Link from "next/link";

export default function HomePage() {
  const products = getProducts();
  const featured = getFeaturedProduct();

  return (
    <main>
      {/* Hero 3D */}
      <section className="relative flex h-[80vh] items-end overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-card)]">
        {featured && (
          <div className="absolute inset-0">
            <HeroSceneClient model={featured.model} />
          </div>
        )}
        <div className="relative z-10 p-8 md:p-16">
          <p className="mb-2 text-xs font-mono uppercase tracking-widest text-[var(--color-muted)]">
            Producto destacado
          </p>
          <h1 className="text-4xl font-semibold md:text-6xl">{featured?.name}</h1>
          <p className="mt-2 text-[var(--color-muted)] max-w-md">{featured?.shortDescription}</p>
          <Link
            href={`/products/${featured?.slug}`}
            className="mt-6 inline-block rounded-xl bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-[var(--color-accent-fg)] transition-opacity hover:opacity-80"
          >
            Explorar en 3D
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-8 text-2xl font-semibold">Nuestros Productos</h2>
        <ProductGrid products={products} />
      </div>

      <CartDrawer />
    </main>
  );
}
```

- [ ] **Step 7: Verify**

Run: `npm run dev`
Expected: Hero section shows 3D rotating model (headphones). Loader bar appears then disappears. Reduced motion stops auto-rotation. Product cards now show WebP fallback images.

- [ ] **Step 8: Commit**

```bash
git add src/hooks/ src/components/three/HeroScene.tsx src/components/three/HeroSceneClient.tsx src/components/three/Loader3D.tsx src/app/page.tsx public/models/ public/products/
git commit -m "feat: 3D hero scene with auto-rotation, Draco models, and prefers-reduced-motion support"
```

---

### Task 7: Product detail page + ProductViewer + color variant switching

**Files:**
- Create: `src/app/products/[slug]/page.tsx`
- Create: `src/components/three/ProductViewer.tsx`
- Create: `src/components/three/ProductViewerClient.tsx`

**Interfaces:**
- Consumes: `getProduct()`, `getProductPrice()` from Task 1; `useCartStore` from Task 2; `Loader3D` from Task 6
- Produces: `/products/[slug]` route with interactive 3D viewer

- [ ] **Step 1: Create `src/components/three/ProductViewer.tsx`**

This component loads the GLB, applies variant color to all MeshStandardMaterial, and shows hotspots (stubbed here, full in Task 8).

```typescript
"use client";
import { Suspense, useEffect, useRef, useState, Component, type ErrorInfo, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import { Loader3D } from "./Loader3D";
import type { Product, ProductVariant } from "@/lib/types";

class ModelErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(_: Error, __: ErrorInfo) {}
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

interface ModelProps {
  glbPath: string;
  scale: [number, number, number];
  position: [number, number, number];
  variantColor: string;
}

function Model({ glbPath, scale, position, variantColor }: ModelProps) {
  const { scene } = useGLTF(glbPath);
  const targetColor = useRef(new THREE.Color(variantColor));
  const currentColor = useRef(new THREE.Color(variantColor));

  useEffect(() => {
    targetColor.current.set(variantColor);
  }, [variantColor]);

  useEffect(() => {
    const interval = setInterval(() => {
      currentColor.current.lerp(targetColor.current, 0.1);
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (mat?.color) mat.color.copy(currentColor.current);
        }
      });
      if (currentColor.current.distanceTo(targetColor.current) < 0.001) {
        clearInterval(interval);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [variantColor, scene]);

  return (
    <group scale={scale} position={position}>
      <primitive object={scene} />
    </group>
  );
}

function FallbackModel() {
  return (
    <mesh>
      <sphereGeometry args={[0.8, 32, 32]} />
      <meshStandardMaterial color="#aaaaaa" roughness={0.4} metalness={0.2} />
    </mesh>
  );
}

interface ProductViewerProps {
  product: Product;
  selectedVariant: ProductVariant;
}

export function ProductViewer({ product, selectedVariant }: ProductViewerProps) {
  useGLTF.preload(product.model.glb);
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[var(--color-card)]">
      <Canvas
        frameloop="demand"
        camera={{ position: product.model.cameraPosition, fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5)]}
        shadows
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Suspense fallback={null}>
          <ModelErrorBoundary fallback={<FallbackModel />}>
            <Model
              glbPath={product.model.glb}
              scale={product.model.scale}
              position={product.model.position}
              variantColor={selectedVariant.color}
            />
          </ModelErrorBoundary>
          <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={5} blur={2} />
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls enablePan={false} minDistance={1} maxDistance={6} />
      </Canvas>
      <Loader3D />
    </div>
  );
}
```

**Review Focus — Test GLB 404:** To verify the fallback works, temporarily change `product.model.glb` to `"/models/nonexistent.glb"` in the product data, run dev, navigate to a product page. Expected: `<FallbackModel />` renders (grey sphere) without crashing. Restore the real path after verifying.

- [ ] **Step 2: Create `src/components/three/ProductViewerClient.tsx`**

```typescript
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
```

- [ ] **Step 3: Create `src/app/products/[slug]/page.tsx`**

```typescript
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getProducts, getProductPrice } from "@/lib/products";
import { ProductPageClient } from "./ProductPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} | Store 3D`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return <ProductPageClient product={product} />;
}
```

Create `src/app/products/[slug]/ProductPageClient.tsx`:

```typescript
"use client";
import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { getProductPrice } from "@/lib/products";
import { ProductViewerClient } from "@/components/three/ProductViewerClient";
import { CartDrawer } from "@/components/shop/CartDrawer";
import type { Product } from "@/lib/types";

export function ProductPageClient({ product }: { product: Product }) {
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0].id);
  const [added, setAdded] = useState(false);
  const { addItem, toggleDrawer } = useCartStore();

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId)!;
  const price = getProductPrice(product, selectedVariantId);

  function handleAddToCart() {
    addItem(product.id, selectedVariantId);
    setAdded(true);
    toggleDrawer();
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Viewer */}
        <ProductViewerClient product={product} selectedVariant={selectedVariant} />

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted)] capitalize">
              {product.category}
            </p>
            <h1 className="mt-1 text-3xl font-semibold">{product.name}</h1>
            <p className="mt-3 text-2xl font-semibold">{price} €</p>
          </div>

          <p className="text-[var(--color-muted)] leading-relaxed">{product.description}</p>

          {/* Variant selector */}
          <div>
            <p className="mb-2 text-sm font-medium">
              Color: <span className="text-[var(--color-muted)]">{selectedVariant.name}</span>
            </p>
            <div className="flex gap-2" role="radiogroup" aria-label="Seleccionar color">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantId(variant.id)}
                  role="radio"
                  aria-checked={variant.id === selectedVariantId}
                  aria-label={variant.name}
                  title={variant.name}
                  className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    variant.id === selectedVariantId
                      ? "border-[var(--color-foreground)] scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: variant.color }}
                />
              ))}
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={added}
            className="rounded-xl bg-[var(--color-accent)] py-4 text-sm font-medium text-[var(--color-accent-fg)] transition-opacity hover:opacity-80 disabled:opacity-60"
          >
            {added ? "¡Añadido! ✓" : "Añadir al carrito"}
          </button>
        </div>
      </div>
      <CartDrawer />
    </main>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npm run dev`, navigate to `http://localhost:3000/products/wireless-headphones`
Expected: 3D model loads. OrbitControls works (click + drag to rotate, scroll to zoom). Clicking a color pill changes model color with smooth lerp. "Añadir al carrito" opens drawer.

- [ ] **Step 5: Commit**

```bash
git add src/app/products/ src/components/three/ProductViewer.tsx src/components/three/ProductViewerClient.tsx
git commit -m "feat: product detail page with 3D viewer, OrbitControls, color variant switching"
```

---

### Task 8: Hotspots — HTML annotations in 3D space

**Files:**
- Create: `src/components/three/Hotspot.tsx`
- Modify: `src/components/three/ProductViewer.tsx`

**Interfaces:**
- Consumes: `Hotspot` type from Task 1; `Html` from @react-three/drei; `ProductViewer` from Task 7

- [ ] **Step 1: Create `src/components/three/Hotspot.tsx`**

```typescript
"use client";
import { useState } from "react";
import { Html } from "@react-three/drei";
import type { Hotspot as HotspotType } from "@/lib/types";

interface HotspotProps {
  hotspot: HotspotType;
  visible: boolean;
}

export function Hotspot({ hotspot, visible }: HotspotProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Html
      position={hotspot.position}
      distanceFactor={3}
      style={{
        pointerEvents: visible ? "auto" : "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease",
        userSelect: "none",
      }}
      zIndexRange={[10, 0]}
    >
      <div className="relative">
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-label={`Hotspot: ${hotspot.label}`}
          aria-expanded={expanded}
          className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-white/20 text-white backdrop-blur-sm text-xs font-bold shadow-lg hover:bg-white/40 transition-colors"
          style={{ cursor: visible ? "pointer" : "default" }}
        >
          +
        </button>
        {expanded && (
          <div
            className="absolute left-8 top-0 z-50 w-48 rounded-xl bg-white/95 p-3 shadow-xl backdrop-blur"
            role="tooltip"
          >
            <p className="text-xs font-semibold text-gray-900">{hotspot.label}</p>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed">{hotspot.description}</p>
          </div>
        )}
      </div>
    </Html>
  );
}
```

- [ ] **Step 2: Integrate hotspots into `src/components/three/ProductViewer.tsx`**

Add isDragging state to control hotspot visibility. Find the `ProductViewer` function and update the Canvas block:

```typescript
// Add at top of ProductViewer function:
const [isDragging, setIsDragging] = useState(false);

// Inside <Canvas>, after <OrbitControls>:
// Replace the existing <OrbitControls> with:
<OrbitControls
  enablePan={false}
  minDistance={1}
  maxDistance={6}
  onStart={() => setIsDragging(true)}
  onEnd={() => setIsDragging(false)}
/>

// Inside <Suspense>, after the Model/FallbackModel:
{!loadError && product.hotspots.map((hotspot) => (
  <Hotspot key={hotspot.id} hotspot={hotspot} visible={!isDragging} />
))}
```

Also add the `Hotspot` import at the top of `ProductViewer.tsx`:
```typescript
import { Hotspot } from "./Hotspot";
```

**Review Focus — Hotspots during drag:** After adding, verify: start dragging the model → hotspot dots fade and become pointer-events:none (cannot click through them). Release drag → hotspots reappear. Test this manually in the browser.

- [ ] **Step 3: Verify**

Run: `npm run dev`, go to a product page.
Expected: Two `+` buttons appear on the model. Clicking one shows the label + description tooltip. During OrbitControls drag, hotspots become transparent and unclickable. Releasing drag brings them back.

- [ ] **Step 4: Commit**

```bash
git add src/components/three/Hotspot.tsx src/components/three/ProductViewer.tsx
git commit -m "feat: 3D hotspots with HTML overlay, hidden during OrbitControls drag"
```

---

### Task 9: Checkout — 2-step form with React Hook Form + Zod

**Files:**
- Create: `src/app/checkout/page.tsx`
- Create: `src/components/checkout/StepIndicator.tsx`
- Create: `src/components/checkout/ShippingForm.tsx`
- Create: `src/components/checkout/PaymentForm.tsx`

**Interfaces:**
- Consumes: `ShippingData`, `PaymentData` types from Task 1; `useCartStore` from Task 2

- [ ] **Step 1: Create `src/components/checkout/StepIndicator.tsx`**

```typescript
interface StepIndicatorProps {
  currentStep: 1 | 2;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: "Envío" },
    { number: 2, label: "Pago" },
  ];

  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, i) => (
        <div key={step.number} className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold border-2 ${
                currentStep >= step.number
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                  : "border-[var(--color-border)] text-[var(--color-muted)]"
              }`}
            >
              {step.number}
            </div>
            <span className={`text-sm ${currentStep >= step.number ? "font-medium" : "text-[var(--color-muted)]"}`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-px w-16 ${currentStep > step.number ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/checkout/ShippingForm.tsx`**

```typescript
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ShippingData } from "@/lib/types";

const shippingSchema = z.object({
  firstName: z.string().min(2, "Mínimo 2 caracteres"),
  lastName: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  address: z.string().min(5, "Introduce una dirección completa"),
  city: z.string().min(2, "Ciudad requerida"),
  postalCode: z.string().regex(/^\d{4,10}$/, "Código postal inválido"),
  country: z.string().min(2, "País requerido"),
});

interface ShippingFormProps {
  onSubmit: (data: ShippingData) => void;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

const inputClass = "w-full rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2.5 text-sm placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]";

export function ShippingForm({ onSubmit }: ShippingFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ShippingData>({
    resolver: zodResolver(shippingSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nombre" error={errors.firstName?.message}>
          <input {...register("firstName")} className={inputClass} placeholder="Juan" />
        </Field>
        <Field label="Apellidos" error={errors.lastName?.message}>
          <input {...register("lastName")} className={inputClass} placeholder="García" />
        </Field>
      </div>
      <Field label="Email" error={errors.email?.message}>
        <input {...register("email")} type="email" className={inputClass} placeholder="juan@ejemplo.com" />
      </Field>
      <Field label="Dirección" error={errors.address?.message}>
        <input {...register("address")} className={inputClass} placeholder="Calle Mayor 1, 2ºA" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Ciudad" error={errors.city?.message}>
          <input {...register("city")} className={inputClass} placeholder="Madrid" />
        </Field>
        <Field label="Código postal" error={errors.postalCode?.message}>
          <input {...register("postalCode")} className={inputClass} placeholder="28001" />
        </Field>
      </div>
      <Field label="País" error={errors.country?.message}>
        <input {...register("country")} className={inputClass} placeholder="España" />
      </Field>
      <button
        type="submit"
        className="w-full rounded-xl bg-[var(--color-accent)] py-3 text-sm font-medium text-[var(--color-accent-fg)] transition-opacity hover:opacity-80"
      >
        Continuar al pago →
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Create `src/components/checkout/PaymentForm.tsx`**

Luhn algorithm check is included in the Zod schema.

```typescript
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { PaymentData } from "@/lib/types";

function luhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s/g, "").split("").reverse().map(Number);
  const sum = digits.reduce((acc, digit, i) => {
    if (i % 2 === 1) {
      const doubled = digit * 2;
      return acc + (doubled > 9 ? doubled - 9 : doubled);
    }
    return acc + digit;
  }, 0);
  return sum % 10 === 0;
}

const paymentSchema = z.object({
  cardName: z.string().min(3, "Nombre requerido"),
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, "16 dígitos requeridos")
    .refine(luhn, "Número de tarjeta inválido"),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Formato MM/AA")
    .refine((val) => {
      const [month, year] = val.split("/").map(Number);
      const now = new Date();
      const expDate = new Date(2000 + year, month - 1);
      return expDate > now;
    }, "Tarjeta caducada"),
  cvv: z.string().regex(/^\d{3,4}$/, "3 o 4 dígitos"),
});

interface PaymentFormProps {
  onSubmit: (data: PaymentData) => void;
  onBack: () => void;
}

const inputClass = "w-full rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2.5 text-sm placeholder:text-[var(--color-muted)] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]";

export function PaymentForm({ onSubmit, onBack }: PaymentFormProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PaymentData>({
    resolver: zodResolver(paymentSchema),
  });

  function formatCardNumber(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    setValue("cardNumber", raw, { shouldValidate: true });
    e.target.value = raw;
  }

  function formatExpiry(e: React.ChangeEvent<HTMLInputElement>) {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) raw = raw.slice(0, 2) + "/" + raw.slice(2);
    setValue("expiry", raw, { shouldValidate: true });
    e.target.value = raw;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Titular de la tarjeta</label>
        <input {...register("cardName")} className={inputClass} placeholder="JUAN GARCIA" />
        {errors.cardName && <p className="mt-1 text-xs text-red-500">{errors.cardName.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Número de tarjeta</label>
        <input
          {...register("cardNumber")}
          onChange={formatCardNumber}
          className={inputClass}
          placeholder="1234567890123456"
          maxLength={16}
          inputMode="numeric"
        />
        {errors.cardNumber && <p className="mt-1 text-xs text-red-500">{errors.cardNumber.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Caducidad</label>
          <input
            {...register("expiry")}
            onChange={formatExpiry}
            className={inputClass}
            placeholder="MM/AA"
            maxLength={5}
            inputMode="numeric"
          />
          {errors.expiry && <p className="mt-1 text-xs text-red-500">{errors.expiry.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">CVV</label>
          <input
            {...register("cvv")}
            className={inputClass}
            placeholder="123"
            maxLength={4}
            inputMode="numeric"
            type="password"
          />
          {errors.cvv && <p className="mt-1 text-xs text-red-500">{errors.cvv.message}</p>}
        </div>
      </div>

      <p className="text-xs text-[var(--color-muted)]">
        🔒 Demo — no se procesan pagos reales.
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-xl border border-[var(--color-border)] py-3 text-sm transition-colors hover:bg-[var(--color-card)]"
        >
          ← Volver
        </button>
        <button
          type="submit"
          className="flex-1 rounded-xl bg-[var(--color-accent)] py-3 text-sm font-medium text-[var(--color-accent-fg)] transition-opacity hover:opacity-80"
        >
          Confirmar pedido
        </button>
      </div>
    </form>
  );
}
```

**Review Focus — Luhn edge case test:** In the browser, enter `4111111111111110` (16 digits, fails Luhn). Expected: form shows "Número de tarjeta inválido". A valid test number is `4111111111111111`.

- [ ] **Step 4: Create `src/app/checkout/page.tsx`**

```typescript
"use client";
import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { StepIndicator } from "@/components/checkout/StepIndicator";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import type { ShippingData, PaymentData } from "@/lib/types";
import Link from "next/link";

type Step = 1 | 2 | "success";

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>(1);
  const [orderNumber] = useState(() => Math.floor(100000 + Math.random() * 900000));
  const { items, total, clearCart } = useCartStore();

  if (items.length === 0 && step !== "success") {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-[var(--color-muted)]">Tu carrito está vacío.</p>
        <Link href="/" className="mt-4 inline-block text-sm underline">Volver a la tienda</Link>
      </main>
    );
  }

  if (step === "success") {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h1 className="text-2xl font-semibold">¡Pedido confirmado!</h1>
        <p className="mt-2 text-[var(--color-muted)]">Pedido #{orderNumber}</p>
        <p className="mt-4 text-sm text-[var(--color-muted)]">
          Esto es una demo. No se ha procesado ningún pago.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-xl bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-[var(--color-accent-fg)]"
        >
          Volver a la tienda
        </Link>
      </main>
    );
  }

  function handleShipping(_data: ShippingData) {
    setStep(2);
  }

  function handlePayment(_data: PaymentData) {
    clearCart();
    setStep("success");
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-6 text-2xl font-semibold text-center">Checkout</h1>
      <StepIndicator currentStep={step as 1 | 2} />

      <div className="rounded-2xl border border-[var(--color-border)] p-6 mb-6">
        {step === 1 && <ShippingForm onSubmit={handleShipping} />}
        {step === 2 && (
          <PaymentForm
            onSubmit={handlePayment}
            onBack={() => setStep(1)}
          />
        )}
      </div>

      {/* Order summary */}
      <div className="rounded-2xl border border-[var(--color-border)] p-4 text-sm">
        <p className="font-medium mb-2">Resumen del pedido</p>
        <div className="flex justify-between text-[var(--color-muted)]">
          <span>{items.length} artículo(s)</span>
          <span>{total().toFixed(0)} €</span>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Verify**

Run: `npm run dev`, add items to cart, go to `/checkout`.
Expected: Step 1 shows shipping form with real-time validation. Submit valid data → Step 2 shows payment form. Enter `4111111111111110` → "Número de tarjeta inválido". Enter `4111111111111111` and valid fields → success screen. Cart clears.

- [ ] **Step 6: Commit**

```bash
git add src/app/checkout/ src/components/checkout/
git commit -m "feat: 2-step checkout with React Hook Form + Zod, Luhn validation"
```

---

### Task 10: Polish, README, Vercel deploy

**Files:**
- Create: `next.config.ts`
- Create: `README.md`
- Verify: Lighthouse scores

**Interfaces:**
- Consumes: everything from Tasks 1–9
- Produces: deployable project with documentation

- [ ] **Step 1: Create `next.config.ts`**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
  },
  experimental: {
    optimizePackageImports: ["@react-three/fiber", "@react-three/drei", "framer-motion"],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Run full test suite — all must pass**

Run: `npm test`
Expected: PASS — 9/9 tests green

- [ ] **Step 3: Build and check for errors**

```bash
npm run build
```
Expected: Build completes with no TypeScript errors. Note any warnings.

- [ ] **Step 4: Lighthouse pass**

Run: `npm run build && npm start`
Open Chrome DevTools → Lighthouse → run on `http://localhost:3000` and `http://localhost:3000/checkout`.
Target: > 90 Performance, > 90 Accessibility.

Common fixes if under 90:
- Performance: ensure Canvas is `dynamic(..., { ssr: false })`, images have `priority` on hero, no render-blocking resources.
- Accessibility: all `<img>` have `alt`, buttons have `aria-label`, color contrast meets WCAG AA.

- [ ] **Step 5: Create `README.md`**

```markdown
# Store 3D — Portfolio Demo

E-commerce demo con visor 3D interactivo por producto. Construido para demostrar capacidad técnica en React Three Fiber, Zustand, React Hook Form y Next.js 15.

**[Ver demo en vivo →](https://your-deployment-url.vercel.app)**

## Capturas

<!-- Añadir capturas aquí -->

## Decisiones técnicas

- **`frameloop="demand"`** en todos los Canvas — el renderer solo trabaja cuando hay interacción, ahorrando GPU.
- **Draco compression** en todos los GLBs — modelos < 2 MB. Decodificado en el cliente vía DRACOLoader de drei.
- **Color variants sin reload** — `THREE.Color.lerp()` en un `setInterval` de 16ms para transición suave. El intervalo se limpia al alcanzar el color objetivo.
- **Hotspots desactivados durante drag** — `pointer-events: none` + `opacity: 0` vía estado `isDragging` del `onStart`/`onEnd` de OrbitControls. Evita clics accidentales.
- **Cart persistido** — Zustand `persist` middleware con `skipHydration: true`. Rehidratación explícita en `useEffect` del Navbar para evitar errores de hidratación SSR/CSR.
- **Luhn check** — validación en Zod schema antes de la capa de React Hook Form. El validador `4111111111111111` pasa; `4111111111111110` falla.

## Stack

| Herramienta | Versión | Uso |
|---|---|---|
| Next.js | 15 | Framework, App Router |
| React Three Fiber | 8 | Renderer 3D |
| @react-three/drei | 9 | Helpers 3D (OrbitControls, Html, Environment) |
| Zustand | latest | Estado del carrito |
| Framer Motion | latest | Animaciones de UI |
| React Hook Form + Zod | latest | Formularios + validación |
| Tailwind CSS | v4 | Estilos |
| Vitest | latest | Tests del carrito |

## Ejecutar en local

```bash
git clone https://github.com/TU_USUARIO/ecommerce-3d.git
cd ecommerce-3d
npm install
npm run dev
# Abrir http://localhost:3000
```

## Tests

```bash
npm test
```

## Deploy

```bash
npm run build
```

Desplegado en Vercel con zero-config. Push a `main` dispara deploy automático.
```

- [ ] **Step 6: Push to GitHub and deploy to Vercel**

```bash
# Create repo on github.com first, then:
git remote add origin https://github.com/TU_USUARIO/ecommerce-3d.git
git push -u origin main
```

Then go to vercel.com → New Project → Import the GitHub repo → Deploy (zero config for Next.js).

After deploy, update `README.md` with the real Vercel URL.

- [ ] **Step 7: Final commit**

```bash
git add next.config.ts README.md
git commit -m "chore: production config, README, Lighthouse fixes"
git push
```

---

## Completion Criteria

All tasks done when:
- [ ] `npm test` passes 9/9
- [ ] `npm run build` completes with no TypeScript errors
- [ ] `/` renders grid + 3D hero, filters work
- [ ] `/products/[slug]` shows 3D viewer, color variants, hotspots
- [ ] CartDrawer slides in/out, persists across refresh
- [ ] Checkout 2-step validates and shows success
- [ ] Luhn rejects `4111111111111110`, accepts `4111111111111111`
- [ ] Lighthouse > 90 on `/` and `/checkout`
- [ ] README has demo link + run instructions
