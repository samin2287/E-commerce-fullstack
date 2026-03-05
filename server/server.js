require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const dbConfig = require("./dbConfig");
const route = require("./router");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cors());
app.use(express.json());
dbConfig();
app.use(cookieParser());
const port = 8000;

app.use(route);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
