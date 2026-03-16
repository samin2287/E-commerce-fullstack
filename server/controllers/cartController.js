const cartSchema = require("../models/cartSchema");
const productSchema = require("../models/productSchema");
const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const successRes = require("../services/responseHandler");
const isValidId = (ids) =>
  ids.every((id) => mongoose.Types.ObjectId.isValid(id));
const addToCart = asyncHandler(async (req, res) => {
  const { productId, sku, quantity } = req.body;
  if (!productId || !sku || !quantity || quantity < 1)
    throw new ApiError(400, "Invalid request.");
  const productData = await productSchema.findById(productId);
  if (!productData) throw new ApiError(404, "Product not found.");
  const discountedPrice =
    productData.price * (1 - (productData.discountPercentage || 0) / 100);
  const subtotal = discountedPrice * quantity;
  let cart = await cartSchema.findOne({ user: req.user._id });
  if (cart) {
    const exists = cart.items.some((item) => item.sku === sku);
    if (exists) throw new ApiError(400, "Product already in cart");
    cart.items.push({ product: productId, sku, quantity, subtotal });
  } else {
    cart = new cartSchema({
      user: req.user._id,
      items: [{ product: productId, sku, quantity, subtotal }],
    });
  }
  cart.totalItems = cart.items.length;
  await cart.save();
  successRes(res, 201, "Product added to cart", true, cart);
});
const getUserCart = asyncHandler(async (req, res) => {
  const cart = await cartSchema.findOne({ user: req.user._id }).select("-user");
  successRes(res, 200, "Cart retrieved successfully", true, { cart });
});
const updateCart = asyncHandler(async (req, res) => {
  const { itemId, productId, quantity } = req.body;
  if (!isValidId([itemId, productId]) || quantity < 1)
    throw new ApiError(400, "Invalid request");
  const productData = await productSchema.findById(productId);
  if (!productData) throw new ApiError(404, "Product not found");
  const discountedPrice =
    productData.price * (1 - (productData.discountPercentage || 0) / 100);
  const subtotal = discountedPrice * quantity;
  const cart = await cartSchema
    .findOneAndUpdate(
      { user: req.user._id, "items._id": itemId },
      {
        $set: { "items.$.quantity": quantity, "items.$.subtotal": subtotal },
      },
      { new: true },
    )
    .select("items totalItems");
  successRes(res, 200, "Cart updated", true, cart);
});
const removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.body;
  if (!isValidId([itemId])) throw new ApiError(400, "Invalid request");
  const cart = await cartSchema
    .findOneAndUpdate(
      { user: req.user._id },
      { $pull: { items: { _id: itemId } } },
      { new: true },
    )
    .select("items totalItems");
  if (cart) cart.totalItems = cart.items.length;
  await cart.save();
  successRes(res, 200, "Item removed from cart", true, cart);
});
module.exports = { addToCart, getUserCart, updateCart, removeFromCart };
