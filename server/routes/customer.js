const express = require("express");
const router = express.Router();
const {
  register,
  getAllCustomers,
  search,
  createAddress,
  loginUser,
} = require("../controllers/customerController");

//middleware
const {auth} = require("../middleware/auth");


router.post("/register", register);
router.post("/add-address", auth , createAddress);
router.post("/login",loginUser)
router.get("/all", getAllCustomers);
router.get("/search", search);

module.exports = router;
