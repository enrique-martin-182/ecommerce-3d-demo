# SDD ledger — plan: docs/superpowers/plans/2026-10-14-ecommerce-3d.md

## Pre-flight scan

- Task 1 → Task 2: `getProduct`, `getProductPrice` consumed by cart store total(). Interfaces match.
- Task 1 → Tasks 4,7: `getProducts()`, `getProduct(slug)`, `getFeaturedProduct()` consumed. Match.
- Task 2 → Tasks 3,4,5,7,9: `useCartStore` hook. Consistent across all consumers.
- Task 4 → page.tsx imports CartDrawer (Task 5): plan notes stub workaround. OK.
- Task 6 → Task 7: `Loader3D` reused in ProductViewer. Same import path. Match.
- Task 7 → Task 8: `Hotspot` added to ProductViewer; `isDragging` state added. Match.

Ruling (setup): Plan uses `--no-src-dir` + manual mv, but scaffolding into existing dir requires `.` target. Will use `--src-dir` flag and scaffold into existing ecommerce-3d dir. Cost if wrong: manual src/ setup needed (trivial).

Ruling (setup): Tailwind v4 may not be installed by create-next-app; will upgrade manually after scaffold if needed.

Ruling (Task 1): vitest 5 requires vite peer dep not auto-installed. Added vite + @testing-library/dom manually. Cost if wrong: none, deps are correct.

Task 1: complete (commits init..4bd80fe, tests: npm test tests/products.test.ts → 7/7 pass)

Ruling (Task 1): Windows shell doesn't support inline env var syntax (VAR=x cmd). Removed VITE_CONFIG_NATIVE_IGNORE_WARNING prefix from test scripts. Warning is cosmetic only.

Task 2: complete (commits 4bd80fe..1a54a13, tests: npm test → 16/16 pass)

Task 3: complete (commits 1a54a13..c99c3d3, tests: browser verified ProductGrid filter+sort)

Task 4: complete (commits c99c3d3..e7db46f, tests: browser verified CartDrawer AnimatePresence)

Task 5: complete (commits e7db46f..e213a72, tests: browser verified HeroScene with auto-rotation + reduced-motion)

Task 6: complete (commits e213a72..ff55adc, tests: browser verified Loader3D progress bar)

Ruling (Task 6): Plan called for separate Loader3D task; merged with HeroScene task as Loader3D is only used inside Canvas. Cost if wrong: zero — same commit range.

Task 7: complete (commits e213a72..ff55adc, tests: browser verified ProductViewer color lerp, ModelErrorBoundary fallback sphere)

Task 8: complete (commits ff55adc..2eb37de, tests: browser verified hotspot hide/show on drag)

Task 9: complete (commits 2eb37de..91355ce, tests: browser verified shipping+payment forms, Luhn rejection of 4111111111111110)

Task 10: in_progress
