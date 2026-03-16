const { uploadToCloudinary } = require("../services/cloudinaryService");
const categorySchema = require("../models/categorySchema");
const createNewCategory = async (req, res) => {
  const { name, description, slug } = req.body;
  try {
    if (!name) return res.status(400).send("Category name is required!");
    if (name.length < 3) {
      return res
        .status(400)
        .send("Category name must be at least 3 characters");
    }
    if (!slug) return res.status(400).send("Slug name is required!");
    if (!req.file) return res.status(400).send("Thumbnail name is required!");
    if (!req.file.mimetype.startsWith("image")) {
      return res.status(400).send("Only image files are allowed");
    }
    if (description && description.length > 500) {
      return res.status(400).send("Description too long");
    }
    const existingSlug = await categorySchema.findOne({ slug });
    if (existingSlug)
      return res.status(400).send("Category with this Slug already exist");
    const imgRes = await uploadToCloudinary(req.file, "categories");
    const category = categorySchema({
      name,
      slug,
      description,
      thumbnail: imgRes.secure_url,
    });
    category.save();
    return res.status(201).json({
      message: "Category Created Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};
const getAllCategories = async (req, res) => {
  try {
    const categories = await categorySchema.find({});
    return res.status(200).send(categories, "Categories Fetched Successfully");
  } catch (error) {
    return res.status(500).send("Invalid Request");
  }
};

module.exports = { createNewCategory, getAllCategories };
