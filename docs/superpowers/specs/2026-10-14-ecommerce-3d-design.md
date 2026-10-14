# E-Commerce 3D — Design Spec

## Goal

Tienda online de demostración para portfolio de freelancer. Cada producto se explora en 3D: rotar, hacer zoom, cambiar variante de color/material en tiempo real. Debe sentirse como producto real — rendimiento fluido, diseño cuidado, código legible por reclutadores.

**Audiencia:** Potenciales clientes en Workana, Malt, Upwork. El objetivo es demostrar capacidad técnica (R3F, animaciones, estado global, checkout) no vender productos reales.

## Stack

- **Framework:** Next.js 15 (App Router) + TypeScript estricto
- **Estilos:** Tailwind CSS v4
- **3D:** React Three Fiber + @react-three/drei
- **Estado:** Zustand con persistencia localStorage
- **Formularios:** React Hook Form + Zod
- **Animaciones:** Framer Motion (CartDrawer, transiciones de página)
- **Tests:** Vitest
- **Deploy:** Vercel

## Estructura de carpetas

```
ecommerce-3d/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                   # Home: hero 3D + product grid
│   │   ├── products/[slug]/
│   │   │   └── page.tsx               # Detalle: visor 3D + hotspots + variantes
│   │   └── checkout/
│   │       └── page.tsx               # Checkout 2 pasos
│   ├── components/
│   │   ├── three/
│   │   │   ├── HeroScene.tsx          # Producto destacado rotando (home)
│   │   │   ├── ProductViewer.tsx      # Visor completo: OrbitControls, variantes
│   │   │   ├── Hotspot.tsx            # Anotaciones HTML-over-3D en el modelo
│   │   │   └── Loader3D.tsx           # Overlay con barra de progreso %
│   │   ├── shop/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── CartDrawer.tsx         # Sidebar animado (Framer Motion)
│   │   │   └── CartItem.tsx
│   │   ├── checkout/
│   │   │   ├── StepIndicator.tsx
│   │   │   ├── ShippingForm.tsx
│   │   │   └── PaymentForm.tsx
│   │   └── ui/
│   │       ├── Navbar.tsx
│   │       ├── ThemeToggle.tsx
│   │       └── Skeleton.tsx
│   ├── store/
│   │   └── cart.ts                    # Zustand store + persist middleware
│   ├── lib/
│   │   ├── products.ts                # Mock data + getProduct / getProducts
│   │   └── types.ts
│   └── hooks/
│       └── useReducedMotion.ts
├── public/
│   ├── models/                        # .glb Draco-compressed (CC-BY)
│   └── products/                      # Fallback WebP por producto
├── data/
│   └── products.json
└── tests/
    └── cart.test.ts
```

## Modelo de datos

### Product

```typescript
interface Product {
  id: string;
  slug: string;
  name: string;
  category: "electronics" | "furniture" | "accessories" | "footwear";
  price: number;                         // EUR, sin decimales simbólicos
  description: string;                   // texto largo para página de detalle
  shortDescription: string;             // 1-2 frases para tarjeta
  featured: boolean;                    // aparece en hero home si true
  fallbackImage: string;                // ruta WebP en /public/products/
  model: {
    glb: string;                         // ruta en /public/models/
    scale: [number, number, number];
    position: [number, number, number];
    cameraPosition: [number, number, number];
  };
  variants: ProductVariant[];
  hotspots: Hotspot[];
}

interface ProductVariant {
  id: string;
  name: string;                          // "Negro", "Blanco", "Azul marino"
  color: string;                         // hex — actualiza emissive/map en material
  priceOverride?: number;               // undefined = usa el precio base
}

interface Hotspot {
  id: string;
  position: [number, number, number];   // world-space 3D coords
  label: string;                        // texto corto (tooltip)
  description: string;                  // texto expandido al clicar
}
```

### CartItem

```typescript
interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}
```

### Checkout

```typescript
interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface PaymentData {
  cardName: string;
  cardNumber: string;   // validación: 16 dígitos, Luhn check
  expiry: string;       // MM/YY
  cvv: string;          // 3-4 dígitos
}
```

## Catálogo demo (4 productos)

| Slug | Nombre | Cat. | Modelo CC-BY | Variantes |
|------|--------|------|--------------|-----------|
| `wireless-headphones` | AX-900 Headphones | electronics | Headphones GLB (Sketchfab CC-BY) | Negro, Blanco, Rojo |
| `lounge-chair` | Silla Lounge Moderna | furniture | Chair GLB (Poly Pizza CC-BY) | Natural, Nogal, Negro |
| `leather-bag` | Bolso Cuero Premium | accessories | Bag GLB (Sketchfab CC-BY) | Camel, Negro, Burdeos |
| `sneaker-x` | Sneaker X Concept | footwear | Sneaker GLB (Sketchfab CC-BY) | Blanco, Negro, Azul |

Si un modelo CC-BY no carga o no está disponible, el visor muestra geometría Three.js procedural (esfera con textura) como fallback y mantiene la interfaz funcional.

## Páginas

### Home (`/`)

