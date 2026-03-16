const { uploadToCloudinary } = require("../services/cloudinaryService");
const categorySchema = require("../models/categorySchema");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const successRes = require("../services/responseHandler");
const createNewCategory = asyncHandler(async (req, res) => {
  const { name, description, slug } = req.body;
  if (!name) throw new ApiError(400, "Category name is required!");
  if (name.length < 3) {
    throw new ApiError(400, "Category name must be at least 3 characters");
  }
  if (!slug) throw new ApiError(400, "Slug name is required!");
  if (!req.file) throw new ApiError(400, "Thumbnail name is required!");
  if (!req.file.mimetype.startsWith("image")) {
    throw new ApiError(400, "Only image files are allowed");
  }
  if (description && description.length > 500) {
    throw new ApiError(400, "Description too long");
  }
  const existingSlug = await categorySchema.findOne({ slug });
  if (existingSlug)
    throw new ApiError(400, "Category with this Slug already exist");

  const imgRes = await uploadToCloudinary(req.file, true, "categories");
  const category = new categorySchema({
    name,
    slug,
    description,
    thumbnail: imgRes.secure_url,
  });
  await category.save();
  successRes(res, 201, "Category Created Successfully", true, category);
});
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await categorySchema.find({});
  successRes(res, 200, "Categories Fetched Successfully", true, categories);
});
module.exports = { createNewCategory, getAllCategories };
