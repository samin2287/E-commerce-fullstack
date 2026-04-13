import { notFound } from "next/navigation";
import React from "react";
import ProductForm from "@/components/admin/ProductForm";
import { ADMIN_PRODUCTS } from "@/lib/data/admin";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const p = ADMIN_PRODUCTS.find((x) => x.id === id);
  return { title: p ? `Edit ${p.name}` : "Edit product" };
}

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const row = ADMIN_PRODUCTS.find((p) => p.id === id);
  if (!row) notFound();

  const initial = {
    name: row.name,
    sku: row.sku,
    price: String(row.price),
    stock: String(row.stock),
    category: row.category,
    status: row.status,
    description: "Update copy, imagery, and merchandising rules from this screen.",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
  };

  return (
    <div className="space-y-6">
      <ProductForm mode="edit" initial={initial} />
    </div>
  );
}
