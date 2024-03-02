const express = require("express");
const router = express.Router();
const {
  create,
  getAllProducts,
  getFromBrand,
  getFromBrandVis,
  search,
  searchVis,
  getProductType,
  getProductTypeVis,
  updateProduct,
  updateVisibility,
  getProductById,
  deleteProduct,
} = require("../controllers/productController");
//middleware
const upload = require("../middleware/product");
const { auth } = require("../middleware/auth");

router.post("/create", auth, upload, create);
router.get("/all", getAllProducts);
router.get("/brands", getFromBrand);

router.get("/type", getProductType);
router.get("/type-vis", getProductTypeVis);

router.get("/search", search);
router.get("/search-vis", searchVis);

router.put("/update/:productId", auth, upload, updateProduct);
router.put("/update-visibility/:productId", auth, updateVisibility);
router.get("/:productId", getProductById);
router.delete("/delete/:productId", auth, deleteProduct);

module.exports = router;
