const express = require("express");
const router = express.Router();
const {create,createBrand,createType,getAllCategorys,getTypeOfPs} = require("../controllers/categoryController")

router.post('/create',create)
// router.post('/createType',createType)
router.post('/create-brand',createBrand)
router.post('/create-type',createType)
router.get('/brand',getAllCategorys)

router.get('/',getTypeOfPs)

module.exports = router