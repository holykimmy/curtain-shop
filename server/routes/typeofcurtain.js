const express = require("express");
const router = express.Router();
const {
  create,
  updateBg,
  getAllTypes,
  getTypeById,
  updateTypeById,
  deleteTypeById,
} = require("../controllers/typeofcurtainController");

//middleware
const uploadType = require("../middleware/typeof");
const { auth } = require("../middleware/auth");
const uploadBgtype = require("../middleware/bgtype");

router.post("/create", auth,uploadType, create);
router.put("/update-bg/:id", auth,uploadBgtype, updateBg);
router.get("/all/type", getAllTypes);
router.get("/type/:id",auth,getTypeById);
router.put("/update/:id",auth,uploadType,updateTypeById);
router.delete("/delete/:id",auth,uploadType,deleteTypeById);


module.exports = router;
