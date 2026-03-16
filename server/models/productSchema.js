const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    // stock: {
    //   type: Number,
    //   required: true,
    //   min: 0,
    // },
    variants: [
      {
        sku: {
          type: String,
          required: true,
          unique: true,
        },
        color: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          required: true,
          enum: ["s", "m", "l", "xl", "2xl", "3xl"],
        },
        stock: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    tags: [
      {
        type: Array,
      },
    ],
    thumbnail: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("product", productSchema);
