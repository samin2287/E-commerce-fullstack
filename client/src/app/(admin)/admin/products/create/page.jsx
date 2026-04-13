import React from "react";
import ProductForm from "@/components/admin/ProductForm";

export const metadata = {
  title: "Create product",
};

export default function CreateProductPage() {
  return (
    <div className="space-y-6">
      <ProductForm mode="create" />
    </div>
  );
}
