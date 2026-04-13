import { PRODUCTS } from "@/lib/data/products";

/** Dummy product queries — replace with API later */
export function getProducts() {
  return PRODUCTS;
}

export function getProductBySlug(slug) {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export function getRelatedProducts(slug, limit = 4) {
  const product = getProductBySlug(slug);
  if (!product) return PRODUCTS.slice(0, limit);
  return PRODUCTS.filter((p) => p.slug !== slug && p.category === product.category).slice(
    0,
    limit,
  );
}
