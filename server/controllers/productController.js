const express = require("express");
const { SIZE_ENUM } = require("../services/validation");
const productSchema = require("../models/productSchema");
const categorySchema = require("../models/categorySchema");
const { uploadToCloudinary } = require("../services/cloudinaryService");

const createProduct = async (req, res) => {
  try {
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
    if (!title) return res.status(400).send("Product title is required");
    if (!slug) return res.status(400).send("Slug is required");
    const isSlugExist = await productSchema.findOne({
      slug: slug.toLowerCase(),
    });
    if (isSlugExist) return res.status(400).send("Slug already exist");
    if (!description) return res.status(400).send("Description is required");
    if (!category) return res.status(400).send("Category is required");
    const isCategoryExist = await categorySchema.findById(category);
    if (!isCategoryExist) return res.status(400).send("Category no exist");
    if (!price) return res.status(400).send("Price is required");
    if (price < 0) {
      return res.status(400).send("Price cannot be negative");
    }
    // Varients Validation
    if (!variants) {
      return res.status(400).send("Variants is required");
    }
    const variantsData = JSON.parse(variants);
    if (!Array.isArray(variantsData) || variantsData.length === 0) {
      return res.status(400).send("Minimum 1 variant is required.");
    }
    for (const variant of variantsData) {
      if (!variant.sku) {
        return res.status(400).send("SKU is required.");
      }
      if (!variant.color) {
        return res.status(400).send("Color is required.");
      }

      if (!variant.size) {
        return res.status(400).send("Size is required.");
      }
      variant.size = variant.size.toLowerCase();

      if (!SIZE_ENUM.includes(variant.size)) {
        return res.status(400).send("Invalid size");
      }
      if (!variant.stock || variant.stock < 1) {
        return res
          .status(400)
          .send("Stock is required and must be more than 0");
      }
    }
    const skus = variantsData.map((v) => v.sku);
    if (new Set(skus).size !== skus.length) {
      return res.status(400).json({ message: "SKU must be unique" });
    }
    if (!thumbnail || thumbnail.length === 0) {
      return res.status(400).json({ message: "Product Thumbnail is required" });
    }
    if (images && images.length > 4) {
      return res.status(400).send("You can upload max 4 images");
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
    return res.status(201).json({
      message: "Product uploaded successfully",
      data: newProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};
const getProductList = async (req, res) => {
  try {
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

    return res.status(200).json({
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
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
const getProductDetails = async (req, res) => {
  try {
    const { slug } = req.params;
    const productDetails = await productSchema
      .findOne({ slug, isActive: true })
      .populate("category", "name")
      .select("-updatedAt -__v");
    if (!productDetails)
      return res.status(404).json({ message: "Product not found" });

    return res.status(200).json({
      message: "Product Details Create Successfully",
      data: productDetails,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Server Error",
    });
  }
};
const updateProduct = async (req, res) => {
  try {
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
    if (!productData)
      return res.status(404).json({ message: "Product not found" });
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
        if (!variant.sku)
          return res.status(400).json({ message: "SKU is required" });
        if (!variant.color)
          return res.status(400).json({ message: "Color is required" });
        if (!variant.size)
          return res.status(400).json({ message: "Size is required" });
        if (!SIZE_ENUM.includes(variant.size))
          return res.status(400).json({ message: "Invalid size" });
        if (!variant.stock || variant.stock < 1)
          return res
            .status(400)
            .json({ message: "Minimum 1 Stock is Required" });
      }
      const skus = variantsData.map((v) => v.sku);
      if (new Set(skus).size !== skus.length)
        return res.status(400).json({ message: "SKU must be unique" });
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
    if (Array.isArray(images) && images.length > 0)
      totalImages += images.length;
    if (totalImages > 4)
      return res.status(400).json({ message: "Max 4 images allowed" });
    if (totalImages < 1)
      return res.status(400).json({ message: "At least 1 image required" });
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
    return res
      .status(200)
      .json({ message: "Product updated successfully", product: productData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = {
  createProduct,
  getProductList,
  getProductDetails,
  updateProduct,
};
