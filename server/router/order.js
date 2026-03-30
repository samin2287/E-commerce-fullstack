const express = require("express");
const route = express.Router();
const { checkOut } = require("../controllers/orderController");

route.post("/checkout", checkOut);

module.exports = route;
