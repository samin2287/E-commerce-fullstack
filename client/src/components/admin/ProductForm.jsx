"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";

const defaultValues = {
  name: "",
  sku: "",
  price: "",
  stock: "",
  category: "Apparel",
  status: "Active",
  description: "",
  imageUrl: "",
};

export default function ProductForm({
  mode = "create",
  initial = defaultValues,
  onSubmitted,
}) {
  const [values, setValues] = useState({ ...defaultValues, ...initial });

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmitted?.(values);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Input
          label="Product name"
          name="name"
          value={values.name}
          onChange={handleChange}
          required
        />
        <Input label="SKU" name="sku" value={values.sku} onChange={handleChange} required />
        <Input
          label="Price (USD)"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={values.price}
          onChange={handleChange}
          required
        />
        <Input
          label="Stock"
          name="stock"
          type="number"
          min="0"
          value={values.stock}
          onChange={handleChange}
          required
        />
        <Select label="Category" name="category" value={values.category} onChange={handleChange}>
          <option>Apparel</option>
          <option>Bags</option>
          <option>Home</option>
          <option>Electronics</option>
          <option>Footwear</option>
        </Select>
        <Select label="Status" name="status" value={values.status} onChange={handleChange}>
          <option>Active</option>
          <option>Draft</option>
          <option>Archived</option>
        </Select>
      </div>
      <Input
        label="Image URL"
        name="imageUrl"
        placeholder="https://"
        value={values.imageUrl}
        onChange={handleChange}
      />
      <Textarea
        label="Description"
        name="description"
        value={values.description}
        onChange={handleChange}
      />
      <div className="flex flex-wrap gap-3">
        <Button type="submit">{mode === "create" ? "Create product" : "Save changes"}</Button>
        <Button type="button" variant="secondary" onClick={() => setValues({ ...defaultValues })}>
          Reset
        </Button>
      </div>
      <p className="text-xs text-zinc-500">
        This form is UI-only — submission does not persist data.
      </p>
    </form>
  );
}