- **Hero 3D:** Canvas full-width con el producto `featured: true`. Auto-rotación suave (pausada si `prefers-reduced-motion`). Botón "Ver en 3D" scroll-smooth a grid.
- **Product grid:** Máximo 8 tarjetas. Filtro por categoría (pills), precio (slider range), búsqueda (debounce 300ms), ordenación (precio ↑↓, nombre).
- Cada tarjeta: imagen WebP fallback, nombre, precio, categoría. Hover: elevación sutil + botón "Explorar en 3D".

### Página de producto (`/products/[slug]`)

- **Visor 3D izquierda (desktop) / arriba (móvil):** `<Canvas frameloop="demand">` + `OrbitControls` (rotate, zoom; no pan). Fondo neutro claro/oscuro según tema.
- **Loader:** Overlay con barra de progreso `useProgress()` mientras descarga el GLB.
- **Variantes de color:** Selector de pills debajo del visor. Al seleccionar, actualiza `emissiveColor` o `map` del material en el modelo sin recargar. Animación de transición suave (lerp de color).
- **Hotspots:** Puntos HTML posicionados via `Html` de drei (`distanceFactor` para depth). Al clicar: tooltip expandido con label + description. Solo visibles cuando no hay interacción activa (desaparecen durante drag).
- **Info derecha:** Nombre, precio, descripción, selector de variante, botón "Añadir al carrito" (animación shake + confirmación toast).
- **Fallback mobile:** Si el modelo tarda >5s en cargarse, muestra imagen WebP con indicador "Cargando modelo...".

### Checkout (`/checkout`)

- **Paso 1 — Envío:** Formulario con React Hook Form + Zod. Campos: nombre, apellido, email, dirección, ciudad, CP, país. Validación en tiempo real.
- **Paso 2 — Pago:** Campos de tarjeta con formateo automático (número de tarjeta agrupado en bloques de 4, expiración MM/YY). Validación Luhn para número de tarjeta. **No se conecta a ningún gateway real.**
- **Confirmación:** Pantalla de éxito simulado con número de pedido aleatorio. Vacía el carrito.

## Carrito (Zustand)

```typescript
interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (productId: string, variantId: string) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, qty: number) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  total: () => number;    // selector: suma price * qty de cada item
  count: () => number;    // selector: suma qty de todos los items
}
```

Persistido con `persist` middleware de Zustand en `localStorage` bajo la clave `ecommerce-3d-cart`.

CartDrawer: slide-in desde la derecha con Framer Motion (`x: "100%" → 0`). Backdrop semitransparente. Lista de items con animación de salida (`AnimatePresence`).

## 3D — Iluminación y rendimiento

- `<Environment preset="studio" />` como iluminación base.
- `<ContactShadows />` bajo cada modelo para anclar a la escena.
- `frameloop="demand"` en todos los Canvas — solo renderiza en interacción.
- Modelos Draco-compressed (`<DRACOLoader>`). Target: < 2MB por modelo.
- `<Suspense>` wrapping canvas con skeleton como fallback.
- `useGLTF.preload()` al cargar la página de producto.
- En móvil: `pixelRatio` capped a `1.5` (`Math.min(window.devicePixelRatio, 1.5)`).

## Diseño visual

- **Estética:** Minimalista premium. Mucho espacio en blanco, tipografía con peso.
- **Fuentes:** Geist Sans (UI) + Geist Mono (precios, códigos).
- **Colores base:** Fondo `#FAFAFA` (claro) / `#0A0A0A` (oscuro). Accent neutro (no saturado).
- **Modo claro/oscuro:** next-themes con toggle en navbar. Preferencia persistida.
- **Responsive:** En móvil el visor 3D ocupa el ancho completo arriba; controles de variante y info debajo. Gestos táctiles nativos vía OrbitControls.

## Accesibilidad y motion

- `prefers-reduced-motion`: desactiva auto-rotación en HeroScene, reduce duraciones de animación Framer Motion a 0.
- Botones y controles interactivos con `aria-label` explícito.
- Focus-visible visible en todo el sitio.
- Contraste mínimo WCAG AA en ambos temas.

## Rendimiento y calidad

- Lighthouse > 90 en páginas sin 3D (home con canvas lazy, checkout).
- Canvas 3D lazy: `dynamic(() => import(...), { ssr: false })`.
- Imágenes: `next/image` con formato WebP, `priority` solo en above-the-fold.
- `<Skeleton />` mientras carga data de producto (aunque sea mock, simula red con `setTimeout` 300ms).

## Tests (Vitest)

`tests/cart.test.ts` cubre:
- `addItem`: item nuevo aparece con qty 1
- `addItem` mismo producto+variante: incrementa qty
- `removeItem`: elimina item
- `updateQuantity(0)`: equivale a removeItem
- `total()`: suma correcta con variantes de precio distinto
- `count()`: suma de unidades
- `clearCart()`: deja items vacío
- `persist`: store se rehidrata correctamente desde localStorage mock

## Entregables

- Proyecto desplegado en Vercel con URL pública
- README con capturas, decisiones técnicas clave, `npm run dev`, enlace a demo
- Código con tipos estrictos, sin `any`, sin lógica duplicada
- Tests pasando en CI (`npm test`)
