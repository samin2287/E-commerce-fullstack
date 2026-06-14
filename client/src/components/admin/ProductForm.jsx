"use client";

import React, { useState, useEffect } from "react";
import { useCreateProductMutation, useUpdateProductMutation, useGetCategoriesQuery } from "@/app/(admin)/service/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";

const defaultValues = {
  title: "",
  slug: "",
  description: "",
  category: "",
  price: "",
  discountPercentage: 0,
  thumbnail: "",
  images: [""],
  tags: "",
  isActive: true,
  variants: [
    {
      sku: "",
      color: "",
      size: "m",
      stock: "",
    },
  ],
};

export default function ProductForm({
  mode = "create",
  initial = defaultValues,
  onSubmitted,
}) {
  const [values, setValues] = useState({ ...defaultValues, ...initial });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const MAX_IMAGES = 4;

  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const { data: catData, isLoading: catLoading, error: catError } = useGetCategoriesQuery();

  // basic change
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({
      ...v,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // variant change
  function handleVariantChange(index, e) {
    const { name, value } = e.target;
    const updated = [...values.variants];
    updated[index][name] = value;
    setValues((v) => ({ ...v, variants: updated }));
  }

  // add variant
  function addVariant() {
    setValues((v) => ({
      ...v,
      variants: [...v.variants, { sku: "", color: "", size: "m", stock: "" }],
    }));
  }

  // image change
  function handleImageChange(index, value) {
    const updated = [...values.images];
    updated[index] = value;
    setValues((v) => ({ ...v, images: updated }));
  }

  function addImage() {
    setValues((v) => ({ ...v, images: [...v.images, ""] }));
  }

  function handleThumbnailFileChange(e) {
    const f = e.target.files?.[0] ?? null;
    setThumbnailFile(f);
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    if (f) setThumbnailPreview(URL.createObjectURL(f));
    else setThumbnailPreview(null);
  }

  function handleImageFilesChange(e) {
    const files = Array.from(e.target.files || []);
    // combine with existing files and enforce max
    const combined = [...imageFiles, ...files];
    if (combined.length > MAX_IMAGES) {
      setErrorMessage(`You can upload up to ${MAX_IMAGES} images`);
      // take first MAX_IMAGES files
      const allowed = combined.slice(0, MAX_IMAGES);
      imagePreviews.forEach((u) => URL.revokeObjectURL(u));
      setImageFiles(allowed);
      const urls = allowed.map((f) => URL.createObjectURL(f));
      setImagePreviews(urls);
      return;
    }
    setErrorMessage("");
    // revoke previous previews
    imagePreviews.forEach((u) => URL.revokeObjectURL(u));
    setImageFiles(combined);
    const urls = combined.map((f) => URL.createObjectURL(f));
    setImagePreviews(urls);
  }

  useEffect(() => {
    return () => {
      // revoke object URLs on unmount
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      imagePreviews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [thumbnailPreview, imagePreviews]);

  function removeThumbnail() {
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailFile(null);
    setThumbnailPreview(null);
  }

  function removeImageAt(index) {
    const nextFiles = imageFiles.filter((_, i) => i !== index);
    const nextPreviews = imagePreviews.filter((_, i) => i !== index);
    // revoke removed preview
    const removed = imagePreviews[index];
    if (removed) URL.revokeObjectURL(removed);
    setImageFiles(nextFiles);
    setImagePreviews(nextPreviews);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const formatted = {
      ...values,
      tags: values.tags.split(",").map((t) => t.trim()),
    };

    // client-side validation to match server requirements
    if (mode === "create" && !thumbnailFile) {
      setErrorMessage("Thumbnail image is required");
      return;
    }
    if (imageFiles.length > MAX_IMAGES) {
      setErrorMessage(`You can upload up to ${MAX_IMAGES} images`);
      return;
    }
    setErrorMessage("");

    // Build FormData for file upload
    const fd = new FormData();
    fd.append("title", formatted.title);
    fd.append("slug", formatted.slug);
    fd.append("description", formatted.description);
    fd.append("category", formatted.category);
    fd.append("price", String(formatted.price));
    fd.append("discountPercentage", String(formatted.discountPercentage || 0));
    fd.append("variants", JSON.stringify(formatted.variants || []));
    fd.append("tags", JSON.stringify(formatted.tags || []));
    fd.append("isActive", String(formatted.isActive));

    if (thumbnailFile) fd.append("thumbnail", thumbnailFile);
    // append images (multiple)
    imageFiles.forEach((f) => fd.append("images", f));

    (async () => {
      try {
        if (mode === "create") {
          await createProduct(fd).unwrap();
        } else if (mode === "edit") {
          // require slug in initial for updates
          const slug = initial?.slug;
          if (!slug) throw new Error("Missing slug for update");
          await updateProduct({ slug, formData: fd }).unwrap();
        }
        onSubmitted?.(formatted);
      } catch (err) {
        console.error(err);
        alert(err?.data?.message || err?.message || "Request failed");
      }
    })();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8">
      {/* BASIC */}
      <div className="grid gap-6 md:grid-cols-2">
        <Input
          label="Title"
          name="title"
          value={values.title}
          onChange={handleChange}
          required
        />
        <Input
          label="Slug"
          name="slug"
          value={values.slug}
          onChange={handleChange}
          required
        />
        <Input
          label="Price"
          name="price"
          type="number"
          value={values.price}
          onChange={handleChange}
          required
        />
        <Input
          label="Discount %"
          name="discountPercentage"
          type="number"
          value={values.discountPercentage}
          onChange={handleChange}
        />

        {/* Category select populated from API (value is category _id) */}
        <div>
          <label className="block mb-2 font-medium">Category</label>
          <Select name="category" value={values.category} onChange={handleChange} required>
            <option value="">Select category</option>
            {catLoading && <option>Loading...</option>}
            {catError && <option>Failed to load</option>}
            {!catLoading && !catError &&
              (catData?.data || []).map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
          </Select>
        </div>

        <div className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="isActive"
            checked={values.isActive}
            onChange={handleChange}
          />
          <label>Active</label>
        </div>
      </div>

      {/* THUMBNAIL */}
      <div>
        <label className="block mb-2 font-medium">Thumbnail (file)</label>
        <input type="file" accept="image/*" onChange={handleThumbnailFileChange} />
        {thumbnailPreview ? (
          <div className="mt-3 flex items-center gap-3">
            <img
              src={thumbnailPreview}
              alt="thumbnail preview"
              className="h-16 w-16 rounded-md object-cover border"
            />
            <button
              type="button"
              className="text-sm text-red-600 underline"
              onClick={removeThumbnail}>
              Remove
            </button>
          </div>
        ) : null}
      </div>

      {/* MULTIPLE IMAGES */}
      <div>
        <p className="font-medium mb-2">Images (files)</p>
        <input type="file" accept="image/*" multiple onChange={handleImageFilesChange} />
        {imagePreviews.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-3">
            {imagePreviews.map((src, i) => (
              <div key={i} className="relative">
                <img
                  src={src}
                  alt={`preview-${i}`}
                  className="h-20 w-20 rounded-md object-cover border"
                />
                <button
                  type="button"
                  onClick={() => removeImageAt(i)}
                  className="absolute -top-2 -right-2 rounded-full bg-white text-red-600 border px-1 text-xs">
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : null}
        {errorMessage ? (
          <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
        ) : null}
      </div>

      {/* VARIANTS */}
      <div>
        <p className="font-medium mb-2">Variants</p>
        {values.variants.map((v, i) => (
          <div
            key={i}
            className="grid md:grid-cols-4 gap-3 mb-3 border p-3 rounded">
            <Input
              placeholder="SKU"
              name="sku"
              value={v.sku}
              onChange={(e) => handleVariantChange(i, e)}
            />
            <Input
              placeholder="Color"
              name="color"
              value={v.color}
              onChange={(e) => handleVariantChange(i, e)}
            />

            <Select
              name="size"
              value={v.size}
              onChange={(e) => handleVariantChange(i, e)}>
              <option value="s">S</option>
              <option value="m">M</option>
              <option value="l">L</option>
              <option value="xl">XL</option>
              <option value="2xl">2XL</option>
              <option value="3xl">3XL</option>
            </Select>

            <Input
              type="number"
              placeholder="Stock"
              name="stock"
              value={v.stock}
              onChange={(e) => handleVariantChange(i, e)}
            />
          </div>
        ))}
        <Button type="button" onClick={addVariant}>
          + Add Variant
        </Button>
      </div>

      {/* TAGS */}
      <Input
        label="Tags (comma separated)"
        name="tags"
        value={values.tags}
        onChange={handleChange}
        placeholder="shirt, cotton, summer"
      />

      {/* DESCRIPTION */}
      <Textarea
        label="Description"
        name="description"
        value={values.description}
        onChange={handleChange}
      />

      {/* ACTION */}
      <div className="flex gap-3">
        <Button type="submit" disabled={creating || updating}>
          {creating || updating ? "Saving..." : mode === "create" ? "Create" : "Update"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setValues(defaultValues)}>
          Reset
        </Button>
      </div>
    </form>
  );
}
