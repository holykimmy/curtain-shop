const express = require("express");
const router = express.Router();
const {
  create,
  createBrand,
  createType,
  getAllCategorys,
  getTypeOfPs,
  updateBrand
} = require("../controllers/categoryController");

//middleware
const { auth } = require("../middleware/auth");

router.post("/create", auth, create);
// router.post('/createType',createType)
router.post("/create-brand", auth, createBrand);
router.put("/update-brand/:id",auth,updateBrand)
router.post("/create-type", auth, createType);
router.get("/brand", getAllCategorys);
router.get("/type", getTypeOfPs);

module.exports = router;
