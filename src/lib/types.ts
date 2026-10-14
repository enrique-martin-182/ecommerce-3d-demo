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
