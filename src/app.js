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

// helper
checkOverload();

// init routing
app.use("/", require("./routes"));

// handling error

app.use((req, res, next) => {
  const error = new Error("Page Not Found");
  error.code = 404;

  next(error);
});

app.use((error, req, res, next) => {
  const message = error.message || "Internal Server Error";
  const code = error.code || 500;

  return res.status(code).json({
    code,
    message,
  });
});
module.exports = app;
