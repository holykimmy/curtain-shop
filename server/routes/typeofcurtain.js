const express = require("express");
const router = express.Router();
const {
  create,
  getAllTypes,
  getTypeById,
  updateTypeById,
  deleteTypeById,
} = require("../controllers/typeofcurtainController");

//middleware
const uploadType = require("../middleware/typeof");
const { auth } = require("../middleware/auth");

router.post("/create", auth,uploadType, create);
router.get("/all/type", auth, getAllTypes);
router.get("/type/:id",auth,getTypeById);
router.put("/update/:id",auth,updateTypeById);
router.delete("/delete/:id",auth,deleteTypeById);


module.exports = router;
