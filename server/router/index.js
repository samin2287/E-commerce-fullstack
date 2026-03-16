const express = require("express");
const route = express.Router();
const authRouter = require("./auth");
const productRouter = require("./product");
const { successRes } = require("../services/responseHandler");
route.use("/auth", authRouter);
route.use("/product", productRouter);
route.use("/category", require("./category"));
route.post("/", (req, res) => {
  successRes(res, 200, ["API is working"]);
});
module.exports = route;
