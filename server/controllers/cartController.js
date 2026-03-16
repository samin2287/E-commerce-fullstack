const cartSchema = require("../models/cartSchema");
const productSchema = require("../models/productSchema");
const mongoose = require("mongoose");
const isValidId = (ids) =>
  ids.every((id) => mongoose.Types.ObjectId.isValid(id));
const addToCart = async (req, res) => {
  try {
    const { productId, sku, quantity } = req.body;
    if (!productId || !sku || !quantity || quantity < 1)
      return res.status(400).json({ message: "Invalid request." });
    const productData = await productSchema.findById(productId);
    if (!productData)
      return res.status(404).json({ message: "Product not found." });
    const discountedPrice =
      productData.price * (1 - (productData.discountPercentage || 0) / 100);
    const subtotal = discountedPrice * quantity;
    let cart = await cartSchema.findOne({ user: req.user._id });
    if (cart) {
      const exists = cart.items.some((item) => item.sku === sku);
      if (exists)
        return res.status(400).json({ message: "Product already in cart" });

      cart.items.push({ product: productId, sku, quantity, subtotal });
    } else {
      cart = new cartSchema({
        user: req.user._id,
        items: [{ product: productId, sku, quantity, subtotal }],
      });
    }
    cart.totalItems = cart.items.length;
    await cart.save();

    return res.status(201).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
const getUserCart = async (req, res) => {
  try {
    const cart = await cartSchema
      .findOne({ user: req.user._id })
      .select("-user");
    return res.status(200).json({ cart });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const updateCart = async (req, res) => {
  try {
    const { itemId, productId, quantity } = req.body;
    if (!isValidId([itemId, productId]) || quantity < 1)
      return res.status(400).json({ message: "Invalid request" });

    const productData = await productSchema.findById(productId);
    if (!productData)
      return res.status(404).json({ message: "Product not found" });

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

    return res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    if (!isValidId([itemId]))
      return res.status(400).json({ message: "Invalid request" });

    const cart = await cartSchema
      .findOneAndUpdate(
        { user: req.user._id },
        { $pull: { items: { _id: itemId } } },
        { new: true },
      )
      .select("items totalItems");

    if (cart) cart.totalItems = cart.items.length;
    await cart.save();

    return res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addToCart, getUserCart, updateCart, removeFromCart };
