const express = require("express");
const router = express.Router();
const { apiKey, permission } = require("../middlewares/auth.middleware");

// author
router.use("/v1/api", require("./access"));

// check api key
router.use(apiKey);

// check permission
router.use(permission("0000"));

router.use("/v1/api/product", require("./product"));

module.exports = router;
