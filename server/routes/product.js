const express = require("express");
const router = express.Router();
const {create,getAllProducts} = require("../controllers/productController")

router.post('/create',create)
router.get('/products',getAllProducts)

module.exports = router