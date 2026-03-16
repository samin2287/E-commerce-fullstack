const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");
const {
  createProduct,
  getProductList,
  getProductDetails,
  updateProduct,
} = require("../controllers/productController");
const route = express.Router();
const multer = require("multer");
const upload = multer();
route.post(
  "/create",
  authMiddleware,
  roleCheckMiddleware("admin", "editor"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  createProduct,
);
route.get("/allproducts", getProductList);
route.get("/:slug", getProductDetails);
route.post(
  "/update/:slug",
  authMiddleware,
  roleCheckMiddleware("admin", "editor"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  updateProduct,
);
module.exports = route;
