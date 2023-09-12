const express = require("express");
const router = express.Router();
const { apiKey, permission } = require("../middlewares/auth.middleware");

router.use("/v1/api/product", require("./product"));
router.use("/v1/api", require("./access"));

module.exports = router;
