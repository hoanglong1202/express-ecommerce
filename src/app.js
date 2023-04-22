require("dotenv").config();
const compression = require("compression");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const { checkOverload } = require("./helpers/check.connect");

const app = express();

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// init db
require("./database/init.mongodb");
checkOverload();

// init routing
app.use("/", require("./routes"));

// handling error

module.exports = app;
