const express = require("express");
const router = express.Router();
const {create,getAllProducts,getFromBrand,search,getProductType,updateProduct,deleteProduct} = require("../controllers/productController")

router.post('/create',create)
router.get('/all',getAllProducts)
router.get('/brands',getFromBrand)
router.get('/type',getProductType)
router.get('/search',search)
router.put('/update/:productId',updateProduct)
router.delete('/delete/:productId',deleteProduct)

module.exports = router