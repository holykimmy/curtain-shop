const express = require("express");
const router = express.Router();
const {
  register,
  getAllCustomers,
  search,
  createAddress,
  loginUser,
  findAddress,
  updateAddress,
  deleteAddress
} = require("../controllers/customerController");

//middleware
const {auth} = require("../middleware/auth");


router.post("/register", register);
router.post("/add-address", auth , createAddress);
router.post("/login",loginUser)
router.get("/all", getAllCustomers);
router.get("/search", search);
router.get("/address", findAddress);
router.get("/update-address", updateAddress);
router.delete("/delete-address/:id/:addressId", auth , deleteAddress);


module.exports = router;
