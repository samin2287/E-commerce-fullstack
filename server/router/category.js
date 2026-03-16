const express = require("express");
const multer = require("multer");
const upload = multer();
const route = express.Router();
const {
  createNewCategory,
  getAllCategories,
} = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const roleCheckMiddleware = require("../middleware/roleCheckMiddleware");
route.post(
  "/create",
  authMiddleware,
  roleCheckMiddleware("admin"),
  upload.single("thumbnail"),
  createNewCategory,
);
route.get("/all", getAllCategories);
module.exports = route;
