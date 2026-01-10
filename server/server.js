const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dbConfig = require("./dbConfig");
const route = require("./router");
dbConfig();
const app = express();
const port = 8000;
app.use(express.json());
app.use(cors());
app.use(route);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
