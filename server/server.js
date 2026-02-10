require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");

const dbConfig = require("./dbConfig");
const route = require("./router");
dbConfig();
const app = express();
const port = 8000;

app.use(express.json());

app.use(route);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
