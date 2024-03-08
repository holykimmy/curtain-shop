const express = require("express");
const router = express.Router();
const { createQuotation } = require("../controllers/receptController");
const { auth } = require("../middleware/auth");

router.post("/create", createQuotation);

module.exports = router;
