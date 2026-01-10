const express = require("express");
const { signupUser } = require("../controllers/authController");
const route = express.Router();
route.post("/signup", signupUser);
module.exports = route;
