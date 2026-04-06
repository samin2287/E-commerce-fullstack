require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const dbConfig = require("./dbConfig");
const cloudinaryConfig = require("./config/cloudinaryConfig");
const route = require("./router");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");
const { webhook } = require("./controllers/orderController");

const app = express();

//  webhook route
app.post("/webhook", express.raw({ type: "application/json" }), webhook);

//  middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//  configs
dbConfig();
cloudinaryConfig();

//  routes
app.use(route);

// error handler
app.use(errorHandler);

const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
