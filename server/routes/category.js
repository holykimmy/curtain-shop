const express = require("express");
const router = express.Router();
const {create,createBrand,getAllCategorys,getTypeOfPs} = require("../controllers/categoryController")

router.post('/create',create)
// router.post('/createType',createType)
router.post('/create-brand',createBrand)
router.get('/brand',getAllCategorys)
router.get('/',getTypeOfPs)

module.exports = router