const express = require("express");
const router = express.Router();
const {create,getAllProducts,getFromBrand,search,getProductType,updateProduct,getProductById,deleteProduct} = require("../controllers/productController")

router.post('/create',create)
router.get('/all',getAllProducts)
router.get('/brands',getFromBrand)
router.get('/type',getProductType)
router.get('/search',search)
router.put('/update/:productId',updateProduct)
router.get('/update/:productId',getProductById)
router.delete('/delete/:productId',deleteProduct)

module.exports = router