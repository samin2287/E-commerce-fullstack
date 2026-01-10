const express = require("express");
const route = express.Router();
const authRouter = require("./auth");
const productRouter = require("./product");
route.use("/auth", authRouter);
route.use("/product", productRouter);

route.post("/", (req, res) => {
  res.send("API is working");
});

module.exports = route;
