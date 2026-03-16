const express = require("express");
const { SIZE_ENUM } = require("../services/validation");
const productSchema = require("../models/productSchema");
const categorySchema = require("../models/categorySchema");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../services/cloudinaryService");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const successRes = require("../services/responseHandler");
const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    slug,
    description,
    category,
    price,
    discountPercentage,
    variants,
    tags,
    isActive,
  } = req.body;
  const thumbnail = req.files?.thumbnail;
  const images = req.files?.images;
  if (!title) throw new ApiError(400, "Product title is required");
  if (!slug) throw new ApiError(400, "Slug is required");
  const isSlugExist = await productSchema.findOne({
    slug: slug.toLowerCase(),
  });
  if (isSlugExist) throw new ApiError(400, "Slug already exist");
  if (!description) throw new ApiError(400, "Description is required");
  if (!category) throw new ApiError(400, "Category is required");
  const isCategoryExist = await categorySchema.findById(category);
  if (!isCategoryExist) throw new ApiError(400, "Category no exist");
  if (!price) throw new ApiError(400, "Price is required");
  if (price < 0) {
    throw new ApiError(400, "Price cannot be negative");
  }
  // Varients Validation
  if (!variants) {
    throw new ApiError(400, "Variants is required");
  }
  const variantsData = JSON.parse(variants);
  if (!Array.isArray(variantsData) || variantsData.length === 0) {
    throw new ApiError(400, "Minimum 1 variant is required.");
  }
  for (const variant of variantsData) {
    if (!variant.sku) {
      throw new ApiError(400, "SKU is required.");
    }
    if (!variant.color) {
      throw new ApiError(400, "Color is required.");
    }
    if (!variant.size) {
      throw new ApiError(400, "Size is required.");
    }
    variant.size = variant.size.toLowerCase();
    if (!SIZE_ENUM.includes(variant.size)) {
      throw new ApiError(400, "Invalid size");
    }
    if (!variant.stock || variant.stock < 1) {
      throw new ApiError(400, "Stock is required and must be more than 0");
    }
  }
  const skus = variantsData.map((v) => v.sku);
  if (new Set(skus).size !== skus.length) {
    throw new ApiError(400, "SKU must be unique");
  }
  if (!thumbnail || thumbnail.length === 0) {
    throw new ApiError(400, "Product Thumbnail is required");
  }
  if (images && images.length > 4) {
    throw new ApiError(400, "You can upload max 4 images");
  }
  const thumbnailUrl = await uploadToCloudinary(thumbnail[0], "products");
  let imagesUrl = [];
  if (images) {
    const resPromise = images.map((item) =>
      uploadToCloudinary(item, "products"),
    );
    const results = await Promise.all(resPromise);
    imagesUrl = results.map((r) => r.secure_url);
  }
  const newProduct = new productSchema({
    title,
    slug: slug.toLowerCase(),
    description,
    category,
    price,
    discountPercentage,
    variants: variantsData,
    thumbnail: thumbnailUrl.secure_url,
    images: imagesUrl,
    tags,
    isActive,
  });
  await newProduct.save();
  successRes(res, 201, "Product uploaded successfully", true, newProduct);
});
const getProductList = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const category = req.query.category;
  const skip = (page - 1) * limit;
  // totalProducts with category filter if exists
  const totalProducts = category
    ? await productSchema
        .aggregate([
          { $match: { isActive: true } },
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "category",
            },
          },
          { $unwind: "$category" },
          { $match: { "category.slug": category } },
          { $count: "total" },
        ])
        .then((res) => res[0]?.total || 0)
    : await productSchema.countDocuments({ isActive: true });
  // const totalProducts = await productSchema.countDocuments();
  const pipeline = [
    { $match: { isActive: true } },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ];
  if (category) {
    pipeline.push({
      $match: {
        "category.slug": category,
      },
    });
  }
  const productList = await productSchema.aggregate(pipeline);
  const totalPages = Math.ceil(totalProducts / limit);
  successRes(res, 200, "Products fetched successfully", true, {
    products: productList,
    pagination: {
      total: totalProducts,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
});
const getProductDetails = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const productDetails = await productSchema
    .findOne({ slug, isActive: true })
    .populate("category", "name")
    .select("-updatedAt -__v");
  if (!productDetails) throw new ApiError(404, "Product not found");
  successRes(res, 200, "Product details retrieved successfully", true, {
    data: productDetails,
  });
});
const updateProduct = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    price,
    discountPercentage,
    variants,
    tags,
    isActive,
    destroyImages = [],
  } = req.body;
  const { slug } = req.params;
  const thumbnail = req.files?.thumbnail;
  const images = req.files?.images;
  const productData = await productSchema.findOne({ slug });
  if (!productData) throw new ApiError(404, "Product not found");
  if (title) productData.title = title;
  if (description) productData.description = description;
  if (category) productData.category = category;
  if (price) productData.price = price;
  if (tags && Array.isArray(tags) && tags.length > 0) productData.tags = tags;
  if (discountPercentage) productData.discountPercentage = discountPercentage;
  if (isActive !== undefined) productData.isActive = isActive === "true";
  const variantsData = variants && JSON.parse(variants);
  if (Array.isArray(variantsData) && variantsData.length > 0) {
    for (const variant of variantsData) {
      if (!variant.sku) throw new ApiError(400, "SKU is required");
      if (!variant.color) throw new ApiError(400, "Color is required");
      if (!variant.size) throw new ApiError(400, "Size is required");
      if (!SIZE_ENUM.includes(variant.size))
        throw new ApiError(400, "Invalid size");
      if (!variant.stock || variant.stock < 1)
        throw new ApiError(400, "Minimum 1 Stock is Required");
    }
    const skus = variantsData.map((v) => v.sku);
    if (new Set(skus).size !== skus.length)
      throw new ApiError(400, "SKU must be unique");
    productData.variants = variantsData;
  }
  if (thumbnail) {
    const imgPublicId = productData.thumbnail.split("/").pop().split(".")[0];
    await deleteFromCloudinary(`products/${imgPublicId}`);
    const imgRes = await uploadToCloudinary(thumbnail[0], "products");
    productData.thumbnail = imgRes.secure_url;
  }
  let imagesUrl = [];
  let totalImages = productData.images.length;
  if (destroyImages.length > 0) totalImages -= destroyImages.length;
  if (Array.isArray(images) && images.length > 0) totalImages += images.length;
  if (totalImages > 4) throw new ApiError(400, "Max 4 images allowed");
  if (totalImages < 1) throw new ApiError(400, "At least 1 image required");
  if (images && images.length > 0) {
    const results = await Promise.all(
      images.map((item) => uploadToCloudinary(item, "products")),
    );
    imagesUrl = results.map((r) => r.secure_url);
  }
  if (destroyImages.length > 0) {
    for (const url of destroyImages) {
      const imgPublicId = url.split("/").pop().split(".")[0];
      await deleteFromCloudinary(`products/${imgPublicId}`);
    }
  }
  const filteredImgs = productData.images.filter(
    (item) => !destroyImages.includes(item),
  );
  productData.images = [...imagesUrl, ...filteredImgs];
  await productData.save();
  successRes(res, 200, "Product updated successfully", true, productData);
});
module.exports = {
  createProduct,
  getProductList,
  getProductDetails,
  updateProduct,
};
