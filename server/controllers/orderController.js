const successRes = require("../services/responseHandler");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const orderSchema = require("../models/orderSchema");
const cartSchema = require("../models/cartSchema");
const stripe = require("stripe")(`process.env.STRIPE_SECRET_KEY`);

const checkOut = asyncHandler(async (req, res) => {
  const { paymentType, cartId, shippingAddress, insideDhaka } = req.body;
  const orderNumber = `ORD-${Date.now()}`;

  if (!paymentType) throw new ApiError(400, "Payment type is required!");
  if (!cartId) throw new ApiError(400, "Cart ID is required!");
  if (!shippingAddress)
    throw new ApiError(400, "Shipping address is required!");

  if (insideDhaka === undefined)
    throw new ApiError(400, "Inside Dhaka  is required!");
  const isInsideDhaka = insideDhaka === "true";

  const cartData = await cartSchema.findOne({
    _id: cartId,
    user: req.user._id,
  });
  if (!cartData) throw new ApiError(404, "Cart not found!");
  if (cartData.items.length === 0) throw new ApiError(400, "Cart is empty!");
  const charge = isInsideDhaka ? 80 : 120;
  const totalPrice = cartData.items.reduce((total, current) => {
    return (total += current.subtotal);
  }, charge);

  const orderData = new orderSchema({
    user: req.user._id,
    items: cartData.items,
    shippingAddress,
    insideDhaka: isInsideDhaka,
    deliveryCharge: charge,
    totalPrice,
    payment: {
      method: paymentType,
    },
    orderNumber,
  });
  await orderData.save();
  cartData.items = [];
  cartData.totalItems = 0;
  await cartData.save();
  if (paymentType === "cash") {
    return successRes(res, 201, ["Order placed successfully!"], orderData);
  }
  //Payment integration with stripe
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "BDT",
          product_data: {
            name: "T-Shirt",
            description: `Blue T-Shirt with chest print`,
          },
          unit_amount: 500 * 100,
        },
        quantity: 1,
      },
    ],
    customer_email: `${req.user.email}`,
    success_url: `https://example.com/success`,
    cancel_url: `https://example.com/error`,
  });
  console.log(session);

  res.redirect(303, session.url);
});

module.exports = {
  checkOut,
};
