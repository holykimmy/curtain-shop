const express = require("express");
const router = express.Router();
const {create,getAllProducts,getFromBrand,search} = require("../controllers/productController")

router.post('/create',create)
router.get('/all',getAllProducts)
router.get('/brands',getFromBrand)
router.get('/search',search)

module.exports = router